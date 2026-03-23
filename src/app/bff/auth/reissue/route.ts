import { NextRequest, NextResponse } from "next/server";
import { parseCookie } from "@/src/lib/cookie";
import {
  errorResponse,
  type ApiResponse,
} from "@/src/app/bff/_lib";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ReissueData {
  accessToken: string;
}

function splitSetCookieHeader(setCookieHeader: string): string[] {
  return setCookieHeader.split(/,(?=\s*\w+=)/);
}

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) {
    return errorResponse("API base URL이 설정되지 않았습니다.", 500);
  }

  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return errorResponse("refresh_token이 없습니다.", 401);
  }

  try {
    const reissueResponse = await fetch(`${API_BASE_URL}/api/v1/auth/reissue`, {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!reissueResponse.ok) {
      return errorResponse("토큰 재발급에 실패했습니다.", reissueResponse.status);
    }

    const setCookieHeader = reissueResponse.headers.get("set-cookie");
    if (!setCookieHeader) {
      return errorResponse("재발급 응답 쿠키가 없습니다.", 500);
    }

    const parsedCookies = splitSetCookieHeader(setCookieHeader)
      .map((cookieString) => parseCookie(cookieString.trim()))
      .filter(
        (
          cookie
        ): cookie is NonNullable<ReturnType<typeof parseCookie>> =>
          cookie !== null
      );

    const accessToken =
      parsedCookies.find((cookie) => cookie.name === "access_token")?.value ??
      null;

    if (!accessToken) {
      return errorResponse("access_token 쿠키를 찾을 수 없습니다.", 500);
    }

    const responseStatus =
      reissueResponse.status === 204 ? 200 : reissueResponse.status;

    const response = NextResponse.json<ApiResponse<ReissueData>>(
      {
        httpStatus: `${reissueResponse.status}`,
        data: { accessToken },
        errorMessage: null,
      },
      { status: responseStatus }
    );

    for (const cookie of parsedCookies) {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    }

    return response;
  } catch (error) {
    console.error("[bff/auth/reissue] Request failed", error);
    return errorResponse("토큰 재발급 요청 실패", 500);
  }
}
