import type { ReceiptAnalysisResult } from "@/src/components/receipt/receipt-page-client";

interface FileContext {
  selectedFile: File;
  previewUrl: string;
}

export type ReceiptState =
  | {
      type: "idle";
    }
  | ({
      type: "selected";
    } & FileContext)
  | ({
      type: "analyzing";
    } & FileContext)
  | ({
      type: "success";
      analysisResult: ReceiptAnalysisResult;
    } & FileContext)
  | ({
      type: "invalid_receipt";
    } & FileContext)
  | ({
      type: "error";
      errorMessage?: string;
    } & FileContext);

export type ReceiptAction =
  | {
      type: "SELECT_FILE";
      file: File;
      previewUrl: string;
    }
  | {
      type: "START_ANALYSIS";
    }
  | {
      type: "ANALYSIS_SUCCESS";
      analysisResult: ReceiptAnalysisResult;
    }
  | {
      type: "ANALYSIS_INVALID";
    }
  | {
      type: "ANALYSIS_ERROR";
      errorMessage?: string;
    }
  | {
      type: "RESET";
    };

export const initialReceiptState: ReceiptState = {
  type: "idle",
};

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`);
}

export function receiptReducer(
  state: ReceiptState,
  action: ReceiptAction
): ReceiptState {
  switch (action.type) {
    case "SELECT_FILE": {
      switch (state.type) {
        case "idle":
        case "selected":
        case "invalid_receipt":
        case "error": {
          return {
            type: "selected",
            selectedFile: action.file,
            previewUrl: action.previewUrl,
          };
        }

        case "analyzing":
        case "success": {
          return state;
        }

        default: {
          return assertNever(state);
        }
      }
    }

    case "START_ANALYSIS": {
      if (state.type !== "selected" && state.type !== "error") {
        return state;
      }

      return {
        type: "analyzing",
        selectedFile: state.selectedFile,
        previewUrl: state.previewUrl,
      };
    }

    case "ANALYSIS_SUCCESS": {
      if (state.type !== "analyzing") {
        return state;
      }

      return {
        type: "success",
        selectedFile: state.selectedFile,
        previewUrl: state.previewUrl,
        analysisResult: action.analysisResult,
      };
    }

    case "ANALYSIS_INVALID": {
      if (state.type !== "analyzing") {
        return state;
      }

      return {
        type: "invalid_receipt",
        selectedFile: state.selectedFile,
        previewUrl: state.previewUrl,
      };
    }

    case "ANALYSIS_ERROR": {
      if (state.type !== "analyzing") {
        return state;
      }

      return {
        type: "error",
        selectedFile: state.selectedFile,
        previewUrl: state.previewUrl,
        errorMessage: action.errorMessage,
      };
    }

    case "RESET": {
      if (state.type !== "success") {
        return state;
      }

      return initialReceiptState;
    }

    default: {
      return assertNever(action);
    }
  }
}
