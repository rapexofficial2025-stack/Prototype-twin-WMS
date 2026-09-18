import { Battery, Boxes, Forklift, Gauge, Layers, PackageSearch, User, Wrench } from 'lucide-react'
import type { AssetApi, AssetStatus, AssetType } from '@/features/warehouse/types/module'

const typeLabels: Record<AssetType, string> = {
  forklift: 'Forklift',
  pallet: 'Pallet',
  stacker: 'Stacker',
  motorized_pallet_truck: 'Motorized Pallet Truck',
  battery: 'Battery',
  dock_leveler: 'Dock Leveler',
  weigh_scale: 'Weigh Scale',
  battery_solution: 'Battery Solution',
  other: 'Other Equipment',
}
const typeIcons: Record<AssetType, typeof Forklift> = {
  forklift: Forklift,
  pallet: Layers,
  stacker: Boxes,
  motorized_pallet_truck: Forklift,
  battery: Battery,
  dock_leveler: Gauge,
  weigh_scale: Gauge,
  battery_solution: Battery,
  other: PackageSearch,
}
const statusStyles: Record<AssetStatus, string> = {
  available: 'bg-emerald-500/15 text-emerald-300',
  in_use: 'bg-sky-500/15 text-sky-300',
  maintenance: 'bg-amber-400/15 text-amber-300',
  retired: 'bg-slate-600/30 text-slate-400',
}
const statusLabels: Record<AssetStatus, string> = { available: 'Available', in_use: 'In Use', maintenance: 'Maintenance', retired: 'Retired' }

export function AssetCard({ asset }: { asset: AssetApi }) {
  const Icon = typeIcons[asset.assetType]
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-sky-500/15 text-sky-400"><Icon className="size-4.5" /></div>
          <div>
            <p className="text-sm font-semibold text-slate-50">{asset.assetCode}</p>
            <p className="text-xs text-slate-400">{typeLabels[asset.assetType]}</p>
          </div>
        </div>
        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[asset.status]}`}>{statusLabels[asset.status]}</span>
      </div>
      <div className="mt-4 space-y-1.5 border-t border-slate-700 pt-3 text-xs text-slate-400">
        {(asset.brand || asset.model) && <p>{[asset.brand, asset.model].filter(Boolean).join(' · ')}</p>}
        {asset.serialNumber && <p>S/N {asset.serialNumber}</p>}
        {asset.assignedUser && <p className="flex items-center gap-1.5"><User className="size-3.5" />{asset.assignedUser}</p>}
        {asset.currentLocation && <p className="flex items-center gap-1.5"><Boxes className="size-3.5" />{asset.currentLocation}</p>}
        {asset.maintenanceDate && <p className="flex items-center gap-1.5"><Wrench className="size-3.5" />Next maintenance {asset.maintenanceDate}</p>}
      </div>
    </div>
  )
}
