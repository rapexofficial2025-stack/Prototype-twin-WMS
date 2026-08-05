import type { AdjustmentDoc, LedgerEntry } from '@/features/inventory/types'

export const adjustmentDocs: AdjustmentDoc[] = Array.from({ length: 6 }, (_, index) => ({
  id: `ADJ-${index + 1}`,
  reference: `ADJ-${5000 + index}`,
  customerName: ['JB Grocery', "Jenny's Carenderia", 'Antarctica Distributors'][index % 3],
  reason: (['damaged', 'missing', 'recount', 'wrong_encoding', 'weight_correction'] as const)[index % 5],
  date: '2026-08-04',
  itemName: ['Frozen Chicken', 'Ice Cream Tub', 'Frozen Shrimp'][index % 3],
  tagNo: `TAG-${10000 + index * 100}`,
  location: `L-${(index % 4) + 1}-1`,
  quantityDelta: index % 2 === 0 ? -2 : 2,
  weightDelta: index % 2 === 0 ? -36 : 36,
  remarks: 'Recount during cycle count',
}))

export const ledgerEntries: LedgerEntry[] = Array.from({ length: 12 }, (_, index) => {
  const inbound = index % 3 !== 0
  const quantity = inbound ? 40 : -25
  return {
    id: `LED-${index + 1}`,
    date: `2026-08-0${(index % 9) + 1}`,
    documentNo: inbound ? `RCV-${1000 + index}` : `OUT-${1000 + index}`,
    type: inbound ? 'acceptance' : 'withdrawal',
    batch: `B${2600 + index}`,
    tagNo: `TAG-${10000 + index}`,
    location: `L-${(index % 4) + 1}-1`,
    itemDescription: ['Frozen Chicken', 'Ice Cream Tub', 'Frozen Shrimp'][index % 3],
    quantity,
    packing: 'Box',
    avgWeight: 18,
    weight: quantity * 18,
    runningBalance: 200 + index * 15 + quantity,
    productionDate: '2026-06-01',
    expirationDate: '2027-06-01',
    customerName: ['JB Grocery', "Jenny's Carenderia", 'Antarctica Distributors'][index % 3],
  }
})
