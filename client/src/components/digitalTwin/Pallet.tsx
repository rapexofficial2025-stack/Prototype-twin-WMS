import { useMemo } from 'react'
import { Color, Matrix4 } from 'three'
import type { LocationState } from '@/features/dashboard/types'

type PalletProps = { column: number; side: 'left' | 'right'; level: number; depth: number; position: [number, number, number] }
const occupancy = (column: number, level: number, depth: number) => ((column * 17 + level * 11 + depth * 7) % 100) < 70

export function Pallet({ column, level, depth, position }: PalletProps) {
  const occupied = occupancy(column, level, depth)
  const matrix = useMemo(() => new Matrix4().makeTranslation(...position), [position])
  const boxMatrix = useMemo(() => new Matrix4().makeTranslation(position[0], position[1] + 0.72, position[2]), [position])
  return <group onClick={(event) => { event.stopPropagation(); window.dispatchEvent(new CustomEvent('frost:pallet-selected', { detail: { column, level: String.fromCharCode(65 + level), depth: depth + 1, status: occupied ? 'Occupied' : 'Available' } })) }}>
    <instancedMesh args={[undefined, undefined, 1]} matrix={matrix} castShadow receiveShadow><boxGeometry args={[1, 0.14, 1.2]} /><meshStandardMaterial color="#171717" roughness={0.68} /></instancedMesh>
    {occupied && <instancedMesh args={[undefined, undefined, 1]} matrix={boxMatrix} castShadow receiveShadow><boxGeometry args={[0.84, 1.25, 1.02]} /><meshStandardMaterial color={new Color('#7a4c2c')} roughness={0.76} /></instancedMesh>}
  </group>
}
