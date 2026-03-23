import type { ChangeEvent, RefObject } from "react";
import { AnalyzingPanel } from "./panels/analyzing-panel";
import { UploadPanel } from "./panels/upload-panel";
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
      previewUrl?: string;
      selectedFileName?: string;
    }
  | {
      type: "upload";
      previewUrl: string;
      selectedFileName: string;
    }
  | {
      type: "upload_fail";
      previewUrl: string;
      selectedFileName: string;
      errorMessage?: string;
    }
  | {
      type: "analyzing";
      previewUrl?: string;
      selectedFileName?: string;
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
            previewUrl={viewState.previewUrl ?? null}
            selectedFileName={viewState.selectedFileName ?? null}
            onOpenFilePicker={onOpenFilePicker}
          />
        );
      }

      case "upload":
        return (
          <AnalyzingPanel
            previewUrl={viewState.previewUrl}
            imageAlt="업로드 중인 영수증"
            title="영수증 업로드 중..."
            description="영수증을 업로드하고 검증을 요청하고 있습니다"
          />
        );

      case "analyzing": {
        return (
          <AnalyzingPanel
            imageAlt="검증 중인 영수증"
            title="영수증 검증 중..."
            description="서버에서 영수증 검증 결과를 확인하고 있습니다"
            showPreview={false}
          />
        );
      }

      case "upload_fail": {
        return (
          <FailedPanel
            previewUrl={viewState.previewUrl}
            imageAlt="업로드에 실패한 영수증 이미지"
            title="업로드에 실패했습니다."
            description={viewState.errorMessage ?? "다시 시도해주세요."}
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
