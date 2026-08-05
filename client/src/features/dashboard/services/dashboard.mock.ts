import type { ColdRoom, LocationState } from '@/features/dashboard/types'

const states: LocationState[] = ['occupied', 'occupied', 'occupied', 'empty', 'reserved', 'empty', 'blocked', 'occupied']
const makeLayout = (seed: number) => Array.from({ length: 4 }, (_, row) => Array.from({ length: 10 }, (_, col) => states[(seed + row * 3 + col) % states.length]))
export const coldRooms: ColdRoom[] = Array.from({ length: 10 }, (_, index) => {
  const number = index + 1; const capacity = 280 + (index % 3) * 20; const occupied = 164 + ((index * 19) % 95)
  return { id: `room-${number}`, name: `Cold Room ${String(number).padStart(2, '0')}`, temperature: -18.2 + (index % 4) * 0.4, occupancy: Math.round((occupied / capacity) * 100), occupiedLocations: occupied, availableLocations: capacity - occupied, shipmentsToday: 12 + index * 2, inboundToday: 6 + (index % 6), outboundToday: 8 + (index % 5), layout: makeLayout(index) }
})
