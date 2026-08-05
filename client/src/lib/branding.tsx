import { createContext, useCallback, useContext, useState, type PropsWithChildren } from 'react'

export const DEFAULT_BRANDING = {
  logo: '/branding/logo.png',
  title: 'ANTARCTICA Cold Storage',
  subtitle: 'WMS BETA v1.0 Prototype Inventory System — Powered by RAPEX Technology',
}

type Branding = typeof DEFAULT_BRANDING
const STORAGE_KEY = 'frost-wms:branding'

function loadBranding(): Branding {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_BRANDING, ...JSON.parse(raw) } : DEFAULT_BRANDING
  } catch {
    return DEFAULT_BRANDING
  }
}

interface BrandingContextValue extends Branding {
  setBranding: (next: Partial<Branding>) => void
  resetBranding: () => void
}

const BrandingContext = createContext<BrandingContextValue | null>(null)

export function BrandingProvider({ children }: PropsWithChildren) {
  const [branding, setBrandingState] = useState<Branding>(loadBranding)

  const setBranding = useCallback((next: Partial<Branding>) => {
    setBrandingState((current) => {
      const merged = { ...current, ...next }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      return merged
    })
  }, [])

  const resetBranding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setBrandingState(DEFAULT_BRANDING)
  }, [])

  return <BrandingContext.Provider value={{ ...branding, setBranding, resetBranding }}>{children}</BrandingContext.Provider>
}

export function useBranding() {
  const ctx = useContext(BrandingContext)
  if (!ctx) throw new Error('useBranding must be used within BrandingProvider')
  return ctx
}
