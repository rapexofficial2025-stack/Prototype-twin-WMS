import type { WarehouseZone, ZoneAreaStatus } from '@/features/warehouse/types/zones'

export const warehouseZones: WarehouseZone[] = [
  {
    kind: 'loading-dock',
    label: 'Loading Area',
    description: 'Inbound and outbound truck bays for receiving and dispatch.',
    areas: [
      { id: 'DOCK-01', name: 'Dock 01', status: 'active', temperature: null, occupancy: 100, occupiedLocations: 1, availableLocations: 0, note: 'Unloading — Truck TRK-2231' },
      { id: 'DOCK-02', name: 'Dock 02', status: 'available', temperature: null, occupancy: 0, occupiedLocations: 0, availableLocations: 1, note: 'Ready for next assignment' },
      { id: 'DOCK-03', name: 'Dock 03', status: 'reserved', temperature: null, occupancy: 0, occupiedLocations: 0, availableLocations: 1, note: 'Reserved — 2:30 PM arrival' },
      { id: 'DOCK-04', name: 'Dock 04', status: 'active', temperature: null, occupancy: 100, occupiedLocations: 1, availableLocations: 0, note: 'Loading — Truck TRK-1187' },
      { id: 'DOCK-05', name: 'Dock 05', status: 'blocked', temperature: null, occupancy: 100, occupiedLocations: 1, availableLocations: 0, note: 'Out of service — maintenance' },
      { id: 'DOCK-06', name: 'Dock 06', status: 'available', temperature: null, occupancy: 0, occupiedLocations: 0, availableLocations: 1, note: 'Ready for next assignment' },
    ],
  },
  {
    kind: 'dry-warehouse',
    label: 'Dry Warehouse',
    description: 'Ambient storage for non-perishable and packaging inventory.',
    areas: ['DWH301', 'DWH302', 'DWH303'].map((code, i) => {
      const capacity = 400 + i * 40; const occupied = 210 + ((i * 37) % capacity)
      return { id: code, name: code, status: 'available' as const, temperature: null, occupancy: Math.round((occupied / capacity) * 100), occupiedLocations: occupied, availableLocations: capacity - occupied, note: `${capacity} pallet capacity` }
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
    areas: ['BF101', 'BF102'].map((code, i) => {
      const capacity = 60; const occupied = 18 + i * 9
      const status: ZoneAreaStatus = i === 1 ? 'reserved' : 'active'
      return { id: code, name: code, status, temperature: -32 - i, occupancy: Math.round((occupied / capacity) * 100), occupiedLocations: occupied, availableLocations: capacity - occupied, note: 'Cycle time ~4 hrs per batch' }
    }),
  },
  {
    kind: 'anteroom',
    label: 'Anteroom',
    description: 'Temperature buffer zone between dock and cold storage for staging and inspection.',
    areas: ['AR101', 'AR102', 'AR201'].map((code, i) => {
      const capacity = 40; const occupied = 12 + i * 8
      return { id: code, name: code, status: 'available' as const, temperature: 2 + i, occupancy: Math.round((occupied / capacity) * 100), occupiedLocations: occupied, availableLocations: capacity - occupied, note: 'Staging & quality inspection' }
    }),
  },
  {
    kind: 'chiller-room',
    label: 'Chiller Room',
    description: 'Chilled (above-freezing) storage for temperature-sensitive inventory.',
    areas: ['CHR101', 'CHR102', 'CHR201'].map((code, i) => {
      const capacity = 220; const occupied = 90 + i * 30
      return { id: code, name: code, status: 'available' as const, temperature: 4 + i, occupancy: Math.round((occupied / capacity) * 100), occupiedLocations: occupied, availableLocations: capacity - occupied, note: `${capacity} pallet capacity` }
    }),
  },
]
