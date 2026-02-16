import { NextRequest } from "next/server";
import { AxiosError } from "axios";
import { bffAxios, errorResponse, passthroughResponse } from "@/src/app/bff/_lib";

interface RouteParams {
  params: Promise<{ lightningId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { lightningId } = await params;
    const { searchParams } = new URL(request.url);

    const direction = searchParams.get("direction");
    const cursorId = searchParams.get("cursorId");
    const size = searchParams.get("size");

    const response = await bffAxios.get(
      `/api/v1/lightnings/${lightningId}/chat-messages`,
      {
        params: {
          ...(direction ? { direction } : {}),
          ...(cursorId ? { cursorId } : {}),
          ...(size ? { size } : {}),
        },
      }
    );

    return passthroughResponse(response.data, response.status);
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return passthroughResponse(error.response.data, error.response.status);
    }
    return errorResponse("요청 중 오류가 발생했습니다.", 500);
  }
}