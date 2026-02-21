import type { ChangeEvent, RefObject } from "react";
import { AnalyzingPanel } from "./panels/analyzing-panel";
import { UploadPanel } from "./panels/upload-panel";
import { SuccessPanel } from "./panels/success-panel";
import { FailedPanel } from "./panels/failed-panel";
import { RECEIPT_BOTTOM_NAV_RESERVED_SPACE } from "./receipt-bottom-navigation.constants";

export interface ReceiptAnalysisResult {
  confidence: number;
  isReceipt: boolean;
  analyzedAt: string;
}

export type ReceiptPageViewState =
  | {
      type: "idle";
    }
  | {
      type: "selected";
      previewUrl: string;
      selectedFileName: string;
    }
  | {
      type: "analyzing";
      previewUrl: string;
      selectedFileName: string;
    }
  | {
      type: "success";
      analysisResult: ReceiptAnalysisResult;
      previewUrl: string;
      selectedFileName: string;
    }
  | {
      type: "invalid_receipt";
      previewUrl: string;
      selectedFileName: string;
    }
  | {
      type: "error";
      previewUrl: string;
      selectedFileName: string;
      errorMessage?: string;
    };

interface ReceiptPageClientProps {
  viewState: ReceiptPageViewState;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenFilePicker: () => void;
}

export function ReceiptPageClient({
  viewState,
  fileInputRef,
  onFileChange,
  onOpenFilePicker,
}: ReceiptPageClientProps) {
  const renderContent = () => {
    switch (viewState.type) {
      case "idle": {
        return (
          <UploadPanel
            previewUrl={null}
            selectedFileName={null}
            onOpenFilePicker={onOpenFilePicker}
          />
        );
      }

      case "selected": {
        return (
          <UploadPanel
            previewUrl={viewState.previewUrl}
            selectedFileName={viewState.selectedFileName}
            onOpenFilePicker={onOpenFilePicker}
          />
        );
      }

      case "analyzing": {
        return <AnalyzingPanel previewUrl={viewState.previewUrl} />;
      }

      case "success": {
        return (
          <SuccessPanel
            previewUrl={viewState.previewUrl}
            imageAlt="유효한 영수증 이미지"
            title="유효한 영수증입니다."
            description="현재 영수증으로 회식을 확정할까요?"
            analysisResult={viewState.analysisResult}
          />
        );
      }

      case "invalid_receipt": {
        return (
          <FailedPanel
            previewUrl={viewState.previewUrl}
            imageAlt="유효하지 않은 영수증 이미지"
            title="유효하지 않은 영수증입니다."
            description="다시 업로드해주세요."
          />
        );
      }

      case "error": {
        return (
          <FailedPanel
            previewUrl={viewState.previewUrl}
            imageAlt="시스템 오류가 발생한 이미지"
            title="시스템 오류가 발생했습니다."
            description={
              viewState.errorMessage ?? "다시 시도해주세요."
            }
          />
        );
      }

      default: {
        return null;
      }
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f5f5f7]">
      <div
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-[clamp(0.75rem,4vw,1.25rem)] py-[clamp(0.75rem,3vw,1.25rem)]"
        style={{ paddingBottom: RECEIPT_BOTTOM_NAV_RESERVED_SPACE }}
      >
        {renderContent()}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.png,image/jpeg,image/png"
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
