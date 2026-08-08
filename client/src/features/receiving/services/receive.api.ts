import type { ReceivingLine } from '@/features/receiving/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined

export const isBackendConfigured = Boolean(API_BASE_URL)

export interface ReceiveLineRequest {
  customerName: string
  itemName: string
  batch: string
  productionDate: string
  expirationDate: string
  packaging: string
  quantity: number
  avgWeight: number
  locationCode: string
}

interface ReceiveLineApiResponse {
  tagNo: string
  itemName: string
  batch: string
  room: string
  location: string
  productionDate: string | null
  expirationDate: string | null
  quantity: string
  avgWeight: string
  totalWeight: string
}

export async function postReceiveLine(payload: ReceiveLineRequest): Promise<ReceivingLine> {
  const body = { ...payload, productionDate: payload.productionDate || null, expirationDate: payload.expirationDate || null }
  const response = await fetch(`${API_BASE_URL}/api/stock/receive/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Failed to receive stock (${response.status})${detail ? `: ${detail}` : ''}`)
  }
  const data: ReceiveLineApiResponse = await response.json()
  return {
    id: data.tagNo,
    itemName: data.itemName,
    batch: data.batch,
    tagNo: data.tagNo,
    room: data.room,
    location: data.location,
    productionDate: data.productionDate ?? '',
    expirationDate: data.expirationDate ?? '',
    packaging: payload.packaging,
    quantity: Number(data.quantity),
    avgWeight: Number(data.avgWeight),
    totalWeight: Number(data.totalWeight),
  }
}
