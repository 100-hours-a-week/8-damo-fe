interface FileContext {
  selectedFile: File;
  previewUrl: string;
}

export type ReceiptState =
  | {
      type: "idle";
      selectedFile?: File;
      previewUrl?: string;
    }
  | ({
      type: "upload";
    } & FileContext)
  | ({
      type: "upload_fail";
      errorMessage?: string;
    } & FileContext)
  | {
      type: "analyzing";
      selectedFile?: File;
      previewUrl?: string;
    };

export type ReceiptAction =
  | {
      type: "SELECT_FILE";
      file: File;
      previewUrl: string;
    }
  | {
      type: "START_UPLOAD";
    }
  | {
      type: "UPLOAD_FAIL";
      errorMessage?: string;
    }
  | {
      type: "START_ANALYZING";
    }
  | {
      type: "RESET";
    };

export const initialReceiptState: ReceiptState = {
  type: "idle",
};

export function getInitialReceiptState(initialOcrStatus: "PENDING" | "SUCCESS" | "FAIL" | null) {
  if (initialOcrStatus === "PENDING") {
    return {
      type: "analyzing",
    } satisfies ReceiptState;
  }

  return initialReceiptState;
}

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
        case "upload_fail":
        case "analyzing": {
          return {
            type: "idle",
            selectedFile: action.file,
            previewUrl: action.previewUrl,
          };
        }

        case "upload": {
          return state;
        }

        default: {
          return assertNever(state);
        }
      }
    }

    case "START_UPLOAD": {
      if (!state.selectedFile || !state.previewUrl) {
        return state;
      }

      return {
        type: "upload",
        selectedFile: state.selectedFile,
        previewUrl: state.previewUrl,
      };
    }

    case "UPLOAD_FAIL": {
      if (state.type !== "upload") {
        return state;
      }

      return {
        type: "upload_fail",
        selectedFile: state.selectedFile,
        previewUrl: state.previewUrl,
        errorMessage: action.errorMessage,
      };
    }

    case "START_ANALYZING": {
      if (state.type !== "upload") {
        return state;
      }

      return {
        type: "analyzing",
        selectedFile: state.selectedFile,
        previewUrl: state.previewUrl,
      };
    }

    case "RESET": {
      if (state.type === "idle") {
        return state;
      }

      return initialReceiptState;
    }

    default: {
      return assertNever(action);
    }
  }
}
