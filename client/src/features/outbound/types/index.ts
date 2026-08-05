export type DocStatus = 'draft' | 'saved' | 'posted'

export interface WithdrawalLine {
  id: string
  tagNo: string
  batch: string
  location: string
  itemName: string
  packaging: string
  quantity: number
  avgWeight: number
  weight: number
  productionDate: string
  expirationDate: string
  remarks: string
}

export interface WithdrawalDoc {
  id: string
  withdrawalNo: string
  referenceNo: string
  customerNo: string
  customerName: string
  plateNumber: string
  dateTime: string
  status: DocStatus
  lines: WithdrawalLine[]
  totalPallets: number
  totalQuantity: number
  totalWeight: number
}
