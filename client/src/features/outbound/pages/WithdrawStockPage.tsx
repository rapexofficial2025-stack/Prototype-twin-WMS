import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, PackageMinus, Search, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { reverseWithdrawal, useTags, withdrawTag, type TagSnapshot } from '@/features/inventory/services/ledgerStore'

interface WithdrawnLine { id: string; tag: TagSnapshot; quantity: number }

const roomOf = (location: string) => Number(location.split('-')[1]) || null

export function WithdrawStockPage() {
  const tags = useTags()
  const [search, setSearch] = useState('')
  const [room, setRoom] = useState<'all' | number>('all')
  const [selected, setSelected] = useState<TagSnapshot | null>(null)
  const [quantity, setQuantity] = useState('')
  const [withdrawn, setWithdrawn] = useState<WithdrawnLine[]>([])

  const results = useMemo(() => tags
    .filter((t) => t.quantity > 0)
    .filter((t) => room === 'all' || roomOf(t.location) === room)
    .filter((t) => !search.trim() || t.itemName.toLowerCase().includes(search.toLowerCase()) || t.tagNo.toLowerCase().includes(search.toLowerCase()) || t.batch.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.expirationDate.localeCompare(b.expirationDate)), // FEFO: soonest expiration first
    [tags, search, room])

  const rooms = useMemo(() => Array.from(new Set(tags.map((t) => roomOf(t.location)).filter((n): n is number => n !== null))).sort((a, b) => a - b), [tags])

  const selectTag = (tag: TagSnapshot) => { setSelected(tag); setQuantity(String(tag.quantity)) }

  const confirmWithdrawal = () => {
    if (!selected) return
    const qty = Math.min(Number(quantity), selected.quantity)
    if (qty <= 0) return
    withdrawTag(selected, qty)
    setWithdrawn((current) => [{ id: crypto.randomUUID(), tag: selected, quantity: qty }, ...current])
    setSelected(null)
    setQuantity('')
  }

  const undoWithdrawal = (line: WithdrawnLine) => {
    reverseWithdrawal(line.tag, line.quantity)
    setWithdrawn((current) => current.filter((l) => l.id !== line.id))
  }

  return (
    <section>
      <div className="flex items-center gap-3">
        <Link to="/outbound" className="icon-button"><ArrowLeft className="size-4" /></Link>
        <div><p className="eyebrow">Storage</p><h1 className="page-title">Withdraw Stock</h1></div>
      </div>
      <p className="mt-2 text-sm text-slate-500">Search for an in-storage pallet by item, room, batch, or tag — results are FEFO-sorted (soonest expiration first).</p>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search item, batch, or tag no…" className="input pl-9" />
          </div>
          <select value={room} onChange={(e) => setRoom(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="input w-auto">
            <option value="all">All rooms</option>
            {rooms.map((r) => <option key={r} value={r}>Room {r}</option>)}
          </select>
        </div>

        <table className="mt-4 w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-2 py-2">Item</th><th className="px-2 py-2">Batch</th><th className="px-2 py-2">Tag No.</th><th className="px-2 py-2">Location</th><th className="px-2 py-2">Expiration</th><th className="px-2 py-2 text-right">Available</th></tr>
          </thead>
          <tbody>
            {results.length === 0 && <tr><td colSpan={6} className="px-2 py-6 text-center text-slate-400">No matching in-storage pallets.</td></tr>}
            {results.map((tag) => (
              <tr key={tag.tagNo} onClick={() => selectTag(tag)} className={`cursor-pointer border-t border-slate-100 hover:bg-slate-50 ${selected?.tagNo === tag.tagNo ? 'bg-blue-50' : ''}`}>
                <td className="px-2 py-2">{tag.itemName}</td><td className="px-2 py-2">{tag.batch}</td><td className="px-2 py-2">{tag.tagNo}</td>
                <td className="px-2 py-2">{tag.location}</td><td className="px-2 py-2">{tag.expirationDate}</td><td className="px-2 py-2 text-right">{tag.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {selected && (
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="text-sm"><p className="font-medium text-slate-900">{selected.itemName} · {selected.tagNo}</p><p className="text-slate-500">{selected.location} — {selected.quantity} available</p></div>
            <label className="text-xs font-medium text-slate-500">Quantity to withdraw
              <input type="number" min="1" max={selected.quantity} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input mt-1 w-32" />
            </label>
            <button onClick={confirmWithdrawal} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <PackageMinus className="size-4" />Confirm Withdrawal
            </button>
            <button onClick={() => setSelected(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white">Cancel</button>
          </div>
        )}
      </Card>

      {withdrawn.length > 0 && (
        <Card className="mt-5 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Tag No.</th><th className="px-4 py-3">Location</th><th className="px-4 py-3 text-right">Qty Withdrawn</th><th className="w-10 px-2 py-3" /></tr>
            </thead>
            <tbody>
              {withdrawn.map((line) => (
                <tr key={line.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{line.tag.itemName}</td><td className="px-4 py-3">{line.tag.tagNo}</td><td className="px-4 py-3">{line.tag.location}</td>
                  <td className="px-4 py-3 text-right">{line.quantity}</td>
                  <td className="px-2 py-3 text-center">
                    <button onClick={() => undoWithdrawal(line)} title="Undo this withdrawal" className="mx-auto grid size-5 place-items-center rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                      <X className="size-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </section>
  )
}
