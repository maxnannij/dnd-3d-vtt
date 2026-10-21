export type Role = 'gm' | 'player'

export type ObjectType = 'token' | 'wall' | 'door' | 'trap' | 'prop'

export interface BaseObject {
  id: string
  type: ObjectType
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  visibleToPlayers: boolean
  interactableByPlayers: boolean
  ownerId?: string | null // player id that can control this token
  color?: string
  visionRadius?: number // only for tokens
}

export interface WallObject extends BaseObject {
  type: 'wall'
  height: number
  thickness: number
  points: [number, number][] // 2D points on the ground (x,z)
}

export interface DoorObject extends BaseObject {
  type: 'door'
  isOpen: boolean
  height: number
  width: number
}

export interface TrapObject extends BaseObject {
  type: 'trap'
  triggered: boolean
  radius: number
}

export interface TokenObject extends BaseObject {
  type: 'token'
  visionRadius: number
  modelUrl?: string
}

export interface PropObject extends BaseObject {
  type: 'prop'
  modelUrl?: string
}

export type SceneObject = WallObject | DoorObject | TrapObject | TokenObject | PropObject

export interface Player {
  id: string
  name: string
  role: Role
  color: string
}

export interface SceneState {
  objects: SceneObject[]
  gridSize: number
  fogEnabled: boolean
  sharedVision: boolean
}
