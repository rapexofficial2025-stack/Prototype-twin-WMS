export type AreaType = 'cold_storage' | 'blast_freezer' | 'anteroom' | 'chiller_room' | 'dry_warehouse'
export type AreaStatus = 'operational' | 'warning' | 'maintenance' | 'offline'

export interface WarehouseAreaApi {
  id: number
  areaCode: string
  areaName: string
  areaType: AreaType
  floor: string
  capacity: number
  occupied: number
  available: number
  utilizationPct: number
  targetTempC: number | null
  status: AreaStatus
  roomNumber: number | null
}

export type DockStatus = 'available' | 'active' | 'reserved' | 'offline'
export type DockActivity = 'idle' | 'loading' | 'unloading'

export interface DockApi {
  id: number
  dockCode: string
  status: DockStatus
  activity: DockActivity
  reference: string
  activityStartedAt: string | null
}

export type AssetType = 'forklift' | 'pallet' | 'stacker' | 'motorized_pallet_truck' | 'battery' | 'dock_leveler' | 'weigh_scale' | 'battery_solution' | 'other'
export type AssetStatus = 'available' | 'in_use' | 'maintenance' | 'retired'

export interface AssetApi {
  id: number
  assetCode: string
  assetType: AssetType
  brand: string
  model: string
  serialNumber: string
  status: AssetStatus
  assignedUser: string | null
  currentLocation: string | null
  maintenanceDate: string | null
  notes: string
}

export interface EquipmentCategory {
  key: string
  label: string
}

export interface MachineRoomApi {
  equipmentCategories: EquipmentCategory[]
  telemetry: null
  message: string
}

export interface SectionSummary {
  count: number
  capacity: number
  occupied: number
  utilizationPct: number
}

export interface WarehouseSummaryApi {
  coldStorage: SectionSummary
  dryWarehouse: SectionSummary
  chillerRoom: SectionSummary
  loadingArea: { docks: number; available: number; active: number; waiting: number }
  assets: number
}
