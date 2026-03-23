/// <reference lib="webworker" />
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from 'serwist'
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  Serwist,
} from 'serwist'
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

// ============ Custom Runtime Caching ============

const runtimeCaching: RuntimeCaching[] = [
  // Next.js 정적 에셋 (content-hash 포함, 장기 캐싱 안전)
  {
    matcher: /\/_next\/static\/.+/i,
    handler: new CacheFirst({
      cacheName: 'next-static',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  },
  // Next.js 최적화 이미지
  {
    matcher: /\/_next\/image\?url=.+$/i,
    handler: new CacheFirst({
      cacheName: 'next-image',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    }),
  },
  // 정적 이미지 에셋
  {
    matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: new CacheFirst({
      cacheName: 'static-images',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    }),
  },
  // API / BFF — 캐싱하지 않음
  {
    matcher: ({ sameOrigin, url: { pathname } }) =>
      sameOrigin &&
      (pathname.startsWith('/api/') || pathname.startsWith('/bff/')),
    handler: new NetworkOnly(),
  },
  // RSC 네비게이션 (App Router)
  {
    matcher: ({ request, sameOrigin, url: { pathname } }) =>
      request.headers.get('RSC') === '1' &&
      sameOrigin &&
      !pathname.startsWith('/api/'),
    handler: new NetworkFirst({
      cacheName: 'pages-rsc',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60,
        }),
      ],
    }),
  },
  // 페이지 네비게이션 (오프라인 폴백용)
  {
    matcher: ({ request }) => request.destination === 'document',
    handler: new NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60,
        }),
      ],
    }),
  },
]

// ============ Serwist (Precaching + Runtime Caching) ============

const serwist = new Serwist({
  precacheEntries: [
    ...self.__SW_MANIFEST,
    { url: '/offline', revision: null },
  ],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching,
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
