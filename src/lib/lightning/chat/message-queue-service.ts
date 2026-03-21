import type { ChatBroadcastMessage } from "@/src/types/chat";

export interface MessageQueueServiceOptions {
  intervalMs?: number;
  getBatchSize?: (queueSize: number) => number;
  onDrain: (messages: ChatBroadcastMessage[]) => void;
}

const DEFAULT_INTERVAL_MS = 48; // 60 fps 기준 3프레임(~50ms)
const MAX_PARTICIPANTS = 8; // 번개 모임 최대 인원
const BATCH_SIZE = MAX_PARTICIPANTS; // 최대 인원만큼 배치사이즈 적용

export function getAdaptiveBatchSize(queueSize: number) {
  // MAX_PARTICIPANTS * 3 이상: 재연결 또는 비정상 누적 상황 -> 빠르게 burst
  if (queueSize >= MAX_PARTICIPANTS * 3) return BATCH_SIZE * 2;
  return BATCH_SIZE;
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
