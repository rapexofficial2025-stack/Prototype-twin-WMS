import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, PackageMinus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { withdrawalDocs } from '@/features/outbound/services/outbound.mock'
import type { DocStatus } from '@/features/outbound/types'

const statusTone: Record<DocStatus, string> = {
  draft: 'bg-slate-700 text-slate-300',
  saved: 'bg-amber-500/15 text-amber-300',
  posted: 'bg-emerald-500/15 text-emerald-300',
}

export function OutboundListPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Storage</p>
          <h1 className="page-title">Stock Withdrawal</h1>
          <p className="mt-2 text-sm text-slate-400">Outbound shipment transactions.</p>
        </div>
        <Link to="/outbound/new" className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">
          <PackageMinus className="size-4" />Withdraw Stock
        </Link>
      </div>
      <Card className="mt-7 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="w-9" />
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Withdrawal No.</th>
              <th className="px-4 py-3">Plate No.</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 text-right">Total Qty</th>
              <th className="px-4 py-3 text-right">Total Weight</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {withdrawalDocs.map((doc) => {
              const isOpen = expanded === doc.id
              return (
                <Fragment key={doc.id}>
                  <tr onClick={() => setExpanded(isOpen ? null : doc.id)} className="cursor-pointer border-t border-slate-700 hover:bg-slate-700">
                    <td className="px-4 py-3 text-slate-500">{isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}</td>
                    <td className="px-4 py-3">{doc.dateTime.slice(0, 10)}</td>
                    <td className="px-4 py-3 font-medium text-slate-50">{doc.withdrawalNo}</td>
                    <td className="px-4 py-3">{doc.plateNumber}</td>
                    <td className="px-4 py-3">{doc.customerName}</td>
                    <td className="px-4 py-3 text-right">{doc.totalQuantity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{doc.totalWeight.toLocaleString()} kg</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusTone[doc.status]}`}>{doc.status}</span></td>
                  </tr>
                  {isOpen && (
                    <tr className="border-t border-slate-700 bg-slate-800/60">
                      <td colSpan={8} className="px-4 py-3">
                        <table className="w-full text-xs">
                          <thead className="text-slate-400">
                            <tr>
                              <th className="px-2 py-1 text-left">Item</th>
                              <th className="px-2 py-1 text-left">Batch</th>
                              <th className="px-2 py-1 text-left">Tag No.</th>
                              <th className="px-2 py-1 text-left">Location</th>
                              <th className="px-2 py-1 text-right">Qty</th>
                              <th className="px-2 py-1 text-right">Avg Wt</th>
                              <th className="px-2 py-1 text-right">Weight</th>
                            </tr>
                          </thead>
                          <tbody>
                            {doc.lines.map((line) => (
                              <tr key={line.id} className="border-t border-slate-700">
                                <td className="px-2 py-1">{line.itemName}</td>
                                <td className="px-2 py-1">{line.batch}</td>
                                <td className="px-2 py-1">{line.tagNo}</td>
                                <td className="px-2 py-1">{line.location}</td>
                                <td className="px-2 py-1 text-right">{line.quantity}</td>
                                <td className="px-2 py-1 text-right">{line.avgWeight}</td>
                                <td className="px-2 py-1 text-right">{line.weight}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </Card>
    </section>
  )
}
