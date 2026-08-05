import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { TwinProvider } from '@/features/warehouse/context/TwinContext'
import { RoomColumnGrid } from '@/features/warehouse/components/RoomColumnGrid'

type Wing = 'both' | 'left' | 'right'
const ROOMS = Array.from({ length: 10 }, (_, i) => i + 1)
const LEFT_COLUMNS = Array.from({ length: 15 }, (_, i) => i + 1)
const RIGHT_COLUMNS = Array.from({ length: 15 }, (_, i) => i + 16)

export function RoomDetailPage() {
  const { roomNumber } = useParams<{ roomNumber: string }>()
  const navigate = useNavigate()
  const room = Number(roomNumber) || 1
  const [wing, setWing] = useState<Wing>('both')

  const columns = wing === 'left' ? LEFT_COLUMNS : wing === 'right' ? RIGHT_COLUMNS : [...LEFT_COLUMNS, ...RIGHT_COLUMNS]

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Warehouse / Cold Rooms</p>
          <h1 className="page-title">Cold Room {String(room).padStart(2, '0')} — Column Grid</h1>
          <p className="mt-2 text-sm text-slate-500">Every column, level (A–G), and depth (1–4) at a glance. Click 3D Digital Twin for the walkthrough view.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Select room" value={room} onChange={(e) => navigate(`/warehouse/room/${e.target.value}`)} className="control-button !bg-white !text-slate-700 border-slate-300">
            {ROOMS.map((r) => <option key={r} value={r}>Room {r}</option>)}
          </select>
          <div className="flex overflow-hidden rounded-lg border border-slate-300">
            {(['both', 'left', 'right'] as const).map((w) => (
              <button key={w} onClick={() => setWing(w)} className={`px-3 py-2 text-sm font-medium capitalize ${wing === w ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
                {w === 'both' ? 'Full View' : `${w} Wing`}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/digital-twin')} className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Box className="size-4" />3D Digital Twin
          </button>
        </div>
      </div>

      <Card className="mt-6 p-5">
        <TwinProvider roomNumber={room}>
          <RoomColumnGrid columns={columns} />
        </TwinProvider>
      </Card>
    </section>
  )
}
