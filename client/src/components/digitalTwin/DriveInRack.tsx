import { Text } from '@react-three/drei'
import { useState } from 'react'
import { DriveLane } from './DriveLane'

export type DriveInRackProps = { column: number; side: 'left' | 'right'; z: number }
export function DriveInRack({ column, side, z }: DriveInRackProps) {
  const [highlighted, setHighlighted] = useState(false)
  const x = side === 'left' ? -2.35 : 2.35
  return <group onPointerOver={(event) => { event.stopPropagation(); setHighlighted(true) }} onPointerOut={() => setHighlighted(false)} onClick={(event) => { event.stopPropagation(); console.log(`FROST WMS Digital Twin — Rack Column ${column}`) }}>
    <DriveLane column={column} side={side} z={z} highlighted={highlighted} />
    <Text position={[x, 0.35, z + 1.55]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.48} color={highlighted ? '#38bdf8' : '#0f172a'} anchorX="center" anchorY="middle">{column}</Text>
  </group>
}
