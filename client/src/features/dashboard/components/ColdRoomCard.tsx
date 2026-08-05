import { ArrowDownToLine, ArrowUpFromLine, Box, ThermometerSnowflake } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { ColdRoom } from '@/features/dashboard/types'
import { WarehouseMiniMap } from './WarehouseMiniMap'

export function ColdRoomCard({ room }: { room: ColdRoom }) {
  const navigate = useNavigate(); const isFirstRoom = room.id === 'room-1'
  return <motion.article layout whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} transition={{ type: 'spring', stiffness: 420, damping: 24 }} onClick={() => isFirstRoom && navigate('/warehouse/room-1')} className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${isFirstRoom ? 'cursor-pointer' : ''}`}>
    <div className="flex items-start justify-between"><div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{room.name}</p><div className="mt-2 flex items-center gap-1.5"><ThermometerSnowflake className="size-4 text-blue-600" /><span className="text-xl font-semibold text-slate-900">{room.temperature.toFixed(1)}°C</span></div></div><span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{room.occupancy}% full</span></div>
    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${room.occupancy}%` }} /></div>
    <div className="mt-4 grid grid-cols-2 gap-3"><Metric icon={Box} label="Occupied" value={room.occupiedLocations} /><Metric icon={Box} label="Available" value={room.availableLocations} /></div>
    <div className="mt-4 grid grid-cols-3 border-y border-slate-100 py-3"><SmallMetric icon={Box} label="Shipments" value={room.shipmentsToday} /><SmallMetric icon={ArrowDownToLine} label="Inbound" value={room.inboundToday} /><SmallMetric icon={ArrowUpFromLine} label="Outbound" value={room.outboundToday} /></div>
    <div className="mt-4"><WarehouseMiniMap layout={room.layout} /></div>
  </motion.article>
}
function Metric({ icon: Icon, label, value }: { icon: typeof Box; label: string; value: number }) { return <div><div className="flex items-center gap-1 text-xs text-slate-500"><Icon className="size-3.5" />{label}</div><p className="mt-1 text-base font-semibold text-slate-800">{value}<span className="ml-1 text-xs font-normal text-slate-400">locations</span></p></div> }
function SmallMetric({ icon: Icon, label, value }: { icon: typeof Box; label: string; value: number }) { return <div className="border-r border-slate-100 px-2 text-center first:pl-0 last:border-0 last:pr-0"><Icon className="mx-auto size-3.5 text-slate-400" /><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p><p className="text-[10px] text-slate-500">{label}</p></div> }
