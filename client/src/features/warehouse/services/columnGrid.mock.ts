// Same demo occupancy formula as the 3D twin (Pallet.tsx), so the grid and
// twin agree in demo mode. Only used when no live backend is configured.
const ITEMS = ['Pork Belly', 'Pork Loin', 'Pork Leg', 'Pork Back', 'Pork Hock', 'Chicken', 'Bossing']
const demoOccupancy = (column: number, level: number, depth: number) => ((column * 17 + level * 11 + depth * 7) % 100) < 70

export interface GridCell { itemName: string; batch: string; quantity: number }

export function getDemoCell(column: number, level: number, depth: number): GridCell | null {
  if (!demoOccupancy(column, level, depth)) return null
  const seed = column * 31 + level * 13 + depth * 5
  return { itemName: ITEMS[seed % ITEMS.length], batch: `ATK-${100 + (seed % 900)}`, quantity: 10 + (seed % 50) }
}
