'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/src/stores/user-store';
import { getRedirectPath, isGuardBypassRoute } from '@/src/lib/route-guard/route-access';

const RETURN_URL_KEY = 'returnUrl';

interface RouteGuardProps {
  children: ReactNode;
}

function getAndClearReturnUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const returnUrl = sessionStorage.getItem(RETURN_URL_KEY);
  sessionStorage.removeItem(RETURN_URL_KEY);

  if (!returnUrl) return null;

  if (!returnUrl.startsWith('/')) return null;

  return returnUrl;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized } = useUserStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (isGuardBypassRoute(pathname)) return;

    if (user?.onboardingStep === 'DONE') {
      const returnUrl = getAndClearReturnUrl();
      if (returnUrl && pathname !== returnUrl) {
        router.replace(returnUrl);
        return;
      }
    }

    const redirectPath = getRedirectPath(pathname, user);
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [pathname, user, isInitialized, router]);

  if (!isInitialized) {
    return <RouteGuardSkeleton />;
  }

  if (isGuardBypassRoute(pathname)) {
    return <>{children}</>;
  }

  const redirectPath = getRedirectPath(pathname, user);
  if (redirectPath) {
    return <RouteGuardSkeleton />;
  }

  return <>{children}</>;
}

function RouteGuardSkeleton() {
  return (
    <div className="flex h-[100dvh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
