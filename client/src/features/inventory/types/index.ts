export type AdjustmentReason = 'damaged' | 'missing' | 'recount' | 'wrong_encoding' | 'weight_correction'

export interface AdjustmentDoc {
  id: string
  reference: string
  customerName: string
  reason: AdjustmentReason
  date: string
  itemName: string
  tagNo: string
  location: string
  quantityDelta: number
  weightDelta: number
  remarks: string
}

export type LedgerTransactionType = 'acceptance' | 'withdrawal' | 'transfer' | 'adjustment'

export interface LedgerEntry {
  id: string
  date: string
  documentNo: string
  type: LedgerTransactionType
  batch: string
  tagNo: string
  location: string
  itemDescription: string
  quantity: number
  packing: string
  avgWeight: number
  weight: number
  runningBalance: number
  productionDate: string
  expirationDate: string
  customerName: string
}
