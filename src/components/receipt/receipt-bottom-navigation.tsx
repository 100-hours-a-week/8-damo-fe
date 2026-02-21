import { RotateCcw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { ReceiptPageViewState } from "./receipt-page-client";
import {
  RECEIPT_BOTTOM_NAV_BOTTOM_PADDING,
  RECEIPT_BOTTOM_NAV_HEIGHT,
  RECEIPT_BOTTOM_NAV_HORIZONTAL_PADDING,
} from "./receipt-bottom-navigation.constants";

interface ReceiptBottomNavigationProps {
  viewState: ReceiptPageViewState;
  onReset: () => void;
  onAnalyze: () => void;
  onConfirm: () => void;
}

interface BottomActionConfig {
  leftLabel: string;
  leftDisabled: boolean;
  leftAction?: () => void;
  rightLabel: string;
  rightDisabled: boolean;
  rightAction?: () => void;
  showRetryIcon?: boolean;
}

function getBottomActionConfig(
  viewState: ReceiptPageViewState,
  handlers: {
    onReset: () => void;
    onAnalyze: () => void;
    onConfirm: () => void;
  }
): BottomActionConfig {
  switch (viewState.type) {
    case "idle": {
      return {
        leftLabel: "다시 선택",
        leftDisabled: true,
        rightLabel: "검증하기",
        rightDisabled: true,
      };
    }

    case "selected": {
      return {
        leftLabel: "다시 선택",
        leftDisabled: false,
        leftAction: handlers.onReset,
        rightLabel: "검증하기",
        rightDisabled: false,
        rightAction: handlers.onAnalyze,
      };
    }

    case "analyzing": {
      return {
        leftLabel: "분석 중...",
        leftDisabled: true,
        rightLabel: "검증 중...",
        rightDisabled: true,
      };
    }

    case "success": {
      return {
        leftLabel: "다시 업로드",
        leftDisabled: false,
        leftAction: handlers.onReset,
        rightLabel: "확정하기",
        rightDisabled: false,
        rightAction: handlers.onConfirm,
      };
    }

    case "invalid_receipt": {
      return {
        leftLabel: "다시 업로드",
        leftDisabled: false,
        leftAction: handlers.onReset,
        rightLabel: "재업로드 필요",
        rightDisabled: true,
      };
    }

    case "error": {
      return {
        leftLabel: "다시 업로드",
        leftDisabled: false,
        leftAction: handlers.onReset,
        rightLabel: "다시 시도",
        rightDisabled: false,
        rightAction: handlers.onAnalyze,
        showRetryIcon: true,
      };
    }

    default: {
      return {
        leftLabel: "다시 선택",
        leftDisabled: true,
        rightLabel: "검증하기",
        rightDisabled: true,
      };
    }
  }
}

export function ReceiptBottomNavigation({
  viewState,
  onReset,
  onAnalyze,
  onConfirm,
}: ReceiptBottomNavigationProps) {
  const actionConfig = getBottomActionConfig(viewState, {
    onReset,
    onAnalyze,
    onConfirm,
  });

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div
        className="mx-auto w-full min-w-[320px] max-w-[430px]"
        style={{
          paddingLeft: RECEIPT_BOTTOM_NAV_HORIZONTAL_PADDING,
          paddingRight: RECEIPT_BOTTOM_NAV_HORIZONTAL_PADDING,
          paddingBottom: RECEIPT_BOTTOM_NAV_BOTTOM_PADDING,
        }}
      >
        <div className="rounded-t-2xl border border-b-0 border-[#e5e5ea] bg-background/95 px-[clamp(0.5rem,2vw,0.75rem)] py-[clamp(0.5rem,2vw,0.75rem)] backdrop-blur-sm">
          <div className="flex gap-[clamp(0.5rem,2vw,0.75rem)]">
            <Button
              type="button"
              variant="secondary"
              className="min-w-0 flex-1 text-[clamp(0.9375rem,3.8vw,1rem)] font-semibold"
              style={{ height: RECEIPT_BOTTOM_NAV_HEIGHT }}
              disabled={actionConfig.leftDisabled}
              onClick={actionConfig.leftAction}
            >
              <span className="truncate">{actionConfig.leftLabel}</span>
            </Button>
            <Button
              type="button"
              className="min-w-0 flex-1 text-[clamp(0.9375rem,3.8vw,1rem)] font-semibold"
              style={{ height: RECEIPT_BOTTOM_NAV_HEIGHT }}
              disabled={actionConfig.rightDisabled}
              onClick={actionConfig.rightAction}
            >
              <span className="inline-flex w-4 shrink-0 items-center justify-center">
                {actionConfig.showRetryIcon ? (
                  <RotateCcw className="size-4" />
                ) : (
                  <span className="size-4 opacity-0" aria-hidden={true} />
                )}
              </span>
              <span className="truncate">{actionConfig.rightLabel}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
