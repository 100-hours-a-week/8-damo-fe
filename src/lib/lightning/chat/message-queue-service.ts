import type { ChatBroadcastMessage } from "@/src/types/chat";

export interface MessageQueueServiceOptions {
  intervalMs?: number;
  getBatchSize?: (queueSize: number) => number;
  onDrain: (messages: ChatBroadcastMessage[]) => void;
}

const DEFAULT_INTERVAL_MS = 48;

export function getAdaptiveBatchSize(queueSize: number) {
  if (queueSize >= 200) return 40;
  if (queueSize >= 100) return 24;
  if (queueSize >= 30) return 12;
  return 6;
}

export class MessageQueueService {
  private readonly queue: ChatBroadcastMessage[] = [];
  private readonly queuedIds = new Set<string>();
  private readonly intervalMs: number;
  private readonly getBatchSize: (queueSize: number) => number;
  private readonly onDrain: (messages: ChatBroadcastMessage[]) => void;
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor({
    intervalMs = DEFAULT_INTERVAL_MS,
    getBatchSize = getAdaptiveBatchSize,
    onDrain,
  }: MessageQueueServiceOptions) {
    this.intervalMs = intervalMs;
    this.getBatchSize = getBatchSize;
    this.onDrain = onDrain;
  }

  enqueue(message: ChatBroadcastMessage) {
    const messageId = String(message.messageId);
    if (this.queuedIds.has(messageId)) return;

    this.queuedIds.add(messageId);
    this.queue.push(message);
    this.start();
  }

  dequeueMany(count: number) {
    if (count <= 0 || this.queue.length === 0) return [];

    const messages = this.queue.splice(0, count);
    for (const message of messages) {
      this.queuedIds.delete(String(message.messageId));
    }

    return messages;
  }

  size() {
    return this.queue.length;
  }

  clear() {
    this.queue.length = 0;
    this.queuedIds.clear();
  }

  start() {
    if (this.timerId) return;

    this.timerId = setInterval(() => {
      if (this.queue.length === 0) {
        this.stop();
        return;
      }

      const batch = this.dequeueMany(this.getBatchSize(this.queue.length));
      if (batch.length > 0) {
        this.onDrain(batch);
      }
    }, this.intervalMs);
  }

  stop() {
    if (!this.timerId) return;

    clearInterval(this.timerId);
    this.timerId = null;
  }
}
