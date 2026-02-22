export type DiningState =
  | {
      type: "attendance-voting";
    }
  | {
      type: "recommendation-pending";
    }
  | {
      type: "restaurant-voting";
    }
  | {
      type: "confirmed";
    };

export type DiningAction =
  | {
      type: "ATTENDANCE_VOTING_COMPLETED";
    }
  | {
      type: "RECOMMENDATION_READY";
    }
  | {
      type: "CONFIRM_RESTAURANT";
    }
  | {
      type: "RETRY_RECOMMENDATION";
    }

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`);
}

export function diningDetailReducer(
  state: DiningState,
  action: DiningAction
): DiningState {
  switch (state.type) {
    case "attendance-voting": {
      if (action.type === "ATTENDANCE_VOTING_COMPLETED") {
        return { type: "recommendation-pending" };
      }
      return state;
    }

    case "recommendation-pending": {
      if (action.type === "RECOMMENDATION_READY") {
        return { type: "restaurant-voting" };
      }
      return state;
    }

    case "restaurant-voting": {
      if (action.type === "CONFIRM_RESTAURANT") {
        return { type: "confirmed" };
      }

      if (action.type === "RETRY_RECOMMENDATION") {
        return { type: "recommendation-pending" };
      }

      return state;
    }

    case "confirmed": {
      return state;
    }

    default:
      return assertNever(state);
  }
}