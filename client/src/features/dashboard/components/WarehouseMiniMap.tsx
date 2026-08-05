import { motion } from 'framer-motion'
import type { LocationState } from '@/features/dashboard/types'

const colors: Record<LocationState, string> = { occupied: 'bg-emerald-500', empty: 'bg-slate-300', reserved: 'bg-amber-400', blocked: 'bg-red-500' }
export function WarehouseMiniMap({ layout }: { layout: LocationState[][] }) {
  return <div className="rounded-lg border border-slate-100 bg-slate-50 p-3"><div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-slate-400"><span>Left rack</span><span className="ml-auto">Door</span><span className="ml-auto">Right rack</span></div><div className="mt-2 grid grid-cols-[1fr_20px_1fr] gap-2"><div className="grid grid-cols-5 gap-1">{layout.slice(0, 2).flat().map((state, index) => <Block key={index} state={state} />)}</div><div className="flex items-center justify-center rounded border border-dashed border-slate-300 bg-white text-[8px] font-bold text-slate-400 [writing-mode:vertical-rl]">DOOR</div><div className="grid grid-cols-5 gap-1">{layout.slice(2).flat().map((state, index) => <Block key={index} state={state} />)}</div></div></div>
}
function Block({ state }: { state: LocationState }) { return <motion.div whileHover={{ scale: 1.35, zIndex: 1 }} transition={{ duration: 0.15 }} className={`h-2.5 rounded-[2px] ${colors[state]}`} /> }
