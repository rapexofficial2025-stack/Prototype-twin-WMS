import type { WithdrawalDoc } from '@/features/outbound/types'

export const withdrawalDocs: WithdrawalDoc[] = Array.from({ length: 8 }, (_, index) => {
  const pallets = 2 + (index % 3)
  const lines = Array.from({ length: pallets }, (_, li) => {
    const quantity = 20 + ((index + li) % 5) * 4
    const avgWeight = 18 + ((index + li) % 4)
    return {
      id: `WD-${index + 1}-L${li + 1}`,
      tagNo: `TAG-${10000 + index * 100 + li}`,
      batch: `B${2600 + index * 10 + li}`,
      location: `L-${(index % 4) + 1}-${li + 1}`,
      itemName: ['Frozen Chicken', 'Ice Cream Tub', 'Frozen Shrimp', 'Beef Cuts'][(index + li) % 4],
      packaging: 'Box',
      quantity,
      avgWeight,
      weight: Math.round(quantity * avgWeight),
      productionDate: '2026-06-01',
      expirationDate: '2027-06-01',
      remarks: '',
    }
  })
  return {
    id: `WD-${index + 1}`,
    withdrawalNo: `OUT-${1000 + index}`,
    referenceNo: `REF-${3000 + index}`,
    customerNo: `CUST-${100 + (index % 5)}`,
    customerName: ['JB Grocery', "Jenny's Carenderia", 'Antarctica Distributors', 'Coldline Foods', 'North Bay Traders'][index % 5],
    plateNumber: `NGP-${100 + index}`,
    dateTime: '2026-08-02T09:00',
    status: (['draft', 'saved', 'posted'] as const)[index % 3],
    lines,
    totalPallets: pallets,
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    totalWeight: lines.reduce((sum, line) => sum + line.weight, 0),
  }
})
