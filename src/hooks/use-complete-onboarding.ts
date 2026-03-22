'use client';

import { AxiosError } from 'axios';
import { toast } from '@/src/components/ui/sonner';
import { getMe } from '@/src/lib/api/client/user';
import { useUserStore, type OnboardingStatus } from '@/src/stores/user-store';

/**
 * 온보딩 단계 전이를 위한 훅
 * - Zustand 상태만 갱신하고, 실제 라우팅은 RouteGuard가 처리
 */
export function useCompleteOnboarding() {
  const { updateOnboardingStep, setUser } = useUserStore();

  /**
   * 다음 온보딩 단계로 전이
   * @param nextStep 다음 온보딩 상태
   */
  const advanceToNextStep = async (nextStep: OnboardingStatus): Promise<boolean> => {
    try {
      const result = await getMe();

      if (result.data) {
        setUser(result.data);
        updateOnboardingStep(nextStep);
        return true;
      }

      toast.error("사용자 정보를 불러오지 못했습니다. 다시 시도해주세요.");
      return false;
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.errorMessage ?? "사용자 정보를 불러오지 못했습니다. 다시 시도해주세요.")
          : "사용자 정보를 불러오지 못했습니다. 다시 시도해주세요.";
      toast.error(message);
      return false;
    }
  };

  return { advanceToNextStep };
}
