import { useStore } from '../store'
import { ThreeEvent } from '@react-three/fiber'

export function GroundPlane() {
  const activeTool = useStore(s => s.activeTool)
  const isDrawing = useStore(s => s.isDrawing)
  const startDrawing = useStore(s => s.startDrawing)
  const finishDrawing = useStore(s => s.finishDrawing)
  const addToken = useStore(s => s.addToken)
  const role = useStore(s => s.role)

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (role !== 'gm') return
    e.stopPropagation()

    const point: [number, number] = [e.point.x, e.point.z]

    if (activeTool === 'wall' || activeTool === 'door' || activeTool === 'trap') {
      if (!isDrawing) {
        startDrawing(point)
      }
    }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (role !== 'gm') return
    e.stopPropagation()

    const point: [number, number] = [e.point.x, e.point.z]

    if (isDrawing) {
      finishDrawing(point)
    }
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (role !== 'gm') return
    e.stopPropagation()

    if (activeTool === 'token') {
      const pos: [number, number, number] = [
        Math.round(e.point.x / 1.5) * 1.5,
        0.1,
        Math.round(e.point.z / 1.5) * 1.5
      ]
      addToken(pos)
    }
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      receiveShadow
    >
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#16161f" transparent opacity={0.3} />
    </mesh>
  )
}
