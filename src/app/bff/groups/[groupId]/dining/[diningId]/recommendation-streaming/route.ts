import { NextRequest } from "next/server";
import { getAccessToken } from "@/src/lib/cookie";
import { errorResponse } from "@/src/app/bff/_lib";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SSE_CONTENT_TYPE = "text/event-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    groupId: string;
    diningId: string;
  }>;
}

function createSseHeaders(upstreamHeaders: Headers): Headers {
  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstreamHeaders.get("content-type") ?? `${SSE_CONTENT_TYPE}; charset=utf-8`
  );
  headers.set(
    "Cache-Control",
    upstreamHeaders.get("cache-control") ?? "no-cache, no-transform"
  );
  headers.set("Connection", "keep-alive");
  headers.set("X-Accel-Buffering", "no");
  return headers;
}

// GET - 추천 진행 상태 SSE 스트림
export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!API_BASE_URL) {
    return errorResponse("API base URL이 설정되지 않았습니다.", 500);
  }

  try {
    const { groupId, diningId } = await params;
    const accessToken = await getAccessToken();
    const lastEventId = request.headers.get("last-event-id");

    const headers = new Headers();
    headers.set("Accept", SSE_CONTENT_TYPE);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    if (lastEventId) {
      headers.set("Last-Event-ID", lastEventId);
    }

    const upstream = await fetch(
      `${API_BASE_URL}/api/v1/groups/${groupId}/dining/${diningId}/recommendation-streaming`,
      {
        method: "GET",
        headers,
        cache: "no-store",
        signal: request.signal,
      }
    );

    if (!upstream.ok) {
      const contentType =
        upstream.headers.get("content-type") ?? "application/json; charset=utf-8";
      const bodyText = await upstream.text();

      if (!bodyText) {
        return errorResponse("요청 중 오류가 발생했습니다.", upstream.status);
      }

      return new Response(bodyText, {
        status: upstream.status,
        headers: {
          "Content-Type": contentType,
        },
      });
    }

    if (!upstream.body) {
      return errorResponse("추천 스트림 본문이 비어 있습니다.", 502);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: createSseHeaders(upstream.headers),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return new Response(null, { status: 204 });
    }

    console.error("[bff/groups/dining/recommendation-streaming] Request failed", error);
    return errorResponse("추천 스트림 연결에 실패했습니다.", 500);
  }
}

