import { useStore } from '../store'
import { useThree } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import * as THREE from 'three'

export function DrawingPreview() {
  const isDrawing = useStore(s => s.isDrawing)
  const drawStart = useStore(s => s.drawStart)
  const activeTool = useStore(s => s.activeTool)
  const { camera, gl } = useThree()
  const [current, setCurrent] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!isDrawing) {
      setCurrent(null)
      return
    }

    const onMove = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const target = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, target)

      if (target) {
        setCurrent([target.x, target.z])
      }
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [isDrawing, camera, gl])

  if (!isDrawing || !drawStart || !current || activeTool !== 'wall') return null

  const midX = (drawStart[0] + current[0]) / 2
  const midZ = (drawStart[1] + current[1]) / 2
  const dx = current[0] - drawStart[0]
  const dz = current[1] - drawStart[1]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)

  return (
    <mesh position={[midX, 1.25, midZ]} rotation={[0, angle, 0]}>
      <boxGeometry args={[0.25, 2.5, length]} />
      <meshStandardMaterial color="#7c5cff" transparent opacity={0.55} />
    </mesh>
  )
}
