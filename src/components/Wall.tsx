import { useStore } from '../store'
import type { WallObject } from '../types'
import { ThreeEvent } from '@react-three/fiber'

interface Props {
  object: WallObject
}

export function Wall({ object }: Props) {
  const role = useStore(s => s.role)
  const selectedId = useStore(s => s.selectedId)
  const selectObject = useStore(s => s.selectObject)

  const isSelected = selectedId === object.id

  const [start, end] = object.points
  const midX = (start[0] + end[0]) / 2
  const midZ = (start[1] + end[1]) / 2
  const dx = end[0] - start[0]
  const dz = end[1] - start[1]
  const length = Math.sqrt(dx * dx + dz * dz) || 0.1
  const angle = Math.atan2(dx, dz)

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (role !== 'gm') return
    e.stopPropagation()
    selectObject(object.id)
  }

  return (
    <mesh
      position={[midX, object.height / 2, midZ]}
      rotation={[0, angle, 0]}
      castShadow
      receiveShadow
      onClick={handleClick}
    >
      <boxGeometry args={[object.thickness, object.height, length]} />
      <meshStandardMaterial
        color={isSelected ? '#9b82ff' : '#5a5a6e'}
        transparent={!object.visibleToPlayers}
        opacity={object.visibleToPlayers ? 1 : 0.35}
      />
    </mesh>
  )
}
