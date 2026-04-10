'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/src/stores/user-store';
import { hasSeenTutorial } from '@/src/lib/tutorial/storage';

export function HomeTutorialGate() {
  const router = useRouter();
  const { user, isInitialized } = useUserStore();

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (user?.onboardingStep !== 'DONE') {
      return;
    }

    if (hasSeenTutorial()) {
      return;
    }

    router.replace('/tutorial');
  }, [isInitialized, router, user?.onboardingStep]);

  return null;
}
