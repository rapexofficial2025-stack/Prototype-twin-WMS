import { DriveInRack } from './DriveInRack'
import { Evaporator } from './Evaporator'
import { WarehouseFloor } from './WarehouseFloor'
import { WarehouseWalls } from './WarehouseWalls'

// 1.20 m pitch: the right upright of a lane is the left upright of its neighbour.
// The final lane is flush with the rear wall.
const rackRows = Array.from({ length: 15 }, (_, index) => ({ index, z: 7.4 - index * 1.2 }))

export function Room({ wing = 'both' }: { wing?: 'both' | 'left' | 'right' }) {
  return <group><WarehouseFloor /><WarehouseWalls />
    {wing !== 'right' && rackRows.map(({ index, z }) => <DriveInRack key={`left-${index}`} column={index + 1} side="left" z={z} />)}
    {wing !== 'left' && rackRows.map(({ index, z }) => <DriveInRack key={`right-${index}`} column={index + 16} side="right" z={z} />)}
    <Evaporator />
  </group>
}
