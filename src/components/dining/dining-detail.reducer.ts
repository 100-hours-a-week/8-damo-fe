import type { DiningStatus } from "@/src/types/api/dining";

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
    }
  | {
      type: "completed";
    };

export type DiningAction = {
  type: "SYNC_FROM_SERVER";
  diningStatus: DiningStatus;
};

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`);
}

export function mapDiningStatusToState(diningStatus: DiningStatus): DiningState {
  switch (diningStatus) {
    case "ATTENDANCE_VOTING":
      return { type: "attendance-voting" };
    case "RECOMMENDATION_PENDING":
      return { type: "recommendation-pending" };
    case "RESTAURANT_VOTING":
      return { type: "restaurant-voting" };
    case "CONFIRMED":
      return { type: "confirmed" };
    case "COMPLETE":
      return { type: "completed" };
    default:
      return assertNever(diningStatus);
  }
}

export function diningDetailReducer(
  state: DiningState,
  action: DiningAction
): DiningState {
  const nextState = mapDiningStatusToState(action.diningStatus);
  return nextState.type === state.type ? state : nextState;
}
