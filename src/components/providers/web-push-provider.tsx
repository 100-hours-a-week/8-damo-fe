'use client'

import { createContext, type ReactNode, useContext, useEffect } from 'react'
import { type WebPushState, useWebPush } from '@/src/hooks/firebase/use-web-push'
import { registerServiceWorker } from '@/src/lib/firebase/firebase-messaging'

interface WebPushProviderProps {
  children: ReactNode
}

const WebPushContext = createContext<WebPushState | null>(null)

export function WebPushProvider({ children }: WebPushProviderProps) {
  const webPush = useWebPush()

  useEffect(() => {
    registerServiceWorker()
  }, [])

  return <WebPushContext.Provider value={webPush}>{children}</WebPushContext.Provider>
}

export function useWebPushContext() {
  const context = useContext(WebPushContext)
  if (!context) {
    throw new Error('useWebPushContext must be used within WebPushProvider')
  }

  return context
}
