'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from '@/src/components/ui/sonner'
import {
  deletePushToken,
  onMessageListener,
  requestForToken,
  requestNotificationPermission,
} from '@/src/lib/firebase/firebase-messaging'
import { useWebPushStore } from '@/src/stores/web-push-store'

export interface WebPushState {
  token: string | null
  permission: NotificationPermission
  loading: boolean
  isEnabled: boolean
  isHydrated: boolean
  enablePush: () => Promise<string | null>
  disablePush: () => Promise<void>
}

export const useWebPush = (): WebPushState => {
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [loading, setLoading] = useState(false)
  const hasHydratedOnce = useRef(false)
  const { isEnabled: enabledState, hydrate, setEnabled } = useWebPushStore()
  const isHydrated = enabledState !== null
  const isEnabled = enabledState === true

  const issueToken = useCallback(async () => {
    const issuedToken = await requestForToken()
    setToken(issuedToken)
    return issuedToken
  }, [])

  const syncPermission = useCallback(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('denied')
      return 'denied' as NotificationPermission
    }

    const currentPermission = Notification.permission
    setPermission(currentPermission)
    return currentPermission
  }, [])

  const enablePush = useCallback(async () => {
    setLoading(true)
    try {
      const permissionResult = await requestNotificationPermission()
      setPermission(permissionResult)

      if (permissionResult !== 'granted') {
        setEnabled(false)
        setToken(null)
        return null
      }

      const issuedToken = await issueToken()
      if (!issuedToken) {
        setEnabled(false)
        setToken(null)
        return null
      }

      setEnabled(true)
      return issuedToken
    } finally {
      setLoading(false)
    }
  }, [issueToken, setEnabled])

  const disablePush = useCallback(async () => {
    setLoading(true)
    try {
      setEnabled(false)
      await deletePushToken()
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [setEnabled])

  useEffect(() => {
    if (!isHydrated) {
      hydrate()
    }
  }, [hydrate, isHydrated])

  useEffect(() => {
    if (!isHydrated || hasHydratedOnce.current) {
      return
    }

    hasHydratedOnce.current = true
    const currentPermission = syncPermission()

    if (!isEnabled) {
      setToken(null)
      return
    }

    if (currentPermission !== 'granted') {
      setEnabled(false)
      setToken(null)
      return
    }

    void issueToken().then((issuedToken) => {
      if (!issuedToken) {
        setEnabled(false)
      }
    })
  }, [isEnabled, isHydrated, issueToken, setEnabled, syncPermission])

  useEffect(() => {
    if (!isHydrated || !isEnabled || permission !== 'granted') {
      return
    }

    const unsubscribe = onMessageListener((payload) => {
      const title = payload.notification?.title ?? '새 알림'
      const description = payload.notification?.body ?? ''
      toast.info(title, { description })
    })

    return unsubscribe
  }, [isEnabled, isHydrated, permission])

  return {
    token,
    permission,
    loading,
    isEnabled,
    isHydrated,
    enablePush,
    disablePush,
  }
}
