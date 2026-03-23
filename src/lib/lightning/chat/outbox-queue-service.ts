import type { OutboxMessage } from "@/src/types/chat";

export interface OutboxQueueServiceOptions {
  ackTimeoutMs?: number;
  publishFn: (lightningId: string, body: string) => void;
  isPublishable: () => boolean;
}

const DEFAULT_ACK_TIMEOUT_MS = 10_000;

export class OutboxQueueService {
  private queue: OutboxMessage[] = [];
  private queuedIds = new Set<string>();
  private flushing = false;
  private pendingAcks = new Map<
    string,
    { resolve: () => void; timer: ReturnType<typeof setTimeout> }
  >();
  private listeners = new Set<() => void>();
  private snapshotCache: OutboxMessage[] = [];

  private readonly ackTimeoutMs: number;
  private readonly publishFn: (lightningId: string, body: string) => void;
  private readonly isPublishable: () => boolean;

  constructor({
    ackTimeoutMs = DEFAULT_ACK_TIMEOUT_MS,
    publishFn,
    isPublishable,
  }: OutboxQueueServiceOptions) {
    this.ackTimeoutMs = ackTimeoutMs;
    this.publishFn = publishFn;
    this.isPublishable = isPublishable;
  }

  enqueue(item: OutboxMessage): void {
    if (this.queuedIds.has(item.clientMessageId)) return;

    this.queuedIds.add(item.clientMessageId);
    this.queue.push(item);
    this.notify();
    this.tryFlush();
  }

  acknowledgeEcho(clientMessageId: string): boolean {
    const pending = this.pendingAcks.get(clientMessageId);
    if (!pending) return false;

    clearTimeout(pending.timer);
    this.pendingAcks.delete(clientMessageId);
    pending.resolve();
    return true;
  }

  async flush(): Promise<void> {
    if (this.flushing) return;
    this.flushing = true;

    try {
      while (true) {
        const item = this.findNextPending();
        if (!item) break;
        if (!this.isPublishable()) break;

        this.updateStatus(item.clientMessageId, "sending");

        try {
          this.publishFn(
            item.lightningId,
            JSON.stringify(item.body)
          );
        } catch {
          this.updateStatus(item.clientMessageId, "failed");
          continue;
        }

        const acked = await this.waitForAck(item.clientMessageId);

        if (acked) {
          this.dequeue(item.clientMessageId);
        } else {
          this.updateStatus(item.clientMessageId, "failed");
        }
      }
    } finally {
      this.flushing = false;
    }
  }

  tryFlush(): void {
    if (!this.isPublishable()) return;
    if (this.flushing) return;
    void this.flush();
  }

  retry(clientMessageId: string): void {
    const item = this.queue.find(
      (i) => i.clientMessageId === clientMessageId
    );
    if (!item) return;

    item.status = "pending";
    item.retryCount += 1;
    this.notify();
    this.tryFlush();
  }

  cancel(clientMessageId: string): void {
    this.dequeue(clientMessageId);
  }

  getSnapshot(): OutboxMessage[] {
    return this.snapshotCache;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  clear(): void {
    for (const [, pending] of this.pendingAcks) {
      clearTimeout(pending.timer);
    }
    this.pendingAcks.clear();
    this.queue.length = 0;
    this.queuedIds.clear();
    this.flushing = false;
    this.notify();
  }

  private findNextPending(): OutboxMessage | undefined {
    return this.queue.find((item) => item.status === "pending");
  }

  private updateStatus(
    clientMessageId: string,
    status: OutboxMessage["status"]
  ): void {
    const item = this.queue.find(
      (i) => i.clientMessageId === clientMessageId
    );
    if (!item || item.status === status) return;

    const wasFailed = item.status === "failed";
    item.status = status;

    // pending→sending은 UI 변화 없음 → notify 생략
    if (status === "failed" || wasFailed) {
      this.notify();
    }
  }

  private dequeue(clientMessageId: string): void {
    const index = this.queue.findIndex(
      (i) => i.clientMessageId === clientMessageId
    );
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.queuedIds.delete(clientMessageId);
      this.notify();
    }
  }

  private waitForAck(clientMessageId: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => {
        this.pendingAcks.delete(clientMessageId);
        resolve(false);
      }, this.ackTimeoutMs);

      this.pendingAcks.set(clientMessageId, {
        resolve: () => resolve(true),
        timer,
      });
    });
  }

  private notify(): void {
    this.snapshotCache = [...this.queue];
    for (const listener of this.listeners) {
      listener();
    }
  }
}
