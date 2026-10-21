import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { SceneObject, Role, Player, TokenObject, WallObject } from './types'

interface AppState {
  // session
  role: Role
  playerId: string
  playerName: string
  players: Player[]

  // scene
  objects: SceneObject[]
  fogEnabled: boolean
  sharedVision: boolean
  gridSize: number

  // tools
  activeTool: 'select' | 'wall' | 'door' | 'trap' | 'token'
  selectedId: string | null
  isDrawing: boolean
  drawStart: [number, number] | null

  // actions
  setRole: (role: Role) => void
  setPlayerName: (name: string) => void
  setActiveTool: (tool: AppState['activeTool']) => void
  selectObject: (id: string | null) => void
  addToken: (position: [number, number, number], name?: string) => void
  addWall: (start: [number, number], end: [number, number]) => void
  updateObject: (id: string, partial: Partial<SceneObject>) => void
  removeObject: (id: string) => void
  setFogEnabled: (v: boolean) => void
  setSharedVision: (v: boolean) => void
  setObjectVisibility: (id: string, visible: boolean) => void
  setObjectInteractable: (id: string, interactable: boolean) => void
  assignTokenToPlayer: (tokenId: string, playerId: string | null) => void
  startDrawing: (point: [number, number]) => void
  finishDrawing: (point: [number, number]) => void
  cancelDrawing: () => void
}

const defaultPlayers: Player[] = [
  { id: 'gm-1', name: 'GM', role: 'gm', color: '#7c5cff' },
  { id: 'player-1', name: 'Jugador 1', role: 'player', color: '#3dd68c' },
]

export const useStore = create<AppState>((set, get) => ({
  role: 'gm',
  playerId: 'gm-1',
  playerName: 'GM',
  players: defaultPlayers,

  objects: [],
  fogEnabled: true,
  sharedVision: false,
  gridSize: 1.5,

  activeTool: 'select',
  selectedId: null,
  isDrawing: false,
  drawStart: null,

  setRole: (role) => {
    const player = get().players.find(p => p.role === role) || get().players[0]
    set({ role, playerId: player.id, playerName: player.name })
  },

  setPlayerName: (name) => set({ playerName: name }),

  setActiveTool: (tool) => set({ activeTool: tool, selectedId: null }),

  selectObject: (id) => set({ selectedId: id }),

  addToken: (position, name = 'Token') => {
    const token: TokenObject = {
      id: uuidv4(),
      type: 'token',
      name,
      position,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visibleToPlayers: true,
      interactableByPlayers: true,
      ownerId: null,
      color: '#3dd68c',
      visionRadius: 6,
    }
    set(state => ({ objects: [...state.objects, token] }))
  },

  addWall: (start, end) => {
    const wall: WallObject = {
      id: uuidv4(),
      type: 'wall',
      name: 'Pared',
      position: [(start[0] + end[0]) / 2, 0, (start[1] + end[1]) / 2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visibleToPlayers: true,
      interactableByPlayers: false,
      height: 2.5,
      thickness: 0.25,
      points: [start, end],
    }
    set(state => ({ objects: [...state.objects, wall] }))
  },

  updateObject: (id, partial) => {
    set(state => ({
      objects: state.objects.map(o => (o.id === id ? { ...o, ...partial } as SceneObject : o))
    }))
  },

  removeObject: (id) => {
    set(state => ({
      objects: state.objects.filter(o => o.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId
    }))
  },

  setFogEnabled: (v) => set({ fogEnabled: v }),
  setSharedVision: (v) => set({ sharedVision: v }),

  setObjectVisibility: (id, visible) => {
    get().updateObject(id, { visibleToPlayers: visible })
  },

  setObjectInteractable: (id, interactable) => {
    get().updateObject(id, { interactableByPlayers: interactable })
  },

  assignTokenToPlayer: (tokenId, playerId) => {
    get().updateObject(tokenId, { ownerId: playerId })
  },

  startDrawing: (point) => set({ isDrawing: true, drawStart: point }),

  finishDrawing: (point) => {
    const { isDrawing, drawStart, activeTool, addWall } = get()
    if (!isDrawing || !drawStart) return

    if (activeTool === 'wall') {
      addWall(drawStart, point)
    }
    // TODO: door & trap tools

    set({ isDrawing: false, drawStart: null })
  },

  cancelDrawing: () => set({ isDrawing: false, drawStart: null }),
}))
