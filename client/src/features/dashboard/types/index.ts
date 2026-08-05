export type LocationState = 'occupied' | 'empty' | 'reserved' | 'blocked'
export interface ColdRoom { id: string; name: string; temperature: number; occupancy: number; occupiedLocations: number; availableLocations: number; shipmentsToday: number; inboundToday: number; outboundToday: number; layout: LocationState[][] }
