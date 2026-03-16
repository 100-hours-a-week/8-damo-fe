/// <reference lib="webworker" />
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'
import { defaultCache } from '@serwist/next/worker'
import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[]
  }
}

declare const self: ServiceWorkerGlobalScope

// ============ Firebase Cloud Messaging ============

const firebaseApp = initializeApp({
  apiKey: '__FIREBASE_API_KEY__',
  authDomain: '__FIREBASE_AUTH_DOMAIN__',
  projectId: '__FIREBASE_PROJECT_ID__',
  storageBucket: '__FIREBASE_STORAGE_BUCKET__',
  messagingSenderId: '__FIREBASE_MESSAGING_SENDER_ID__',
  appId: '__FIREBASE_APP_ID__',
})

const messaging = getMessaging(firebaseApp)

onBackgroundMessage(messaging, (payload) => {
  const notification = payload?.notification ?? {}
  const data = (payload?.data ?? {}) as Record<string, string>

  const title = notification.title || data.title || '새 알림'
  const body = notification.body || data.body || ''
  const icon = '/icons/android-icon-192x192.png'
  const clickAction = data.click_action || data.url || '/'

  void self.registration.showNotification(title, {
    body,
    icon,
    data: { clickAction, ...data },
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const clickAction =
    (event.notification.data as Record<string, string>)?.clickAction || '/'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            void (client as WindowClient).navigate(clickAction)
            return client.focus()
          }
        }
        return self.clients.openWindow(clickAction)
      })
  )
})

// ============ Serwist (Precaching + Runtime Caching) ============

const serwist = new Serwist({
  precacheEntries: [
    ...self.__SW_MANIFEST,
    // 오프라인 fallback 페이지 명시적 precache
    { url: '/offline', revision: null },
  ],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }) {
          return request.destination === 'document'
        },
      },
    ],
  },
})

serwist.addEventListeners()
