import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Vector3 } from 'three'

const target = new Vector3(0, 4.5, -1)
const SIDE_CLEARANCE = 9.2
const REAR_CLEARANCE = -8.2

export function CameraController({ topView = false }: { topView?: boolean }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const keepInsideRoom = () => {
    const control = controls.current
    if (!control) return
    const position = control.object.position
    const nextX = Math.max(-SIDE_CLEARANCE, Math.min(SIDE_CLEARANCE, position.x))
    const nextZ = Math.max(REAR_CLEARANCE, position.z)
    if (nextX !== position.x || nextZ !== position.z) {
      position.set(nextX, position.y, nextZ)
      control.object.lookAt(target)
    }
  }
  return <OrbitControls ref={controls} makeDefault enableDamping={false} enablePan={false} rotateSpeed={0.5} zoomSpeed={0.65} minDistance={2.4} maxDistance={topView ? 32 : 26} minPolarAngle={topView ? 0.01 : 0.12} maxPolarAngle={Math.PI / 2.02} target={target} onChange={keepInsideRoom} />
}
