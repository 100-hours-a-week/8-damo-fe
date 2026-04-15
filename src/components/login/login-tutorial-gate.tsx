'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import { hasSeenTutorial } from '@/src/lib/tutorial/storage';

function normalizeRedirectPath(path: string | null): string | null {
  if (!path) {
    return null;
  }

  return path.startsWith('/') ? path : null;
}

export function LoginTutorialGate() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasSeenTutorial()) {
      return;
    }

    const redirectPath = normalizeRedirectPath(searchParams.get('redirect'));
    const nextPath = redirectPath
      ? `${ROUTES.TUTORIAL}?redirect=${encodeURIComponent(redirectPath)}`
      : ROUTES.TUTORIAL;

    router.replace(nextPath);
  }, [router, searchParams]);

  return null;
}
