import type { LocationState } from '@/features/dashboard/types'

export interface LocationTwin {
  id: number
  side: 'left' | 'right'
  column: number
  level: number
  depth: number
  status: LocationState
  locationCode: string
  tagNo: string | null
  itemName: string | null
  customerName: string | null
  quantity: number | null
  batchNo: string | null
  expirationDate: string | null
}

export interface RoomTwin {
  id: number
  room_number: number
  room_name: string
  room_type: string
  target_temp_c: number | null
  columns_left: number
  columns_right: number
  levels: number
  depth: number
  capacity_locations: number
  locations: LocationTwin[]
  occupancy: { total: number; occupied: number; reserved: number; blocked: number; available: number; occupancyPct: number }
}
