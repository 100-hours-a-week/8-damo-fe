import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { parseCookie } from "@/src/lib/cookie";
import { passthroughResponse, errorResponse, type ApiResponse } from "@/src/app/bff/_lib";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RouteParams {
  params: Promise<{ userId: string }>;
}

export async function POST(_: NextRequest, { params }: RouteParams) {
  if (process.env.APP_ENV === "prod") {
    return errorResponse("Not Found", 404);
  }

  if (!API_BASE_URL) {
    return errorResponse("API base URL이 설정되지 않았습니다.", 500);
  }

  try {
    const { userId } = await params;

    const response = await axios.post<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/auth/test/${encodeURIComponent(userId)}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    const res = new NextResponse(null, { status: response.status });
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      const cookieStrings = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      for (const cookieString of cookieStrings) {
        const parsed = parseCookie(cookieString.trim());
        if (parsed) {
          res.cookies.set(parsed.name, parsed.value, parsed.options);
        }
      }
    }

    return res;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return passthroughResponse(error.response.data, error.response.status);
    }
    return errorResponse("요청 중 오류가 발생했습니다.", 500);
  }
}
