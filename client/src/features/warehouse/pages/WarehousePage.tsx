import { useState } from 'react'
import { DoorOpen, Snowflake, Truck, Warehouse as WarehouseIcon, Wind } from 'lucide-react'
import { coldRooms } from '@/features/dashboard/services/dashboard.mock'
import { ColdRoomCard } from '@/features/dashboard/components/ColdRoomCard'
import { warehouseZones } from '@/features/warehouse/services/zones.mock'
import { ZoneAreaCard } from '@/features/warehouse/components/ZoneAreaCard'
import type { ZoneKind } from '@/features/warehouse/types/zones'

const zoneIcons: Record<ZoneKind, typeof Truck> = {
  'loading-dock': Truck,
  'dry-warehouse': WarehouseIcon,
  'cold-storage': Snowflake,
  'blast-freezer': Wind,
  anteroom: DoorOpen,
}

export function WarehousePage() {
  const [active, setActive] = useState<ZoneKind>('loading-dock')
  const zone = warehouseZones.find((z) => z.kind === active)!

  return (
    <section>
      <div>
        <p className="eyebrow">ANTARCTICA WMS</p>
        <h1 className="page-title">Warehouse</h1>
        <p className="mt-2 text-sm text-slate-400">{zone.description}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-700 pb-4">
        {warehouseZones.map((z) => {
          const Icon = zoneIcons[z.kind]
          return (
            <button
              key={z.kind}
              onClick={() => setActive(z.kind)}
              aria-pressed={active === z.kind}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active === z.kind ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
            >
              <Icon className="size-4" />{z.label}
            </button>
          )
        })}
      </div>

      {active === 'cold-storage' ? (
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {coldRooms.map((room) => <ColdRoomCard key={room.id} room={room} />)}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {zone.areas.map((area) => <ZoneAreaCard key={area.id} area={area} />)}
        </div>
      )}
    </section>
  )
}
