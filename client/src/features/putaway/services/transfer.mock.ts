import type { TransferDoc } from '@/features/putaway/types'

export const transferDocs: TransferDoc[] = Array.from({ length: 6 }, (_, index) => ({
  id: `TRF-${index + 1}`,
  transferNo: `TRF-${4000 + index}`,
  customerName: ['JB Grocery', "Jenny's Carenderia", 'Antarctica Distributors'][index % 3],
  date: '2026-08-03',
  status: (['draft', 'saved', 'posted'] as const)[index % 3],
  lines: Array.from({ length: 1 + (index % 2) }, (_, li) => ({
    id: `TRF-${index + 1}-L${li + 1}`,
    batch: `B${2600 + index * 10 + li}`,
    tagNo: `TAG-${10000 + index * 100 + li}`,
    currentLocation: `L-${(index % 4) + 1}-${li + 1}`,
    newRoom: `Cold Room 0${((index + 1) % 4) + 1}`,
    newLocation: `L-${((index + 1) % 4) + 1}-${li + 1}`,
    itemName: ['Frozen Chicken', 'Ice Cream Tub', 'Frozen Shrimp'][(index + li) % 3],
    quantity: 30 + li * 5,
    packaging: 'Box',
    avgWeight: 18,
    weight: (30 + li * 5) * 18,
  })),
}))
