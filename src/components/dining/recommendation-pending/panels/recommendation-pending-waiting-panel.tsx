import type { RecommendationStreamStatus } from "@/src/types/api/dining";

interface RecommendationPendingWaitingPanelProps {
  status: Exclude<RecommendationStreamStatus, "streaming" | "error">;
}

const WAITING_MESSAGES: Record<
  RecommendationPendingWaitingPanelProps["status"],
  string
> = {
  idle: "추천 메시지를 준비 중입니다. 곧 AI봇 대화가 나타나요.",
  connecting: "연결이 완료되면 회의 로그가 이 영역에 실시간으로 표시됩니다.",
  connected: "회의가 시작됐어요. 첫 추천 메시지를 기다리는 중입니다.",
  disconnected: "연결이 잠시 중단되었어요. 상태를 확인하고 있어요.",
};

export function RecommendationPendingWaitingPanel({
  status,
}: RecommendationPendingWaitingPanelProps) {
  return (
    <div className="relative mt-3 rounded-2xl border border-[#ffe3c6] bg-[#fffdf9] px-3 py-3">
      <p className="text-[12px] leading-5 text-[#8a623d]">
        {WAITING_MESSAGES[status]}
      </p>
      <div className="mt-2 space-y-1.5">
        <div className="h-2 w-[72%] rounded-full bg-[#ffe3c6] animate-pulse" />
        <div
          className="h-2 w-[56%] rounded-full bg-[#ffe9d0] animate-pulse"
          style={{ animationDelay: "130ms" }}
        />
      </div>
    </div>
  );
}
