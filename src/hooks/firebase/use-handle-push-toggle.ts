'use client'

import { useCallback } from 'react'
import { useWebPushContext } from '@/src/components/providers/web-push-provider'
import { toast } from '@/src/components/ui/sonner'
import { patchPushNotification } from '@/src/lib/api/client/user'

interface UseHandlePushToggleResult {
  isPushEnabled: boolean
  isPushHydrated: boolean
  isPushLoading: boolean
  handlePushToggle: (checked: boolean) => Promise<void>
}

export function useHandlePushToggle(): UseHandlePushToggleResult {
  const { isEnabled, isHydrated, loading, token, enablePush, disablePush } = useWebPushContext()

  const handlePushToggle = useCallback(
    async (checked: boolean) => {
      if (checked) {
        const issuedToken = await enablePush()
        if (issuedToken) {
          await patchPushNotification({ fcmToken: issuedToken, isPushNotificationAllowed: true })
          toast.success('푸시 알림이 활성화되었습니다.')
          return
        }

        if (
          typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'denied'
        ) {
          toast.error('브라우저에서 알림 권한이 차단되어 있습니다.')
        } else {
          toast.error('푸시 알림을 활성화하지 못했습니다.')
        }
        return
      }

      await patchPushNotification({ fcmToken: token ?? '', isPushNotificationAllowed: false })
      await disablePush()
      toast.success('푸시 알림이 비활성화되었습니다.')
    },
    [disablePush, enablePush, token]
  )

  return {
    isPushEnabled: isEnabled,
    isPushHydrated: isHydrated,
    isPushLoading: loading,
    handlePushToggle,
  }
}
