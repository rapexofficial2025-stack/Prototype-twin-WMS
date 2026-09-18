import type { WarehouseAreaApi } from '@/features/warehouse/types/module'
import type { ZoneArea, ZoneAreaStatus } from '@/features/warehouse/types/zones'

const statusMap: Record<WarehouseAreaApi['status'], ZoneAreaStatus> = {
  operational: 'available',
  warning: 'reserved',
  maintenance: 'reserved',
  offline: 'blocked',
}

/** Adapts a live WarehouseArea API row to the ZoneArea shape ZoneAreaCard renders. */
export function apiAreaToZoneArea(area: WarehouseAreaApi): ZoneArea {
  return {
    id: area.areaCode,
    name: area.areaCode,
    status: statusMap[area.status],
    temperature: area.targetTempC,
    occupancy: area.utilizationPct,
    occupiedLocations: area.occupied,
    availableLocations: area.available,
    note: area.floor ? `Floor ${area.floor}` : area.areaName,
  }
}
