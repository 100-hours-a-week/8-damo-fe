import { NextRequest } from "next/server";
import { AxiosError } from "axios";
import { bffAxios, passthroughResponse, errorResponse, type ApiResponse } from "@/src/app/bff/_lib";
import type { ApiNestedResponse } from "@/src/types/api/common";

interface RouteParams {
  params: Promise<{ lightningId: string }>;
}

interface LightningParticipantRaw {
  userId: number;
  nickname: string;
  role: string;
}

interface LightningDetailRaw {
  lightningId: number;
  restaurantName: string;
  longitude: string;
  latitude: string;
  description: string;
  lightningDate: string;
  maxParticipants: number;
  participantsCount: number;
  lightningStatus: string;
  participants: LightningParticipantRaw[];
}

function normalizeLightningDetail(
  payload: ApiNestedResponse<LightningDetailRaw>
): ApiResponse<LightningDetailRaw | null> {
  return {
    httpStatus: payload.httpStatus,
    data: payload.data?.data ?? null,
    errorMessage: payload.data?.errorMessage ?? payload.errorMessage,
  };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const { lightningId } = await params;

    const response = await bffAxios.get<ApiNestedResponse<LightningDetailRaw>>(
      `/api/v1/lightning/${lightningId}`
    );

    const normalized = normalizeLightningDetail(response.data);
    const detail = normalized.data;

    if (!detail) {
      return errorResponse(
        normalized.errorMessage ?? "번개 상세 정보를 찾을 수 없습니다.",
        404
      );
    }

    return passthroughResponse(
      {
        httpStatus: normalized.httpStatus,
        data: detail,
        errorMessage: normalized.errorMessage,
      },
      response.status
    );
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return passthroughResponse(error.response.data, error.response.status);
    }
    return errorResponse("요청 중 오류가 발생했습니다.", 500);
  }
}