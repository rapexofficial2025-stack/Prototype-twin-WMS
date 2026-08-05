import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrandingProvider } from '@/lib/branding'

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } })

export function AppProviders({ children }: PropsWithChildren) {
  return <QueryClientProvider client={queryClient}><BrandingProvider>{children}</BrandingProvider></QueryClientProvider>
}
