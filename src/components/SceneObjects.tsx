import { useStore } from '../store'
import { Token } from './Token'
import { Wall } from './Wall'
import type { SceneObject } from '../types'

export function SceneObjects() {
  const objects = useStore(s => s.objects)
  const role = useStore(s => s.role)
  const fogEnabled = useStore(s => s.fogEnabled)
  const playerId = useStore(s => s.playerId)

  // Simple fog of war: players only see objects that are visibleToPlayers
  // and (if fog is on) roughly within vision of their tokens.
  // Full LoS with walls is planned for next iteration.

  const myTokens = objects.filter(
    o => o.type === 'token' && (o as any).ownerId === playerId
  ) as any[]

  const isVisibleToPlayer = (obj: SceneObject) => {
    if (role === 'gm') return true
    if (!obj.visibleToPlayers) return false

    if (!fogEnabled) return true

    // If the player has no tokens, show nothing extra
    if (myTokens.length === 0) return false

    // Simple distance check (placeholder for real LoS)
    for (const token of myTokens) {
      const dx = obj.position[0] - token.position[0]
      const dz = obj.position[2] - token.position[2]
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist <= (token.visionRadius || 6)) return true
    }
    return false
  }

  return (
    <>
      {objects.map(obj => {
        if (!isVisibleToPlayer(obj)) return null

        if (obj.type === 'token') {
          return <Token key={obj.id} object={obj as any} />
        }
        if (obj.type === 'wall') {
          return <Wall key={obj.id} object={obj as any} />
        }
        // door / trap / prop can be added similarly
        return null
      })}
    </>
  )
}
