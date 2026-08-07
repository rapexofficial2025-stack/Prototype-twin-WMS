import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, RotateCcw, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getVacantLocations } from '@/features/receiving/services/locations.mock'
import type { ReceivingLine } from '@/features/receiving/types'

const ITEM_SUGGESTIONS = ['Frozen Chicken', 'Ice Cream Tub', 'Frozen Shrimp', 'Beef Cuts']
const PACKAGING_SUGGESTIONS = ['Box', 'Sack', 'Carton', 'Drum']
const ROOMS = Array.from({ length: 10 }, (_, i) => i + 1)

const emptyDraft = {
  itemName: '', batch: '', productionDate: '', expirationDate: '', packaging: 'Box',
  quantity: '', avgWeight: '', room: 1, location: '',
}
type Draft = typeof emptyDraft

export function AddStockPage() {
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [lines, setLines] = useState<ReceivingLine[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const vacantLocations = useMemo(() => getVacantLocations(draft.room), [draft.room])

  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }))

  const isValid = draft.itemName.trim() !== '' && draft.location.trim() !== '' && Number(draft.quantity) > 0

  const submit = () => {
    if (!isValid) return
    const quantity = Number(draft.quantity)
    const avgWeight = Number(draft.avgWeight) || 0
    const line: ReceivingLine = {
      id: editingId ?? crypto.randomUUID(),
      itemName: draft.itemName, batch: draft.batch, tagNo: editingId ? (lines.find((l) => l.id === editingId)?.tagNo ?? '') : `TAG-${Math.floor(10000 + Math.random() * 89999)}`,
      room: `Cold Room ${String(draft.room).padStart(2, '0')}`, location: draft.location,
      productionDate: draft.productionDate, expirationDate: draft.expirationDate, packaging: draft.packaging,
      quantity, avgWeight, totalWeight: Math.round(quantity * avgWeight),
    }

    if (editingId) {
      setLines((current) => current.map((l) => (l.id === editingId ? line : l)))
      setEditingId(null)
      setDraft(emptyDraft)
    } else {
      setLines((current) => [line, ...current]) // newest appears right below the fill-up box
      update({ location: '' }) // everything else repeats; only location resets for the next pallet
    }
  }

  const resetDraft = () => { setDraft(emptyDraft); setEditingId(null) }

  const editLine = (line: ReceivingLine) => {
    setEditingId(line.id)
    setDraft({
      itemName: line.itemName, batch: line.batch, productionDate: line.productionDate, expirationDate: line.expirationDate,
      packaging: line.packaging, quantity: String(line.quantity), avgWeight: String(line.avgWeight),
      room: Number(line.room.replace(/\D/g, '')) || 1, location: line.location,
    })
  }

  const deleteLine = (id: string) => {
    setLines((current) => current.filter((l) => l.id !== id))
    if (editingId === id) resetDraft()
  }

  const totalPallets = lines.length
  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0)
  const totalWeight = lines.reduce((sum, l) => sum + l.totalWeight, 0)

  return (
    <section>
      <div className="flex items-center gap-3">
        <Link to="/receiving" className="icon-button"><ArrowLeft className="size-4" /></Link>
        <div>
          <p className="eyebrow">Storage</p>
          <h1 className="page-title">Add Stock — Stock Acceptance</h1>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-400">Fill in one pallet, click Add — item details repeat for the next pallet, only the location resets.</p>

      <Card className="mt-6 p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Item Name"><input list="item-suggestions" value={draft.itemName} onChange={(e) => update({ itemName: e.target.value })} className="input" placeholder="e.g. Frozen Chicken" /><datalist id="item-suggestions">{ITEM_SUGGESTIONS.map((i) => <option key={i} value={i} />)}</datalist></Field>
          <Field label="Batch No."><input value={draft.batch} onChange={(e) => update({ batch: e.target.value })} className="input" placeholder="B2601" /></Field>
          <Field label="Production Date"><input type="date" value={draft.productionDate} onChange={(e) => update({ productionDate: e.target.value })} className="input" /></Field>
          <Field label="Expiration Date"><input type="date" value={draft.expirationDate} onChange={(e) => update({ expirationDate: e.target.value })} className="input" /></Field>
          <Field label="Packaging"><input list="packaging-suggestions" value={draft.packaging} onChange={(e) => update({ packaging: e.target.value })} className="input" /><datalist id="packaging-suggestions">{PACKAGING_SUGGESTIONS.map((p) => <option key={p} value={p} />)}</datalist></Field>
          <Field label="Quantity"><input type="number" min="0" value={draft.quantity} onChange={(e) => update({ quantity: e.target.value })} className="input" placeholder="40" /></Field>
          <Field label="Avg Weight (kg)"><input type="number" min="0" step="0.1" value={draft.avgWeight} onChange={(e) => update({ avgWeight: e.target.value })} className="input" placeholder="18" /></Field>
          <Field label="Room"><select value={draft.room} onChange={(e) => update({ room: Number(e.target.value), location: '' })} className="input">{ROOMS.map((r) => <option key={r} value={r}>Cold Room {String(r).padStart(2, '0')}</option>)}</select></Field>
          <Field label="Location (vacant only)">
            <input list="vacant-locations" value={draft.location} onChange={(e) => update({ location: e.target.value })} className="input" placeholder="Type to filter…" />
            <datalist id="vacant-locations">{vacantLocations.map((code) => <option key={code} value={code} />)}</datalist>
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button onClick={submit} disabled={!isValid} className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40">
            <Plus className="size-4" />{editingId ? 'Update Pallet' : 'Add Pallet'}
          </button>
          <button onClick={resetDraft} className="flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700">
            <RotateCcw className="size-4" />{editingId ? 'Cancel edit' : 'Reset'}
          </button>
          {editingId && <span className="text-xs font-medium text-amber-400">Editing existing pallet — Update will replace it in place.</span>}
        </div>
      </Card>

      <Card className="mt-5 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Item</th><th className="px-4 py-3">Batch</th><th className="px-4 py-3">Tag No.</th>
              <th className="px-4 py-3">Room</th><th className="px-4 py-3">Location</th><th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Weight</th><th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">No pallets added yet.</td></tr>}
            {lines.map((line) => (
              <tr key={line.id} className={`cursor-pointer border-t border-slate-700 hover:bg-slate-700 ${editingId === line.id ? 'bg-sky-500/15' : ''}`}>
                <td className="px-4 py-3" onClick={() => editLine(line)}>{line.itemName}</td>
                <td className="px-4 py-3" onClick={() => editLine(line)}>{line.batch}</td>
                <td className="px-4 py-3" onClick={() => editLine(line)}>{line.tagNo}</td>
                <td className="px-4 py-3" onClick={() => editLine(line)}>{line.room}</td>
                <td className="px-4 py-3" onClick={() => editLine(line)}>{line.location}</td>
                <td className="px-4 py-3 text-right" onClick={() => editLine(line)}>{line.quantity}</td>
                <td className="px-4 py-3 text-right" onClick={() => editLine(line)}>{line.totalWeight} kg</td>
                <td className="px-2 py-3 text-center">
                  <button onClick={(e) => { e.stopPropagation(); deleteLine(line.id) }} title="Delete this pallet" className="mx-auto grid size-5 place-items-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30">
                    <X className="size-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {lines.length > 0 && <tfoot className="border-t border-slate-700 bg-slate-900 text-sm font-medium text-slate-200">
            <tr><td className="px-4 py-3" colSpan={5}>Total: {totalPallets} pallet{totalPallets === 1 ? '' : 's'}</td><td className="px-4 py-3 text-right">{totalQuantity.toLocaleString()}</td><td className="px-4 py-3 text-right">{totalWeight.toLocaleString()} kg</td><td /></tr>
          </tfoot>}
        </table>
      </Card>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-slate-400">{label}<div className="mt-1">{children}</div></label>
}
