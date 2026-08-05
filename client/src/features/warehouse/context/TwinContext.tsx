import { createContext, useContext, useMemo, type PropsWithChildren } from 'react'
import { buildLocationLookup, useRoomTwin } from '@/features/warehouse/hooks/useRoomTwin'
import type { LocationTwin } from '@/features/warehouse/types/twin'

interface TwinContextValue {
  isLive: boolean
  isLoading: boolean
  getLocation: (side: 'left' | 'right', column: number, level: number, depth: number) => LocationTwin | undefined
}

const TwinContext = createContext<TwinContextValue>({ isLive: false, isLoading: false, getLocation: () => undefined })

export function TwinProvider({ roomNumber, children }: PropsWithChildren<{ roomNumber: number }>) {
  const { data, isLoading, isLive } = useRoomTwin(roomNumber)
  const lookup = useMemo(() => buildLocationLookup(data), [data])

  const value = useMemo<TwinContextValue>(() => ({
    isLive,
    isLoading,
    getLocation: (side, column, level, depth) => lookup.get(`${side}-${column}-${level}-${depth}`),
  }), [isLive, isLoading, lookup])

  return <TwinContext.Provider value={value}>{children}</TwinContext.Provider>
}

export function useTwinLookup() {
  return useContext(TwinContext)
}
