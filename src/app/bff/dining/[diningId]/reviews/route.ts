import { NextRequest } from "next/server";
import { AxiosError } from "axios";
import { bffAxios, passthroughResponse, errorResponse } from "@/src/app/bff/_lib";

interface RouteParams {
  params: Promise<{
    diningId: string;
  }>;
}

// POST - 리뷰 작성
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { diningId } = await params;
    const body = await request.json();

    const response = await bffAxios.post(`/api/v1/dining/${diningId}/reviews`, body);
    return passthroughResponse(response.data, response.status);
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return passthroughResponse(error.response.data, error.response.status);
    }
    return errorResponse("요청 중 오류가 발생했습니다.", 500);
  }
}
