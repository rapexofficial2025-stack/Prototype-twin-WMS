import { Cog, Lock, Snowflake, Wind, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { canAccessMachineRoom, currentUser } from '@/lib/currentUser'
import type { EquipmentCategory } from '@/features/warehouse/types/module'

const FALLBACK_CATEGORIES: EquipmentCategory[] = [
  { key: 'refrigeration', label: 'Refrigeration Equipment' },
  { key: 'compressor', label: 'Compressor' },
  { key: 'evaporator', label: 'Evaporator' },
  { key: 'condenser', label: 'Condenser' },
  { key: 'generator', label: 'Generator' },
  { key: 'electrical', label: 'Electrical Systems' },
  { key: 'temperature_control', label: 'Temperature Control Systems' },
]

const categoryIcons: Record<string, typeof Cog> = {
  refrigeration: Snowflake,
  compressor: Wind,
  evaporator: Snowflake,
  condenser: Wind,
  generator: Zap,
  electrical: Zap,
  temperature_control: Cog,
}

export function MachineRoomPanel({ categories }: { categories?: EquipmentCategory[] }) {
  if (!canAccessMachineRoom()) {
    return (
      <Card className="mt-6 flex min-h-72 flex-col items-center justify-center p-8 text-center">
        <Lock className="mb-4 size-10 text-slate-500" />
        <h2 className="text-lg font-semibold text-slate-50">Access Restricted</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          The Machine Room is limited to Super Admin, Warehouse Manager, Supervisor, and Authorized Maintenance roles. {currentUser.name}'s current role does not have access.
        </p>
      </Card>
    )
  }

  const list = categories ?? FALLBACK_CATEGORIES

  return (
    <>
      <div className="mt-6 flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs text-sky-200">
        <Lock className="size-4" />Management / Supervisor / Authorized Maintenance only — structure prepared for future equipment monitoring.
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((category) => {
          const Icon = categoryIcons[category.key] ?? Cog
          return (
            <div key={category.key} className="rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-violet-300"><Icon className="size-4.5" /></div>
                <p className="text-sm font-semibold text-slate-50">{category.label}</p>
              </div>
              <p className="mt-3 text-xs text-slate-500">Equipment monitoring not yet available — structure ready for Phase W-02.</p>
            </div>
          )
        })}
      </div>
    </>
  )
}
