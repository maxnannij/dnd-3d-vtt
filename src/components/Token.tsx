import { useRef } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { useStore } from '../store'
import type { TokenObject } from '../types'
import * as THREE from 'three'

interface Props {
  object: TokenObject
}

export function Token({ object }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const role = useStore(s => s.role)
  const playerId = useStore(s => s.playerId)
  const selectedId = useStore(s => s.selectedId)
  const selectObject = useStore(s => s.selectObject)
  const updateObject = useStore(s => s.updateObject)

  const canControl =
    role === 'gm' ||
    (object.ownerId === playerId && object.interactableByPlayers)

  const isSelected = selectedId === object.id

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    selectObject(object.id)
  }

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!canControl) return
    e.stopPropagation()
    // simple drag will be improved later
  }

  // Very basic drag on pointer move while selected (for MVP)
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!canControl || !isSelected || e.buttons !== 1) return
    e.stopPropagation()

    const newPos: [number, number, number] = [
      Math.round(e.point.x / 1.5) * 1.5,
      0.1,
      Math.round(e.point.z / 1.5) * 1.5
    ]
    updateObject(object.id, { position: newPos })
  }

  return (
    <group position={object.position}>
      {/* base ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.55, 0.7, 32]} />
        <meshBasicMaterial color={isSelected ? '#ffffff' : object.color || '#3dd68c'} />
      </mesh>

      {/* simple cylinder as placeholder mini */}
      <mesh
        ref={meshRef}
        position={[0, 0.6, 0]}
        castShadow
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <cylinderGeometry args={[0.45, 0.5, 1.2, 16]} />
        <meshStandardMaterial color={object.color || '#3dd68c'} />
      </mesh>

      {/* vision radius helper (only GM sees it for now) */}
      {role === 'gm' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[object.visionRadius - 0.05, object.visionRadius, 64]} />
          <meshBasicMaterial color="#7c5cff" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  )
}
