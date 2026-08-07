import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { useLedgerEntries } from '@/features/inventory/services/ledgerStore'

const typeTone: Record<string, string> = {
  acceptance: 'bg-emerald-500/15 text-emerald-300',
  withdrawal: 'bg-red-500/15 text-red-300',
  transfer: 'bg-sky-500/15 text-sky-300',
  adjustment: 'bg-amber-500/15 text-amber-300',
}

export function StockLedgerPage() {
  const entries = useLedgerEntries()
  const navigate = useNavigate()

  return (
    <section>
      <div>
        <p className="eyebrow">Inquiry</p>
        <h1 className="page-title">Stock Ledger</h1>
        <p className="mt-2 text-sm text-slate-400">Full transaction history with running balance per item. Click a row to open and correct that pallet.</p>
      </div>
      <Card className="mt-7 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Document No.</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Tag No.</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Weight</th>
              <th className="px-4 py-3 text-right">Running Balance</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} onClick={() => navigate(`/inventory/pallet/${entry.tagNo}`)} className="cursor-pointer border-t border-slate-700 hover:bg-slate-700">
                <td className="px-4 py-3">{entry.date}</td>
                <td className="px-4 py-3 font-medium text-slate-50">{entry.documentNo}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${typeTone[entry.type]}`}>{entry.type}</span></td>
                <td className="px-4 py-3">{entry.itemDescription}</td>
                <td className="px-4 py-3 text-sky-400 underline-offset-2 hover:underline">{entry.tagNo}</td>
                <td className="px-4 py-3">{entry.location}</td>
                <td className={`px-4 py-3 text-right ${entry.quantity < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{entry.quantity > 0 ? '+' : ''}{entry.quantity}</td>
                <td className="px-4 py-3 text-right">{entry.weight} kg</td>
                <td className="px-4 py-3 text-right font-medium">{entry.runningBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  )
}
