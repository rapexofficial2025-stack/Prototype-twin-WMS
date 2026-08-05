import { Card } from '@/components/ui/card'
import { ledgerEntries } from '@/features/inventory/services/inventory.mock'

const typeTone: Record<string, string> = {
  acceptance: 'bg-emerald-50 text-emerald-700',
  withdrawal: 'bg-red-50 text-red-700',
  transfer: 'bg-blue-50 text-blue-700',
  adjustment: 'bg-amber-50 text-amber-700',
}

export function StockLedgerPage() {
  return (
    <section>
      <div>
        <p className="eyebrow">Inquiry</p>
        <h1 className="page-title">Stock Ledger</h1>
        <p className="mt-2 text-sm text-slate-500">Full transaction history with running balance per item.</p>
      </div>
      <Card className="mt-7 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
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
            {ledgerEntries.map((entry) => (
              <tr key={entry.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">{entry.date}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{entry.documentNo}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${typeTone[entry.type]}`}>{entry.type}</span></td>
                <td className="px-4 py-3">{entry.itemDescription}</td>
                <td className="px-4 py-3">{entry.tagNo}</td>
                <td className="px-4 py-3">{entry.location}</td>
                <td className={`px-4 py-3 text-right ${entry.quantity < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{entry.quantity > 0 ? '+' : ''}{entry.quantity}</td>
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
