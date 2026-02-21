"use client";

import { type ChangeEvent, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ReceiptPageClient,
  type ReceiptPageViewState,
} from "@/src/components/receipt/receipt-page-client";
import { ReceiptBottomNavigation } from "@/src/components/receipt/receipt-bottom-navigation";
import { toast } from "@/src/components/ui/sonner";
import {
  initialReceiptState,
  receiptReducer,
  type ReceiptState,
} from "./receipt.reducer";
import { classifyReceiptImage } from "@/src/lib/receipt/receipt-classifier";

interface ReceiptInteractionProps {
  groupId: string;
  diningId: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["jpg", "png"]);

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function formatAnalyzedAt(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function toViewState(state: ReceiptState): ReceiptPageViewState {
  switch (state.type) {
    case "idle": {
      return {
        type: "idle",
      };
    }

    case "selected": {
      return {
        type: "selected",
        previewUrl: state.previewUrl,
        selectedFileName: state.selectedFile.name,
      };
    }

    case "analyzing": {
      return {
        type: "analyzing",
        previewUrl: state.previewUrl,
        selectedFileName: state.selectedFile.name,
      };
    }

    case "success": {
      return {
        type: "success",
        previewUrl: state.previewUrl,
        selectedFileName: state.selectedFile.name,
        analysisResult: state.analysisResult,
      };
    }

    case "invalid_receipt": {
      return {
        type: "invalid_receipt",
        previewUrl: state.previewUrl,
        selectedFileName: state.selectedFile.name,
      };
    }

    case "error": {
      return {
        type: "error",
        previewUrl: state.previewUrl,
        selectedFileName: state.selectedFile.name,
        errorMessage: state.errorMessage,
      };
    }

    default: {
      return {
        type: "idle",
      };
    }
  }
}

export function ReceiptInteraction({ groupId, diningId }: ReceiptInteractionProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  const [state, dispatch] = useReducer(receiptReducer, initialReceiptState);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const openFilePicker = () => {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const resetToIdle = () => {
    if (state.type === "success") {
      clearPreviewUrl();
      resetInput();
      dispatch({ type: "RESET" });
      return;
    }

    if (
      state.type === "selected" ||
      state.type === "invalid_receipt" ||
      state.type === "error"
    ) {
      openFilePicker();
    }
  };

  const handleSelectFile = (file: File) => {
    const extension = getFileExtension(file.name);
    const isSupportedImage = ALLOWED_EXTENSIONS.has(extension);

    if (!isSupportedImage) {
      toast.error("JPG, PNG 파일만 업로드할 수 있어요.");
      resetInput();
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("이미지는 10MB 이하만 업로드할 수 있어요.");
      resetInput();
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    previewUrlRef.current = nextPreviewUrl;

    dispatch({
      type: "SELECT_FILE",
      file,
      previewUrl: nextPreviewUrl,
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    handleSelectFile(file);
  };

  const handleAnalyze = async () => {
    if (state.type !== "selected" && state.type !== "error") {
      toast.error("먼저 영수증 이미지를 선택해주세요.");
      return;
    }

    dispatch({ type: "START_ANALYSIS" });

    try {
      const result = await classifyReceiptImage(state.selectedFile);
      if (!isMountedRef.current) {
        return;
      }

      if (!result.isReceipt) {
        dispatch({ type: "ANALYSIS_INVALID" });
        return;
      }

      dispatch({
        type: "ANALYSIS_SUCCESS",
        analysisResult: {
          ...result,
          analyzedAt: formatAnalyzedAt(new Date()),
        },
      });
    } catch (error) {
      console.log(error);
      if (!isMountedRef.current) {
        return;
      }

      dispatch({
        type: "ANALYSIS_ERROR",
        errorMessage: "모델 실행 중 오류가 발생했습니다.",
      });
    }
  };

  const handleConfirm = () => {
    toast.success("영수증 확인이 완료되었습니다.");
    router.push(`/groups/${groupId}/dining/${diningId}`);
  };

  const viewState = toViewState(state);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ReceiptPageClient
        viewState={viewState}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onOpenFilePicker={openFilePicker}
      />
      <ReceiptBottomNavigation
        viewState={viewState}
        onReset={resetToIdle}
        onAnalyze={handleAnalyze}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
