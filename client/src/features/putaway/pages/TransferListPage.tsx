import { Card } from '@/components/ui/card'
import { transferDocs } from '@/features/putaway/services/transfer.mock'
import type { DocStatus } from '@/features/putaway/types'

const statusTone: Record<DocStatus, string> = {
  draft: 'bg-slate-700 text-slate-300',
  saved: 'bg-amber-500/15 text-amber-300',
  posted: 'bg-emerald-500/15 text-emerald-300',
}

export function TransferListPage() {
  return (
    <section>
      <div>
        <p className="eyebrow">Storage</p>
        <h1 className="page-title">Stock Transfer</h1>
        <p className="mt-2 text-sm text-slate-400">Internal warehouse movement between locations.</p>
      </div>
      <div className="mt-7 space-y-4">
        {transferDocs.map((doc) => (
          <Card key={doc.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-50">{doc.transferNo}</p>
                <p className="text-xs text-slate-400">{doc.customerName} · {doc.date}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusTone[doc.status]}`}>{doc.status}</span>
            </div>
            <table className="mt-4 w-full text-left text-xs">
              <thead className="text-slate-400">
                <tr>
                  <th className="px-2 py-1">Item</th>
                  <th className="px-2 py-1">Tag No.</th>
                  <th className="px-2 py-1">From</th>
                  <th className="px-2 py-1">To</th>
                  <th className="px-2 py-1 text-right">Qty</th>
                  <th className="px-2 py-1 text-right">Weight</th>
                </tr>
              </thead>
              <tbody>
                {doc.lines.map((line) => (
                  <tr key={line.id} className="border-t border-slate-700">
                    <td className="px-2 py-1">{line.itemName}</td>
                    <td className="px-2 py-1">{line.tagNo}</td>
                    <td className="px-2 py-1">{line.currentLocation}</td>
                    <td className="px-2 py-1">{line.newRoom} · {line.newLocation}</td>
                    <td className="px-2 py-1 text-right">{line.quantity}</td>
                    <td className="px-2 py-1 text-right">{line.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ))}
      </div>
    </section>
  )
}
