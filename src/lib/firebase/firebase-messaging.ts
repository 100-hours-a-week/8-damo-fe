'use client'

import {
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
  type MessagePayload,
  type Messaging,
} from 'firebase/messaging'
import { firebaseApp } from './firebase'

let messaging: Messaging | null = null
let swRegistrationPromise: Promise<ServiceWorkerRegistration | null> | null = null

// Firebase Messaging 초기화
export const initMessaging = (): Messaging | null => {
  if (typeof window === 'undefined') {
    return null
  }

  if (messaging) {
    return messaging
  }

  try {
    messaging = getMessaging(firebaseApp)
    return messaging
  } catch (error) {
    console.error('Firebase Messaging 초기화 실패:', error)
    return null
  }
}

// Service Worker 등록 (페이지 로드 완료 후)
const waitForWindowLoad = async () => {
  if (typeof window === 'undefined') return
  if (document.readyState === 'complete') return
  
  await new Promise<void>((resolve) => {
    window.addEventListener('load', () => resolve(), { once: true })
  })
}

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null
  }

  if (!swRegistrationPromise) {
    swRegistrationPromise = (async () => {
      await waitForWindowLoad()
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        return registration
      } catch (error) {
        console.error('Service Worker 등록 실패:', error)
        const existing = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
        return existing ?? null
      }
    })()
  }

  return swRegistrationPromise
}

// 알림 권한 요청
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    return 'denied'
  }

  // 사용자 제스처(버튼 클릭 등) 안에서 호출되어야 함
  const permission = await Notification.requestPermission()
  return permission
}

// FCM 토큰 발급
export const requestForToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? ''
  if (!vapidKey) {
    console.error('VAPID 키가 설정되지 않았습니다.')
    return null
  }

  // 알림 권한 확인
  const permission = await requestNotificationPermission()
  if (permission !== 'granted') {
    console.error('알림 권한이 허용되지 않았습니다.')
    return null
  }

  const messagingInstance = initMessaging()
  if (!messagingInstance) {
    return null
  }

  const registration = await registerServiceWorker()
  if (!registration) {
    console.error('Service Worker를 등록할 수 없습니다.')
    return null
  }

  try {
    const token = await getToken(messagingInstance, {
      vapidKey,
      serviceWorkerRegistration: registration,
    })

    if (token) {
      console.log('FCM 토큰 발급 성공:', token)
      return token
    }

    return null
  } catch (error) {
    console.error('FCM 토큰 발급 실패:', error)
    return null
  }
}


// 포그라운드 메시지 수신 리스너
export const onMessageListener = (
  onMessageReceived?: (payload: MessagePayload) => void
): (() => void) => {
  const messagingInstance = initMessaging()
  if (!messagingInstance) {
    return () => undefined
  }

  return onMessage(messagingInstance, (payload) => {
    console.log('포그라운드 메시지 수신:', payload)
    onMessageReceived?.(payload)
  })
}
