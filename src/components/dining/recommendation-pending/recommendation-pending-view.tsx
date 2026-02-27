"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { RecommendationStreamStatus } from "@/src/types/api/dining";
import { RecommendationPendingMessage } from "./recommendation-pending-message";
import type {
  RecommendationPendingStatusUiMap,
  RecommendationPendingViewState,
} from "./recommendation-pending-view.types";
import { RecommendationPendingStreamingPanel } from "./panels/recommendation-pending-streaming-panel";
import { RecommendationPendingWaitingPanel } from "./panels/recommendation-pending-waiting-panel";
import { RecommendationPendingErrorPanel } from "./panels/recommendation-pending-error-panel";

interface RecommendationPendingViewProps {
  viewState: RecommendationPendingViewState;
  onReconnect: () => void;
}

const STATUS_UI_CONFIG: RecommendationPendingStatusUiMap = {
  idle: {
    label: "준비 중",
    description: "다모 AI봇들을 모아볼까요? 🏘️",
    panelKind: "waiting",
    tone: "normal",
  },
  connecting: {
    label: "연결 중",
    description: "다모 AI봇들을 모으고 있어요.",
    panelKind: "waiting",
    tone: "normal",
  },
  connected: {
    label: "대화 시작",
    description: "다모 AI봇들이 모두 모였어요.",
    panelKind: "waiting",
    tone: "normal",
  },
  streaming: {
    label: "수집 중",
    description: "다모 AI봇들이 메뉴 회의를 하고 있어요 👨‍🍳🤖",
    panelKind: "streaming",
    tone: "normal",
  },
  error: {
    label: "연결 오류",
    description: "추천 대화 연결이 불안정해요.",
    panelKind: "error",
    tone: "error",
  },
  disconnected: {
    label: "일시 중단",
    description: "연결이 잠시 중단되었어요. 상태를 다시 확인하고 있어요.",
    panelKind: "waiting",
    tone: "normal",
  },
};

const EXPIRED_DESCRIPTION =
  "추천이 예상보다 오래 걸리고 있어요. 연결을 다시 시도해 주세요.";

function isStreamingState(
  viewState: RecommendationPendingViewState
): viewState is Extract<RecommendationPendingViewState, { type: "streaming" }> {
  return viewState.type === "streaming";
}

function isErrorState(
  viewState: RecommendationPendingViewState
): viewState is Extract<RecommendationPendingViewState, { type: "error" }> {
  return viewState.type === "error";
}

function getDescription(viewState: RecommendationPendingViewState): string {
  if (viewState.isExpired) {
    return EXPIRED_DESCRIPTION;
  }

  if (isErrorState(viewState) && viewState.errorMessage) {
    return viewState.errorMessage;
  }

  return STATUS_UI_CONFIG[viewState.type].description;
}

function getStatusIndicator(
  status: RecommendationStreamStatus,
  tone: "normal" | "error"
) {
  if (status === "connecting") {
    return <Loader2 className="size-3 animate-spin" />;
  }

  return (
    <span className="relative flex size-2.5">
      <span
        className={[
          "absolute inline-flex h-full w-full rounded-full opacity-75",
          tone === "error" ? "bg-[#ff6b6b]/60" : "animate-ping bg-[#ff8d28]/55",
        ].join(" ")}
      />
      <span
        className={[
          "relative inline-flex size-2.5 rounded-full",
          tone === "error" ? "bg-[#ff6b6b]" : "bg-[#ff8d28]",
        ].join(" ")}
      />
    </span>
  );
}

function renderBody(viewState: RecommendationPendingViewState) {
  if (isStreamingState(viewState)) {
    return <RecommendationPendingStreamingPanel messages={viewState.messages} />;
  }

  if (isErrorState(viewState)) {
    return (
      <RecommendationPendingErrorPanel
        errorMessage={
          viewState.errorMessage ??
          STATUS_UI_CONFIG.error.description
        }
      />
    );
  }

  return <RecommendationPendingWaitingPanel status={viewState.type} />;
}

export function RecommendationPendingView({
  viewState,
  onReconnect,
}: RecommendationPendingViewProps) {
  const statusUi = STATUS_UI_CONFIG[viewState.type];
  const description = getDescription(viewState);
  const isRetryAvailable = viewState.type === "error" || viewState.isExpired;

  return (
    <section className="relative w-full rounded-[22px] border border-[#ffd7b5] sm:p-5">

      <div className="relative flex items-start justify-between gap-3">
        <RecommendationPendingMessage description={description} />
        <div
          className={[
            "inline-flex min-w-[88px] items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            statusUi.tone === "error"
              ? "border-[#ffd1d1] bg-[#fff3f3] text-[#d64040]"
              : "border-[#ffd7b0] bg-white/80 text-[#cd6f1f]",
          ].join(" ")}
        >
          {getStatusIndicator(viewState.type, statusUi.tone)}
          <span>{statusUi.label}</span>
        </div>
      </div>

      {renderBody(viewState)}

      {isRetryAvailable ? (
        <div className="mt-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full rounded-xl border-[#ffcf9f] bg-white/80 text-[13px] font-semibold text-[#b2611f] active:bg-[#fff1e3]"
            onClick={onReconnect}
          >
            {viewState.retryCount > 0
              ? `연결 다시 시도 (${viewState.retryCount + 1}회차)`
              : "연결 다시 시도"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
