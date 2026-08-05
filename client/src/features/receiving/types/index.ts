export type DocStatus = 'draft' | 'saved' | 'posted'

export interface ReceivingLine {
  id: string
  itemName: string
  batch: string
  tagNo: string
  room: string
  location: string
  productionDate: string
  expirationDate: string
  packaging: string
  quantity: number
  avgWeight: number
  totalWeight: number
}

export interface ReceivingDoc {
  id: string
  slipNumber: string
  referenceNo: string
  customerNo: string
  customerName: string
  containerNo: string
  containerSize: string
  dateTimeFrom: string
  dateTimeTo: string
  status: DocStatus
  lines: ReceivingLine[]
  totalPallets: number
  totalQuantity: number
  totalWeight: number
}
