import type { ReceivingDoc } from '@/features/receiving/types'

export const receivingDocs: ReceivingDoc[] = Array.from({ length: 8 }, (_, index) => {
  const pallets = 3 + (index % 4)
  const lines = Array.from({ length: pallets }, (_, li) => {
    const quantity = 40 + ((index + li) % 6) * 5
    const avgWeight = 18 + ((index + li) % 4)
    return {
      id: `RCV-${index + 1}-L${li + 1}`,
      itemName: ['Frozen Chicken', 'Ice Cream Tub', 'Frozen Shrimp', 'Beef Cuts'][(index + li) % 4],
      batch: `B${2600 + index * 10 + li}`,
      tagNo: `TAG-${10000 + index * 100 + li}`,
      room: `Cold Room 0${(index % 4) + 1}`,
      location: `L-${(index % 4) + 1}-${li + 1}`,
      productionDate: '2026-06-01',
      expirationDate: '2027-06-01',
      packaging: 'Box',
      quantity,
      avgWeight,
      totalWeight: Math.round(quantity * avgWeight),
    }
  })
  return {
    id: `RCV-${index + 1}`,
    slipNumber: `SLP-${1000 + index}`,
    referenceNo: `REF-${2000 + index}`,
    customerNo: `CUST-${100 + (index % 5)}`,
    customerName: ['JB Grocery', "Jenny's Carenderia", 'Antarctica Distributors', 'Coldline Foods', 'North Bay Traders'][index % 5],
    containerNo: `CONT-${300 + index}`,
    containerSize: index % 2 === 0 ? "40'" : "20'",
    dateTimeFrom: '2026-08-01T08:00',
    dateTimeTo: '2026-08-01T11:00',
    status: (['draft', 'saved', 'posted'] as const)[index % 3],
    lines,
    totalPallets: pallets,
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    totalWeight: lines.reduce((sum, line) => sum + line.totalWeight, 0),
  }
})
