import type { ComponentType } from 'react'

export interface SectionStat {
  label: string
  value: string
}

export function SectionCard({ icon: Icon, label, active, restricted, stats, onClick }: {
  icon: ComponentType<{ className?: string }>
  label: string
  active: boolean
  restricted?: boolean
  stats: SectionStat[]
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border p-5 text-left shadow-sm transition-colors ${active ? 'border-sky-500 bg-sky-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}
    >
      <div className="flex items-center justify-between">
        <div className={`grid size-9 place-items-center rounded-lg ${active ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-700 text-slate-300'}`}><Icon className="size-4.5" /></div>
        {restricted && <span className="rounded-md bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-300">Restricted</span>}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-50">{label}</p>
      <div className="mt-2 space-y-0.5">
        {stats.map((stat) => (
          <p key={stat.label} className="flex items-center justify-between text-xs text-slate-400"><span>{stat.label}</span><span className="font-medium text-slate-200">{stat.value}</span></p>
        ))}
      </div>
    </button>
  )
}
