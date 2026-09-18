import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Cog, Forklift, Snowflake, Thermometer, Truck, Warehouse as WarehouseIcon } from 'lucide-react'
import { coldRooms } from '@/features/dashboard/services/dashboard.mock'
import { ColdRoomCard } from '@/features/dashboard/components/ColdRoomCard'
import { warehouseZones } from '@/features/warehouse/services/zones.mock'
import { mockAssets } from '@/features/warehouse/services/assets.mock'
import { fetchAssets, fetchMachineRoom, fetchWarehouseAreas, fetchWarehouseSummary, isBackendConfigured } from '@/features/warehouse/services/module.api'
import { ZoneAreaCard } from '@/features/warehouse/components/ZoneAreaCard'
import { AssetCard } from '@/features/warehouse/components/AssetCard'
import { MachineRoomPanel } from '@/features/warehouse/components/MachineRoomPanel'
import { SectionCard, type SectionStat } from '@/features/warehouse/components/SectionCard'
import { apiAreaToZoneArea } from '@/features/warehouse/utils/mapArea'
import { canAccessMachineRoom } from '@/lib/currentUser'
import type { ZoneArea, ZoneKind } from '@/features/warehouse/types/zones'

type SectionKind = 'cold-storage' | 'dry-warehouse' | 'chiller-room' | 'machine-room' | 'assets' | 'loading-area'

const zoneAreasOf = (kind: ZoneKind) => warehouseZones.find((z) => z.kind === kind)!.areas

const capacityOf = (areas: ZoneArea[]) => areas.reduce((sum, a) => sum + a.occupiedLocations + a.availableLocations, 0)
const occupiedOf = (areas: ZoneArea[]) => areas.reduce((sum, a) => sum + a.occupiedLocations, 0)
const pct = (occupied: number, capacity: number) => (capacity ? Math.round((occupied / capacity) * 100) : 0)

const sections: { kind: SectionKind; label: string; icon: typeof Snowflake; description: string }[] = [
  { kind: 'cold-storage', label: 'Cold Storage', icon: Snowflake, description: 'Chilled rooms, blast freezers, and anterooms. Select a Cold Room to open its digital twin.' },
  { kind: 'dry-warehouse', label: 'Dry Warehouse', icon: WarehouseIcon, description: 'Ambient storage for non-perishable and packaging inventory.' },
  { kind: 'chiller-room', label: 'Chiller Room', icon: Thermometer, description: 'Chilled (above-freezing) storage for temperature-sensitive inventory.' },
  { kind: 'machine-room', label: 'Machine Room', icon: Cog, description: 'Refrigeration, electrical, and generator equipment — management and authorized maintenance only.' },
  { kind: 'assets', label: 'Assets', icon: Forklift, description: 'Forklifts, stackers, pallets, and other warehouse equipment.' },
  { kind: 'loading-area', label: 'Loading Area', icon: Truck, description: 'Inbound and outbound truck bays for receiving and dispatch.' },
]

