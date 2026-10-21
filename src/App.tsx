import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import { useStore } from './store'
import { SceneObjects } from './components/SceneObjects'
import { Sidebar } from './components/Sidebar'
import { GroundPlane } from './components/GroundPlane'
import { DrawingPreview } from './components/DrawingPreview'

export default function App() {
  const role = useStore(s => s.role)

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Sidebar />

      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas
          shadows
          camera={{ position: [12, 14, 12], fov: 45 }}
          style={{ background: '#0f0f13' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.45} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1.1}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <Environment preset="city" />

            <Grid
              args={[40, 40]}
              cellSize={1.5}
              cellThickness={0.6}
              cellColor="#2a2a3a"
              sectionSize={7.5}
              sectionThickness={1.2}
              sectionColor="#3d3d55"
              fadeDistance={45}
              infiniteGrid
            />

            <GroundPlane />
            <SceneObjects />
            <DrawingPreview />

            <OrbitControls
              makeDefault
              maxPolarAngle={Math.PI / 2.05}
              minDistance={3}
              maxDistance={60}
            />
          </Suspense>
        </Canvas>

        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: 'rgba(20,20,30,0.85)',
          padding: '6px 12px',
          borderRadius: 8,
          fontSize: 13,
          border: '1px solid #2e2e3e'
        }}>
          Modo: <strong style={{ color: role === 'gm' ? '#7c5cff' : '#3dd68c' }}>
            {role === 'gm' ? 'Game Master' : 'Jugador'}
          </strong>
        </div>
      </div>
    </div>
  )
}
