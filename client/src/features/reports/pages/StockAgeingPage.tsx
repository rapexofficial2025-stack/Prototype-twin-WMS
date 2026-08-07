import { Card } from '@/components/ui/card'
import { ageingRows } from '@/features/reports/services/ageing.mock'
import type { AgeingBucket } from '@/features/reports/types'

const buckets: AgeingBucket[] = ['0-3', '3-6', '6-9', '9-12', '12+']
const bucketLabel: Record<AgeingBucket, string> = { '0-3': '0–3 Months', '3-6': '3–6 Months', '6-9': '6–9 Months', '9-12': '9–12 Months', '12+': '12 Months & Over' }

export function StockAgeingPage() {
  return (
    <section>
      <div>
        <p className="eyebrow">Reports</p>
        <h1 className="page-title">Stock Ageing</h1>
        <p className="mt-2 text-sm text-slate-400">FEFO ageing buckets by production date.</p>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {buckets.map((bucket) => {
          const rows = ageingRows.filter((row) => row.bucket === bucket)
          const totalQty = rows.reduce((sum, row) => sum + row.quantity, 0)
          return (
            <Card key={bucket} className="p-5">
              <p className="text-xs font-medium text-slate-400">{bucketLabel[bucket]}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">{totalQty.toLocaleString()}</p>
              <p className="mt-1 text-xs text-slate-500">{rows.length} line item{rows.length === 1 ? '' : 's'}</p>
            </Card>
          )
        })}
      </div>
      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Bucket</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-right">Weight</th>
            </tr>
          </thead>
          <tbody>
            {ageingRows.map((row) => (
              <tr key={row.id} className="border-t border-slate-700 hover:bg-slate-700">
                <td className="px-4 py-3">{row.customerName}</td>
                <td className="px-4 py-3">{row.itemName}</td>
                <td className="px-4 py-3">{bucketLabel[row.bucket]}</td>
                <td className="px-4 py-3 text-right">{row.quantity.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">{row.weight.toLocaleString()} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  )
}
