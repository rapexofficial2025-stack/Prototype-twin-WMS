import type { AgeingRow } from '@/features/reports/types'

const buckets = ['0-3', '3-6', '6-9', '9-12', '12+'] as const

export const ageingRows: AgeingRow[] = Array.from({ length: 10 }, (_, index) => ({
  id: `AGE-${index + 1}`,
  customerName: ['JB Grocery', "Jenny's Carenderia", 'Antarctica Distributors'][index % 3],
  itemName: ['Frozen Chicken', 'Ice Cream Tub', 'Frozen Shrimp'][index % 3],
  bucket: buckets[index % buckets.length],
  quantity: 30 + index * 4,
  weight: (30 + index * 4) * 18,
}))
