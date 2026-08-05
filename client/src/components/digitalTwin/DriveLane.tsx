import { Pallet } from './Pallet'

type DriveLaneProps = { column: number; side: 'left' | 'right'; z: number; highlighted: boolean }
const levels = Array.from({ length: 7 }, (_, index) => index)
const depths = Array.from({ length: 4 }, (_, index) => index)
const uprightFrames = Array.from({ length: 5 }, (_, index) => index)

export function DriveLane({ column, side, z, highlighted }: DriveLaneProps) {
  const direction = side === 'left' ? -1 : 1
  const laneCenterX = direction * 6.7
  const uprightColor = highlighted ? '#38bdf8' : '#1d4ed8'
  return <group>
    {uprightFrames.map((frame) => [-0.6, 0.6].map((offset) => <mesh key={`${frame}-${offset}`} position={[direction * (4.5 + frame * 1.1), 7.4, z + offset]} castShadow><boxGeometry args={[0.16, 14.8, 0.16]} /><meshStandardMaterial color={uprightColor} metalness={0.15} roughness={0.58} /></mesh>))}
    {levels.map((level) => <group key={level}>{[z - 0.6, z + 0.6].map((railZ) => <mesh key={railZ} position={[laneCenterX, 1.15 + level * 1.85, railZ]} castShadow><boxGeometry args={[4.5, 0.16, 0.12]} /><meshStandardMaterial color="#f97316" metalness={0.1} roughness={0.55} /></mesh>)}{depths.map((depth) => { const x = direction * (5.0 + depth * 1.1); return <group key={depth}><mesh position={[x, 1.05 + level * 1.85, z]} castShadow><boxGeometry args={[0.1, 0.12, 1.28]} /><meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.55} /></mesh><Pallet column={column} side={side} level={level} depth={depth} position={[x, 1.25 + level * 1.85, z]} /></group> })}</group>)}
    {depths.map((depth) => <mesh key={depth} position={[direction * (5.0 + depth * 1.1), 0.09, z + 0.78]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.3]} /><meshBasicMaterial color="#64748b" /></mesh>)}
  </group>
}
