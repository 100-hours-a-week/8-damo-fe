import { NextRequest } from "next/server";
import { AxiosError } from "axios";
import { bffAxios, passthroughResponse, errorResponse } from "@/src/app/bff/_lib";

interface RouteParams {
  params: Promise<{
    groupId: string;
    diningId: string;
  }>;
}

// GET - 추천 스트리밍 이력 조회
export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const { groupId, diningId } = await params;
    const response = await bffAxios.get(
      `/api/v1/groups/${groupId}/dining/${diningId}/recommendation-streaming/history`
    );
    return passthroughResponse(response.data, response.status);
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return passthroughResponse(error.response.data, error.response.status);
    }
    return errorResponse("요청 중 오류가 발생했습니다.", 500);
  }
}
