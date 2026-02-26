import type { RecommendationStreamStatus } from "@/src/types/api/dining";

export type RecommendationStreamAction =
  | { type: "CONNECT" }
  | { type: "OPEN" }
  | { type: "MESSAGE" }
  | { type: "ERROR" }
  | { type: "CLOSE" };

function assertNever(value: never): never {
  throw new Error(`Unhandled state: ${String(value)}`);
}

export function recommendationStreamReducer(
  state: RecommendationStreamStatus,
  action: RecommendationStreamAction
): RecommendationStreamStatus {
  switch (state) {
    case "idle":
      if (action.type === "CONNECT") return "connecting";
      if (action.type === "CLOSE") return "disconnected";
      return state;

    case "connecting":
      if (action.type === "OPEN") return "connected";
      if (action.type === "ERROR") return "error";
      if (action.type === "CLOSE") return "disconnected";
      return state;

    case "connected":
      if (action.type === "MESSAGE") return "streaming";
      if (action.type === "ERROR") return "error";
      if (action.type === "CLOSE") return "disconnected";
      return state;

    case "streaming":
      if (action.type === "ERROR") return "error";
      if (action.type === "CLOSE") return "disconnected";
      return state;

    case "error":
      if (action.type === "CONNECT") return "connecting";
      if (action.type === "CLOSE") return "disconnected";
      return state;

    case "disconnected":
      if (action.type === "CONNECT") return "connecting";
      return state;

    default:
      return assertNever(state);
  }
}
