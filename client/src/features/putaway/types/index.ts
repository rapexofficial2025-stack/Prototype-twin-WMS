export type DocStatus = 'draft' | 'saved' | 'posted'

export interface TransferLine {
  id: string
  batch: string
  tagNo: string
  currentLocation: string
  newRoom: string
  newLocation: string
  newTagNo?: string
  itemName: string
  quantity: number
  packaging: string
  avgWeight: number
  weight: number
}

export interface TransferDoc {
  id: string
  transferNo: string
  customerName: string
  date: string
  status: DocStatus
  lines: TransferLine[]
}
