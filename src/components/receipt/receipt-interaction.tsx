"use client";

import { type ChangeEvent, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ReceiptPageClient,
  type ReceiptPageViewState,
} from "@/src/components/receipt/receipt-page-client";
import { ReceiptBottomNavigation } from "@/src/components/receipt/receipt-bottom-navigation";
import { toast } from "@/src/components/ui/sonner";
import { useDiningReceiptStatus } from "@/src/hooks/use-dining-receipt-status";
import {
  getInitialReceiptState,
  receiptReducer,
  type ReceiptState,
} from "./receipt.reducer";
import { uploadReceipt } from "@/src/lib/api/client/dining";
import { getPresignedUrl } from "@/src/lib/api/client/s3";
import { getImageContentType } from "@/src/constants/s3/util";
import type { ApiResponse } from "@/src/lib/api/client";
import type { ReceiptOcrStatus } from "@/src/types/api/dining";

interface ReceiptInteractionProps {
  groupId: string;
  diningId: string;
  initialReceiptOcrStatus: ReceiptOcrStatus;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["jpg", "png"]);

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function toViewState(state: ReceiptState): ReceiptPageViewState {
  switch (state.type) {
    case "idle": {
      return {
        type: "idle",
        previewUrl: state.previewUrl,
        selectedFileName: state.selectedFile?.name,
      };
    }

    case "upload": {
      return {
        type: "upload",
        previewUrl: state.previewUrl,
        selectedFileName: state.selectedFile.name,
      };
    }

    case "upload_fail": {
      return {
        type: "upload_fail",
        previewUrl: state.previewUrl,
        selectedFileName: state.selectedFile.name,
        errorMessage: state.errorMessage,
      };
    }

    case "analyzing": {
      return {
        type: "analyzing",
        previewUrl: state.previewUrl,
        selectedFileName: state.selectedFile?.name,
      };
    }

    default: {
      return {
        type: "idle",
      };
    }
  }
}

export function ReceiptInteraction({
  groupId,
  diningId,
  initialReceiptOcrStatus,
}: ReceiptInteractionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [state, dispatch] = useReducer(
    receiptReducer,
    initialReceiptOcrStatus,
    getInitialReceiptState
  );
  const { data: receiptStatus } = useDiningReceiptStatus(
    groupId,
    diningId,
    state.type === "analyzing",
    initialReceiptOcrStatus
  );
  const uploadFailMessage =
    state.type === "upload_fail" ? state.errorMessage : undefined;

  useEffect(() => {
    return () => {
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

  const openFilePicker = () => {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const resetToIdle = () => {
    if (state.selectedFile && state.previewUrl) {
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

  const handleUploadError = (fallback: string, response?: ApiResponse<unknown>) => {
    const errorMessage = response?.errorMessage ?? fallback;

    dispatch({
      type: "UPLOAD_FAIL",
      errorMessage,
    });
  };

  const handleConfirm = async () => {
    if (!state.selectedFile || !state.previewUrl) {
      toast.error("먼저 영수증 이미지를 선택해주세요.");
      return;
    }

    const file = state.selectedFile;
    const contentType = getImageContentType(file);

    if (!contentType) {
      toast.error("지원하지 않는 이미지 형식입니다.");
      return;
    }

    dispatch({ type: "START_UPLOAD" });

    let presignedResult: Awaited<ReturnType<typeof getPresignedUrl>>;
    try {
      presignedResult = await getPresignedUrl({
        directory: "dining/receipt",
        fileName: diningId,
        contentType,
      });
    } catch (error: unknown) {
      const apiError = (error as { response?: { data?: ApiResponse<unknown> } })?.response?.data;
      handleUploadError("영수증 업로드에 실패했습니다. 다시 시도해주세요.", apiError);
      return;
    }

    const s3Response = await fetch(presignedResult.data.presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });

    if (!s3Response.ok) {
      handleUploadError("영수증 업로드에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    try {
      await uploadReceipt({
        groupId,
        diningId,
        receiptUrl: presignedResult.data.objectKey,
      });
      await queryClient.removeQueries({
        queryKey: ["dining", "detail", groupId, diningId, "receipt-ocr-status"],
      });
      dispatch({ type: "START_ANALYZING" });
    } catch (error: unknown) {
      const apiError = (error as { response?: { data?: ApiResponse<unknown> } })?.response?.data;
      handleUploadError("영수증 업로드에 실패했습니다. 다시 시도해주세요.", apiError);
    }
  };

  useEffect(() => {
    if (state.type !== "upload_fail") {
      return;
    }

    toast.error(uploadFailMessage ?? "영수증 업로드에 실패했습니다. 다시 시도해주세요.");
  }, [state.type, uploadFailMessage]);

  useEffect(() => {
    if (state.type !== "analyzing") {
      return;
    }

    if (receiptStatus !== "SUCCESS" && receiptStatus !== "FAIL") {
      return;
    }

    const completeReceiptFlow = async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dining", "detail", groupId, diningId, "common"],
      });

      if (receiptStatus === "SUCCESS") {
        toast("영수증 검증에 성공하셨습니다!");
      } else {
        toast.error("올바른 영수증 이미지를 올려주세요");
      }

      router.push(`/groups/${groupId}/dining/${diningId}`);
    };

    void completeReceiptFlow();
  }, [diningId, groupId, queryClient, receiptStatus, router, state.type]);

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
        onConfirm={handleConfirm}
      />
    </div>
  );
}
