import type { User, OnboardingStatus } from '@/src/stores/user-store';

/**
 * Guard 검사를 건너뛰는 예외 경로
 */
const BYPASS_ROUTES = ['/kakao/callback', '/login-test', '/groups/preview', '/tutorial'] as const;

/**
 * 온보딩 상태별 허용 경로 정의
 */
const ALLOWED_ROUTES: Record<OnboardingStatus, readonly string[]> = {
  BASIC: ['/onboarding/basic'],
  CHARACTERISTIC: ['/onboarding/basic', '/onboarding/characteristic'],
  DONE: [], // DONE 상태에서는 온보딩/로그인 경로 제외 모두 허용
};

/**
 * DONE 상태에서 접근 불가한 경로 (온보딩 완료자가 다시 접근하면 안 되는 경로)
 */
const DONE_BLOCKED_ROUTES = [
  '/login',
  '/onboarding/basic',
  '/onboarding/characteristic',
] as const;

/**
 * 온보딩 상태별 기본 리다이렉트 경로
 */
const DEFAULT_REDIRECT: Record<OnboardingStatus | 'null', string> = {
  null: '/login',
  BASIC: '/onboarding/basic',
  CHARACTERISTIC: '/onboarding/characteristic',
  DONE: '/',
};

/**
 * Guard 검사를 건너뛰는 경로인지 확인
 */
export function isGuardBypassRoute(pathname: string): boolean {
  return BYPASS_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * 경로가 특정 패턴과 일치하는지 확인 (하위 경로 포함)
 */
function matchRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

/**
 * 현재 사용자 상태에서 해당 경로에 접근 가능한지 확인
 */
export function canAccessRoute(pathname: string, user: User | null): boolean {
  // 예외 경로는 항상 접근 가능
  if (isGuardBypassRoute(pathname)) {
    return true;
  }

  // 미인증 사용자: /login만 허용
  if (user === null) {
    return matchRoute(pathname, '/login');
  }

  const { onboardingStep } = user;

  // DONE 상태: 온보딩/로그인 경로 제외 모두 허용
  if (onboardingStep === 'DONE') {
    return !DONE_BLOCKED_ROUTES.some((route) => matchRoute(pathname, route));
  }

  // BASIC, CHARACTERISTIC 상태: 허용된 경로만 접근 가능
  const allowedRoutes = ALLOWED_ROUTES[onboardingStep];
  return allowedRoutes.some((route) => matchRoute(pathname, route));
}

/**
 * 현재 경로에서 리다이렉트가 필요한 경우 대상 경로 반환
 * 리다이렉트가 필요 없으면 null 반환
 */
export function getRedirectPath(pathname: string, user: User | null): string | null {
  // 접근 가능하면 리다이렉트 필요 없음
  if (canAccessRoute(pathname, user)) {
    return null;
  }

  // 미인증 사용자
  if (user === null) {
    return DEFAULT_REDIRECT['null'];
  }

  // 온보딩 상태에 따른 리다이렉트
  return DEFAULT_REDIRECT[user.onboardingStep];
}
