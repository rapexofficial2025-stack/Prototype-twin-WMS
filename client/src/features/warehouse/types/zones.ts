export type ZoneKind = 'loading-dock' | 'dry-warehouse' | 'cold-storage' | 'blast-freezer' | 'anteroom'

export type ZoneAreaStatus = 'available' | 'active' | 'reserved' | 'blocked'

export interface ZoneArea {
  id: string
  name: string
  status: ZoneAreaStatus
  temperature: number | null
  occupancy: number
  occupiedLocations: number
  availableLocations: number
  note: string
}

export interface WarehouseZone {
  kind: ZoneKind
  label: string
  description: string
  areas: ZoneArea[]
}
