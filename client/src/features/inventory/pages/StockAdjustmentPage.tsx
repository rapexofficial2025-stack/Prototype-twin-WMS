import { Card } from '@/components/ui/card'
import { adjustmentDocs } from '@/features/inventory/services/inventory.mock'

const reasonLabel: Record<string, string> = {
  damaged: 'Damaged',
  missing: 'Missing',
  recount: 'Recount',
  wrong_encoding: 'Wrong Encoding',
  weight_correction: 'Weight Correction',
}

export function StockAdjustmentPage() {
  return (
    <section>
      <div>
        <p className="eyebrow">Storage</p>
        <h1 className="page-title">Stock Adjustment</h1>
        <p className="mt-2 text-sm text-slate-500">Inventory corrections with reason codes.</p>
      </div>
      <Card className="mt-7 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3 text-right">Qty Δ</th>
              <th className="px-4 py-3 text-right">Weight Δ</th>
              <th className="px-4 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {adjustmentDocs.map((doc) => (
              <tr key={doc.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">{doc.date}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{doc.reference}</td>
                <td className="px-4 py-3">{doc.customerName}</td>
                <td className="px-4 py-3">{doc.itemName}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{reasonLabel[doc.reason]}</span></td>
                <td className={`px-4 py-3 text-right ${doc.quantityDelta < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{doc.quantityDelta > 0 ? '+' : ''}{doc.quantityDelta}</td>
                <td className={`px-4 py-3 text-right ${doc.weightDelta < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{doc.weightDelta > 0 ? '+' : ''}{doc.weightDelta} kg</td>
                <td className="px-4 py-3 text-slate-500">{doc.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  )
}
