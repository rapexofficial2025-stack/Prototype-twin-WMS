import { useTwinLookup } from '@/features/warehouse/context/TwinContext'
import { getDemoCell } from '@/features/warehouse/services/columnGrid.mock'

const LEVELS = [6, 5, 4, 3, 2, 1, 0] // G at top down to A at bottom, matching the physical rack
const LEVEL_LETTERS = 'ABCDEFG'
const DEPTHS = [3, 2, 1, 0] // labeled 4,3,2,1 left to right

interface Cell { occupied: boolean; itemName?: string; batch?: string; quantity?: number }

export function RoomColumnGrid({ columns }: { columns: number[] }) {
  const { isLive, getLocation } = useTwinLookup()

  const readCell = (column: number, level: number, depth: number): Cell => {
    const side = column <= 15 ? 'left' : 'right'
    if (isLive) {
      const location = getLocation(side, column, level, depth)
      return { occupied: location?.status === 'occupied', itemName: location?.itemName ?? undefined, batch: location?.batchNo ?? undefined, quantity: location?.quantity ?? undefined }
    }
    const demo = getDemoCell(column, level, depth)
    return demo ? { occupied: true, itemName: demo.itemName, batch: demo.batch, quantity: demo.quantity } : { occupied: false }
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 pb-2">
        {columns.map((column) => {
          const rows = LEVELS.map((level) => ({ level, cells: DEPTHS.map((depth) => readCell(column, level, depth)) }))
          const total = rows.reduce((sum, row) => sum + row.cells.filter((c) => c.occupied).length, 0)
          return (
            <div key={column} className="w-[230px] shrink-0 overflow-hidden rounded-lg border border-slate-600 text-[11px]">
              <div className="grid grid-cols-[24px_repeat(4,1fr)] bg-slate-700 text-center font-semibold text-slate-300">
                <div className="border-r border-slate-600 py-1">L</div>
                {DEPTHS.map((d) => <div key={d} className="border-r border-slate-600 py-1 last:border-r-0">{d + 1}</div>)}
              </div>
              {rows.map(({ level, cells }) => (
                <div key={level} className="grid grid-cols-[24px_repeat(4,1fr)] border-t border-slate-700">
                  <div className="grid place-items-center border-r border-slate-700 bg-slate-900 font-semibold text-slate-400">{LEVEL_LETTERS[level]}</div>
                  {cells.map((cell, i) => (
                    <div key={i} className={`min-h-11 border-r border-slate-700 p-1 text-center last:border-r-0 ${cell.occupied ? 'bg-sky-500/15' : 'bg-slate-800 text-slate-600'}`}>
                      {cell.occupied ? <>
                        <div className="truncate font-medium text-slate-50">{cell.itemName}</div>
                        <div className="truncate text-slate-400">{cell.batch}</div>
                        <div className="font-semibold text-sky-300">{cell.quantity}</div>
                      </> : '—'}
                    </div>
                  ))}
                </div>
              ))}
              <div className="border-t border-slate-600 bg-slate-950 py-1.5 text-center font-semibold text-white">
                COLUMN {column} <span className="ml-1 text-sky-300">{total}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
