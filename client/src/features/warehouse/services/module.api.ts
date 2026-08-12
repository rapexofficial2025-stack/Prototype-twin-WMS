import type { AreaType, AssetApi, AssetType, DockApi, MachineRoomApi, WarehouseAreaApi, WarehouseSummaryApi } from '@/features/warehouse/types/module'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined

export const isBackendConfigured = Boolean(API_BASE_URL)

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) throw new Error(`Request to ${path} failed (${response.status})`)
  return response.json()
}

export async function fetchWarehouseAreas(areaType?: AreaType): Promise<WarehouseAreaApi[]> {
  const query = areaType ? `?type=${areaType}` : ''
  const data = await getJson<{ results: WarehouseAreaApi[] }>(`/api/warehouse/areas/${query}`)
  return data.results
}

export async function fetchDocks(): Promise<DockApi[]> {
  const data = await getJson<{ results: DockApi[] }>('/api/warehouse/docks/')
  return data.results
}

export async function fetchAssets(assetType?: AssetType): Promise<AssetApi[]> {
  const query = assetType ? `?type=${assetType}` : ''
  const data = await getJson<{ results: AssetApi[] }>(`/api/warehouse/assets/${query}`)
  return data.results
}

export function fetchWarehouseSummary(): Promise<WarehouseSummaryApi> {
  return getJson<WarehouseSummaryApi>('/api/warehouse/summary/')
}

export function fetchMachineRoom(): Promise<MachineRoomApi> {
  return getJson<MachineRoomApi>('/api/warehouse/machine-room/')
}
