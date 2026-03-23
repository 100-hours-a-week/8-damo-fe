'use client';

import { useEffect, ReactNode } from 'react';
import { useUserStore } from '@/src/stores/user-store';
import { getMe } from '@/src/lib/api/client/user';
import { reissueAuthToken } from '@/src/lib/api/client/auth';

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { setUser, setLoading, setInitialized, isInitialized } = useUserStore();

  useEffect(() => {
    if (isInitialized) return;

    const initializeUser = async () => {
      setLoading(true);

      try {
        const result = await getMe();
        setUser(result.data ?? null);
      } catch {
        try {
          await reissueAuthToken();
          const retryResult = await getMe();
          setUser(retryResult.data ?? null);
        } catch {
          setUser(null);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeUser();
  }, [isInitialized, setUser, setLoading, setInitialized]);

  return <>{children}</>;
}
