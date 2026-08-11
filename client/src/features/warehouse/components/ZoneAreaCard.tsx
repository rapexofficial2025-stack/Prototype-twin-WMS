import { Boxes, ThermometerSnowflake } from 'lucide-react'
import type { ZoneArea, ZoneAreaStatus } from '@/features/warehouse/types/zones'

const statusStyles: Record<ZoneAreaStatus, string> = {
  available: 'bg-emerald-500/15 text-emerald-300',
  active: 'bg-sky-500/15 text-sky-300',
  reserved: 'bg-amber-400/15 text-amber-300',
  blocked: 'bg-red-500/15 text-red-300',
}
const statusLabels: Record<ZoneAreaStatus, string> = { available: 'Available', active: 'In Use', reserved: 'Reserved', blocked: 'Blocked' }

export function ZoneAreaCard({ area }: { area: ZoneArea }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{area.name}</p>
          {area.temperature !== null && (
            <div className="mt-2 flex items-center gap-1.5">
              <ThermometerSnowflake className="size-4 text-sky-400" />
              <span className="text-xl font-semibold text-slate-50">{area.temperature.toFixed(1)}°C</span>
            </div>
          )}
        </div>
        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[area.status]}`}>{statusLabels[area.status]}</span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-sky-500" style={{ width: `${area.occupancy}%` }} /></div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div><div className="flex items-center gap-1 text-xs text-slate-400"><Boxes className="size-3.5" />Occupied</div><p className="mt-1 text-base font-semibold text-slate-100">{area.occupiedLocations}</p></div>
        <div><div className="flex items-center gap-1 text-xs text-slate-400"><Boxes className="size-3.5" />Available</div><p className="mt-1 text-base font-semibold text-slate-100">{area.availableLocations}</p></div>
      </div>
      <p className="mt-4 border-t border-slate-700 pt-3 text-xs text-slate-400">{area.note}</p>
    </div>
  )
}
