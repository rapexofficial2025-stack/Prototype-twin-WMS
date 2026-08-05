import type { RoomTwin } from '@/features/warehouse/types/twin'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined

export const isBackendConfigured = Boolean(API_BASE_URL)

export async function fetchRoomTwin(roomNumber: number): Promise<RoomTwin> {
  const response = await fetch(`${API_BASE_URL}/api/warehouse/rooms/${roomNumber}/twin/`)
  if (!response.ok) throw new Error(`Failed to load room ${roomNumber} twin data (${response.status})`)
  return response.json()
}
