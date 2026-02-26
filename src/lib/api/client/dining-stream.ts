import type { RecommendationStreamMessage } from "@/src/types/api/dining";

interface ConnectDiningRecommendationStreamParams {
  groupId: string;
  diningId: string;
  onOpen?: () => void;
  onMessage?: (message: RecommendationStreamMessage) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
}

function parseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toRecommendationStreamMessage(
  value: unknown
): RecommendationStreamMessage | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as RecommendationStreamMessage & {userId: string;};

  const isValid =
    typeof candidate.eventId === "string" &&
    typeof candidate.userId === "string" &&
    typeof candidate.nickname === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.createdAt === "string";

  if (!isValid) return null;

  return {
    eventId: candidate.eventId,
    userId: String(candidate.userId),
    nickname: candidate.nickname,
    content: candidate.content,
    createdAt: candidate.createdAt,
  };
}

function toRecommendationStreamPath(params: {
  groupId: string;
  diningId: string;
}): string {
  const { groupId, diningId } = params;
  return `/bff/groups/${encodeURIComponent(groupId)}/dining/${encodeURIComponent(diningId)}/recommendation-streaming`;
}

export function connectDiningRecommendationStream({
  groupId,
  diningId,
  onOpen,
  onMessage,
  onDone,
  onError,
}: ConnectDiningRecommendationStreamParams): () => void {
  const source = new EventSource(
    toRecommendationStreamPath({ groupId, diningId })
  );

  source.onopen = () => {
    onOpen?.();
  };

  source.onmessage = (event) => {
    const parsed = parseJson<RecommendationStreamMessage>(event.data);
    if (!parsed) return;
    const message = toRecommendationStreamMessage(parsed);
    if (!message) return;
    onMessage?.(message);
  };

  source.addEventListener("done", () => {
    onDone?.();
  });

  source.onerror = () => {
    onError?.("추천 대화 연결이 불안정합니다. 다시 시도해주세요.");
  };

  return () => {
    source.close();
  };
}
