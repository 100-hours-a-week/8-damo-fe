import { NextRequest, NextResponse } from 'next/server';
import { parseCookie } from './lib/parse-cookie';
import { ROUTES } from '@/src/constants/routes';

const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.LOGIN_TEST,
  ROUTES.KAKAO_CALLBACK,
  ROUTES.GROUP_PREVIEW,
] as const;

const PUBLIC_BFF_PREFIXES = [
  "/bff/auth/oauth",
  "/bff/auth/reissue",
  "/bff/auth/logout",
  "/bff/auth/ws-token",
  "/bff/auth/test",
] as const;

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isPublicBffRoute(pathname: string): boolean {
  return PUBLIC_BFF_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicRoute(pathname) || isPublicBffRoute(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    const loginUrl = new URL(ROUTES.LOGIN, request.nextUrl.origin);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('access_token');
    return response;
  }

  if (!accessToken && refreshToken) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const reissueResponse = await fetch(`${API_BASE_URL}/api/v1/auth/reissue`, {
        method: "POST",
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      });

      if (reissueResponse.ok) {
        const setCookieHeader = reissueResponse.headers.get("set-cookie");

        if (setCookieHeader) {
          const parsedCookies = setCookieHeader
            .split(/,(?=\s*\w+=)/)
            .map((s) => parseCookie(s.trim()))
            .filter((c): c is NonNullable<typeof c> => c !== null);

          const response = NextResponse.next();

          for (const cookie of parsedCookies) {
            response.cookies.set(cookie.name, cookie.value, cookie.options);
          }

          return response;
        }

        return NextResponse.next();
      } else {
        const loginUrl = new URL(ROUTES.LOGIN, request.nextUrl.origin);
        loginUrl.searchParams.set("redirect", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("[proxy] Token reissue failed:", error);
      const loginUrl = new URL(ROUTES.LOGIN, request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico|bff|firebase-messaging-sw.js).*)'],
};