export function WarehousePage() {
  const [active, setActive] = useState<SectionKind>('cold-storage')
  const section = sections.find((s) => s.kind === active)!

  const summaryQuery = useQuery({ queryKey: ['warehouse-summary'], queryFn: fetchWarehouseSummary, enabled: isBackendConfigured, staleTime: 30_000 })

  const coldAreasQuery = useQuery({ queryKey: ['warehouse-areas', 'cold_storage'], queryFn: () => fetchWarehouseAreas('cold_storage'), enabled: isBackendConfigured && active === 'cold-storage', staleTime: 30_000 })
  const blastAreasQuery = useQuery({ queryKey: ['warehouse-areas', 'blast_freezer'], queryFn: () => fetchWarehouseAreas('blast_freezer'), enabled: isBackendConfigured && active === 'cold-storage', staleTime: 30_000 })
  const anteAreasQuery = useQuery({ queryKey: ['warehouse-areas', 'anteroom'], queryFn: () => fetchWarehouseAreas('anteroom'), enabled: isBackendConfigured && active === 'cold-storage', staleTime: 30_000 })
  const dryAreasQuery = useQuery({ queryKey: ['warehouse-areas', 'dry_warehouse'], queryFn: () => fetchWarehouseAreas('dry_warehouse'), enabled: isBackendConfigured && active === 'dry-warehouse', staleTime: 30_000 })
  const chillerAreasQuery = useQuery({ queryKey: ['warehouse-areas', 'chiller_room'], queryFn: () => fetchWarehouseAreas('chiller_room'), enabled: isBackendConfigured && active === 'chiller-room', staleTime: 30_000 })
  const assetsQuery = useQuery({ queryKey: ['warehouse-assets'], queryFn: () => fetchAssets(), enabled: isBackendConfigured && active === 'assets', staleTime: 30_000 })
  const machineRoomQuery = useQuery({ queryKey: ['warehouse-machine-room'], queryFn: fetchMachineRoom, enabled: isBackendConfigured && active === 'machine-room' && canAccessMachineRoom(), staleTime: 30_000 })

  // Live API rows win when a backend is configured; otherwise fall back to
  // the mock zone data the Warehouse tab already shipped with.
  const dryAreas = dryAreasQuery.data?.map(apiAreaToZoneArea) ?? zoneAreasOf('dry-warehouse')
  const chillerAreas = chillerAreasQuery.data?.map(apiAreaToZoneArea) ?? zoneAreasOf('chiller-room')
  const blastAreas = blastAreasQuery.data?.map(apiAreaToZoneArea) ?? zoneAreasOf('blast-freezer')
  const anteAreas = anteAreasQuery.data?.map(apiAreaToZoneArea) ?? zoneAreasOf('anteroom')
  const loadingAreas = zoneAreasOf('loading-dock')
  const coldAreas = coldAreasQuery.data?.map(apiAreaToZoneArea)

  const coldStorageStat: SectionStat[] = summaryQuery.data
    ? [{ label: 'Rooms', value: String(summaryQuery.data.coldStorage.count) }, { label: 'Capacity', value: String(summaryQuery.data.coldStorage.capacity) }, { label: 'Utilization', value: `${summaryQuery.data.coldStorage.utilizationPct}%` }]
    : [{ label: 'Rooms', value: String(coldRooms.length + blastAreas.length + anteAreas.length) }, { label: 'Capacity', value: String(coldRooms.reduce((s, r) => s + r.occupiedLocations + r.availableLocations, 0) + capacityOf(blastAreas) + capacityOf(anteAreas)) }, { label: 'Utilization', value: `${Math.round(coldRooms.reduce((s, r) => s + r.occupancy, 0) / coldRooms.length)}%` }]

  const dryStat: SectionStat[] = summaryQuery.data
    ? [{ label: 'Areas', value: String(summaryQuery.data.dryWarehouse.count) }, { label: 'Capacity', value: String(summaryQuery.data.dryWarehouse.capacity) }, { label: 'Utilization', value: `${summaryQuery.data.dryWarehouse.utilizationPct}%` }]
    : [{ label: 'Areas', value: String(dryAreas.length) }, { label: 'Capacity', value: String(capacityOf(dryAreas)) }, { label: 'Utilization', value: `${pct(occupiedOf(dryAreas), capacityOf(dryAreas))}%` }]

  const chillerStat: SectionStat[] = summaryQuery.data
    ? [{ label: 'Rooms', value: String(summaryQuery.data.chillerRoom.count) }, { label: 'Capacity', value: String(summaryQuery.data.chillerRoom.capacity) }, { label: 'Utilization', value: `${summaryQuery.data.chillerRoom.utilizationPct}%` }]
    : [{ label: 'Rooms', value: String(chillerAreas.length) }, { label: 'Capacity', value: String(capacityOf(chillerAreas)) }, { label: 'Utilization', value: `${pct(occupiedOf(chillerAreas), capacityOf(chillerAreas))}%` }]

  const loadingStat: SectionStat[] = summaryQuery.data
    ? [{ label: 'Docks', value: String(summaryQuery.data.loadingArea.docks) }, { label: 'Available', value: String(summaryQuery.data.loadingArea.available) }, { label: 'Active', value: String(summaryQuery.data.loadingArea.active) }]
    : [{ label: 'Docks', value: String(loadingAreas.length) }, { label: 'Available', value: String(loadingAreas.filter((a) => a.status === 'available').length) }, { label: 'Active', value: String(loadingAreas.filter((a) => a.status === 'active').length) }]

  const assetsStat: SectionStat[] = summaryQuery.data
    ? [{ label: 'Assets', value: String(summaryQuery.data.assets) }]
    : [{ label: 'Assets', value: String(mockAssets.length) }, { label: 'In Use', value: String(mockAssets.filter((a) => a.status === 'in_use').length) }, { label: 'Available', value: String(mockAssets.filter((a) => a.status === 'available').length) }]

  const machineStat: SectionStat[] = [{ label: 'Access', value: canAccessMachineRoom() ? 'Granted' : 'Restricted' }, { label: 'Categories', value: '7' }]

  const statsByKind: Record<SectionKind, SectionStat[]> = {
    'cold-storage': coldStorageStat,
    'dry-warehouse': dryStat,
    'chiller-room': chillerStat,
    'machine-room': machineStat,
    assets: assetsStat,
    'loading-area': loadingStat,
  }

  return (
    <section>
      <div>
        <p className="eyebrow">FROST WMS</p>
        <h1 className="page-title">Warehouse</h1>
        <p className="mt-2 text-sm text-slate-400">{section.description}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => (
          <SectionCard key={s.kind} icon={s.icon} label={s.label} active={active === s.kind} restricted={s.kind === 'machine-room'} stats={statsByKind[s.kind]} onClick={() => setActive(s.kind)} />
        ))}
      </div>

      {active === 'cold-storage' && (
        <div className="mt-8 space-y-8">
          {coldAreas ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {coldAreas.map((area) => <ZoneAreaCard key={area.id} area={area} />)}
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {coldRooms.map((room) => <ColdRoomCard key={room.id} room={room} />)}
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Blast Freezer</h2>
            <div className="mt-3 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {blastAreas.map((area) => <ZoneAreaCard key={area.id} area={area} />)}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Anteroom</h2>
            <div className="mt-3 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {anteAreas.map((area) => <ZoneAreaCard key={area.id} area={area} />)}
            </div>
          </div>
        </div>
      )}

      {active === 'dry-warehouse' && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dryAreas.map((area) => <ZoneAreaCard key={area.id} area={area} />)}
        </div>
      )}

      {active === 'chiller-room' && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {chillerAreas.map((area) => <ZoneAreaCard key={area.id} area={area} />)}
        </div>
      )}

      {active === 'loading-area' && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {loadingAreas.map((area) => <ZoneAreaCard key={area.id} area={area} />)}
        </div>
      )}

      {active === 'assets' && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {(assetsQuery.data ?? mockAssets).map((asset) => <AssetCard key={asset.assetCode} asset={asset} />)}
        </div>
      )}

      {active === 'machine-room' && <MachineRoomPanel categories={machineRoomQuery.data?.equipmentCategories} />}
    </section>
  )
}
