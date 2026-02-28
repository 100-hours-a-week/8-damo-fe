import { create } from 'zustand'

const WEB_PUSH_STORAGE_KEY = 'web_push_enabled'

interface WebPushState {
  isEnabled: boolean | null
  hydrate: () => void
  setEnabled: (enabled: boolean) => void
}

const getDefaultEnabledState = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false
  }

  return Notification.permission === 'granted'
}

export const useWebPushStore = create<WebPushState>((set) => ({
  isEnabled: null,

  hydrate: () => {
    if (typeof window === 'undefined') {
      return
    }

    const storedValue = window.localStorage.getItem(WEB_PUSH_STORAGE_KEY)

    const isEnabled =
      storedValue === null
        ? getDefaultEnabledState()
        : storedValue === 'true'

    set({ isEnabled })
  },

  setEnabled: (enabled) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        WEB_PUSH_STORAGE_KEY,
        String(enabled)
      )
    }

    set({ isEnabled: enabled })
  },
}))