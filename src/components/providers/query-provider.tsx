'use client'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode } from 'react'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
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
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}