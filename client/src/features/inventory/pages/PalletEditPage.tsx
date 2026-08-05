import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { correctTag, useTags } from '@/features/inventory/services/ledgerStore'

export function PalletEditPage() {
  const { tagNo } = useParams<{ tagNo: string }>()
  const navigate = useNavigate()
  const tags = useTags()
  const tag = tags.find((t) => t.tagNo === tagNo)

  const [quantity, setQuantity] = useState(String(tag?.quantity ?? 0))
  const [location, setLocation] = useState(tag?.location ?? '')
  const [saved, setSaved] = useState(false)

  if (!tag) {
    return <section>
      <div><p className="eyebrow">Inquiry</p><h1 className="page-title">Pallet not found</h1></div>
      <Card className="mt-6 p-6 text-sm text-slate-500">No in-storage pallet with tag <b>{tagNo}</b> was found in the ledger.</Card>
      <Link to="/inventory" className="mt-4 inline-block text-sm text-blue-600 hover:underline">Back to Stock Ledger</Link>
    </section>
  }

  const onSave = () => {
    const newQuantity = Number(quantity)
    if (newQuantity === tag.quantity && location === tag.location) { navigate('/inventory'); return }
    correctTag(tag, { quantity: newQuantity, location })
    setSaved(true)
  }

  return (
    <section>
      <div className="flex items-center gap-3">
        <Link to="/inventory" className="icon-button"><ArrowLeft className="size-4" /></Link>
        <div><p className="eyebrow">Inquiry</p><h1 className="page-title">Edit Pallet {tag.tagNo}</h1></div>
      </div>
      <p className="mt-2 text-sm text-slate-500">Saving writes a new Stock Ledger adjustment entry — the original history is never overwritten.</p>

      <Card className="mt-6 max-w-lg p-6">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Item" value={tag.itemName} /><Info label="Batch" value={tag.batch} />
          <Info label="Customer" value={tag.customerName} /><Info label="Production Date" value={tag.productionDate} />
          <Info label="Expiration Date" value={tag.expirationDate} /><Info label="Avg Weight" value={`${tag.avgWeight} kg`} />
        </dl>

        <label className="mt-5 block text-xs font-medium text-slate-500">Quantity
          <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input mt-1" />
        </label>
        <label className="mt-3 block text-xs font-medium text-slate-500">Location
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="input mt-1" />
        </label>

        <button onClick={onSave} className="mt-5 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Save className="size-4" />Save Correction
        </button>
        {saved && <p className="mt-3 text-sm font-medium text-emerald-600">Saved — a new adjustment entry was added to the Stock Ledger.</p>}
      </Card>
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-slate-400">{label}</dt><dd className="font-medium text-slate-900">{value}</dd></div>
}
