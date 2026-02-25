import { NextRequest } from "next/server";
import { AxiosError } from "axios";
import { bffAxios, passthroughResponse, errorResponse } from "@/src/app/bff/_lib";

interface RouteParams {
  params: Promise<{ lightningId: string }>;
}

export async function POST(_: NextRequest, { params }: RouteParams) {
  try {
    const { lightningId } = await params;

    const response = await bffAxios.post(`/api/v1/lightning/${lightningId}/users/me`);
    return passthroughResponse(response.data, response.status);
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return passthroughResponse(error.response.data, error.response.status);
    }
    return errorResponse("요청 중 오류가 발생했습니다.", 500);
  }
}
