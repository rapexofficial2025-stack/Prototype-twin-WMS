import type { WarehouseZone, ZoneAreaStatus } from '@/features/warehouse/types/zones'

export const warehouseZones: WarehouseZone[] = [
  {
    kind: 'loading-dock',
    label: 'Loading Dock',
    description: 'Inbound and outbound truck bays for receiving and dispatch.',
    areas: [
      { id: 'dock-1', name: 'Dock 01', status: 'active', temperature: null, occupancy: 100, occupiedLocations: 1, availableLocations: 0, note: 'Unloading — Truck TRK-2231' },
      { id: 'dock-2', name: 'Dock 02', status: 'available', temperature: null, occupancy: 0, occupiedLocations: 0, availableLocations: 1, note: 'Ready for next assignment' },
      { id: 'dock-3', name: 'Dock 03', status: 'reserved', temperature: null, occupancy: 0, occupiedLocations: 0, availableLocations: 1, note: 'Reserved — 2:30 PM arrival' },
      { id: 'dock-4', name: 'Dock 04', status: 'active', temperature: null, occupancy: 100, occupiedLocations: 1, availableLocations: 0, note: 'Loading — Truck TRK-1187' },
      { id: 'dock-5', name: 'Dock 05', status: 'blocked', temperature: null, occupancy: 100, occupiedLocations: 1, availableLocations: 0, note: 'Out of service — maintenance' },
      { id: 'dock-6', name: 'Dock 06', status: 'available', temperature: null, occupancy: 0, occupiedLocations: 0, availableLocations: 1, note: 'Ready for next assignment' },
    ],
  },
  {
    kind: 'dry-warehouse',
    label: 'Dry Warehouse',
    description: 'Ambient storage for non-perishable and packaging inventory.',
    areas: Array.from({ length: 6 }, (_, i) => {
      const n = i + 1; const capacity = 400 + (i % 3) * 40; const occupied = 210 + ((i * 37) % capacity)
      return { id: `dry-${n}`, name: `Dry Bay ${String(n).padStart(2, '0')}`, status: 'available' as const, temperature: null, occupancy: Math.round((occupied / capacity) * 100), occupiedLocations: occupied, availableLocations: capacity - occupied, note: `${capacity} pallet capacity` }
    }),
  },
  {
    kind: 'cold-storage',
    label: 'Cold Storage',
    description: 'Chilled rooms for temperature-controlled inventory. Select a room to open its digital twin.',
    areas: [],
  },
  {
    kind: 'blast-freezer',
    label: 'Blast Freezer',
    description: 'Rapid-freeze tunnels for incoming product before cold room transfer.',
    areas: Array.from({ length: 4 }, (_, i) => {
      const n = i + 1; const capacity = 60; const occupied = 18 + i * 9
      const status: ZoneAreaStatus = i % 4 === 3 ? 'reserved' : 'active'
      return { id: `bf-${n}`, name: `Blast Freezer ${String(n).padStart(2, '0')}`, status, temperature: -32 - (i % 3), occupancy: Math.round((occupied / capacity) * 100), occupiedLocations: occupied, availableLocations: capacity - occupied, note: 'Cycle time ~4 hrs per batch' }
    }),
  },
  {
    kind: 'anteroom',
    label: 'Anteroom',
    description: 'Temperature buffer zone between dock and cold storage for staging and inspection.',
    areas: Array.from({ length: 3 }, (_, i) => {
      const n = i + 1; const capacity = 40; const occupied = 12 + i * 8
      return { id: `ar-${n}`, name: `Anteroom ${String(n).padStart(2, '0')}`, status: 'available' as const, temperature: 2 + i, occupancy: Math.round((occupied / capacity) * 100), occupiedLocations: occupied, availableLocations: capacity - occupied, note: 'Staging & quality inspection' }
    }),
  },
]
