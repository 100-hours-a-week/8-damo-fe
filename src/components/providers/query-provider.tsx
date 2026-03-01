'use client'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactNode } from 'react'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

declare global {
  var __QUERY_CLIENT__: QueryClient | undefined
}

function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return createQueryClient()
  }

  if (!globalThis.__QUERY_CLIENT__) {
    globalThis.__QUERY_CLIENT__ = createQueryClient()
  }

  return globalThis.__QUERY_CLIENT__
}

interface Props {
  children: ReactNode
}

export function QueryProvider({ children }: Props) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}