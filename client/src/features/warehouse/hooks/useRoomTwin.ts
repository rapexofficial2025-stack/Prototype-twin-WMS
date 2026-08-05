import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { onValue, ref } from 'firebase/database'
import { isFirebaseConfigured, realtimeDb } from '@/lib/firebase'
import { fetchRoomTwin, isBackendConfigured } from '@/features/warehouse/services/twin.api'
import type { LocationTwin, RoomTwin } from '@/features/warehouse/types/twin'

/**
 * Loads the live location grid for a room from Django, then subscribes to
 * Firebase Realtime Database for per-location status pushes (see
 * apps/warehouse/signals.py) so receiving/withdrawal/transfer/adjustment
 * postings reflect in the 3D twin without polling.
 */
export function useRoomTwin(roomNumber: number) {
  const queryClient = useQueryClient()
  const queryKey = ['room-twin', roomNumber]

  const query = useQuery({
    queryKey,
    queryFn: () => fetchRoomTwin(roomNumber),
    enabled: isBackendConfigured,
    staleTime: 30_000,
  })

  useEffect(() => {
    if (!isBackendConfigured || !isFirebaseConfigured || !realtimeDb || !query.data) return
    const roomRef = ref(realtimeDb, `warehouse/rooms/${query.data.id}/locations`)
    return onValue(roomRef, (snapshot) => {
      const updates = snapshot.val() as Record<string, Partial<LocationTwin>> | null
      if (!updates) return
      queryClient.setQueryData<RoomTwin>(queryKey, (current) => {
        if (!current) return current
        const locations = current.locations.map((location) => {
          const update = updates[String(location.id)]
          return update ? { ...location, ...update } : location
        })
        return { ...current, locations }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id])

  return { ...query, isLive: isBackendConfigured }
}

export function buildLocationLookup(room: RoomTwin | undefined) {
  const map = new Map<string, LocationTwin>()
  room?.locations.forEach((location) => map.set(`${location.side}-${location.column}-${location.level}-${location.depth}`, location))
  return map
}
