export type AgeingBucket = '0-3' | '3-6' | '6-9' | '9-12' | '12+'

export interface AgeingRow {
  id: string
  customerName: string
  itemName: string
  bucket: AgeingBucket
  quantity: number
  weight: number
}
