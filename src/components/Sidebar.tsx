import { useStore } from '../store'

export function Sidebar() {
  const role = useStore(s => s.role)
  const setRole = useStore(s => s.setRole)
  const activeTool = useStore(s => s.activeTool)
  const setActiveTool = useStore(s => s.setActiveTool)
  const objects = useStore(s => s.objects)
  const selectedId = useStore(s => s.selectedId)
  const fogEnabled = useStore(s => s.fogEnabled)
  const setFogEnabled = useStore(s => s.setFogEnabled)
  const removeObject = useStore(s => s.removeObject)
  const setObjectVisibility = useStore(s => s.setObjectVisibility)
  const setObjectInteractable = useStore(s => s.setObjectInteractable)
  const updateObject = useStore(s => s.updateObject)
  const players = useStore(s => s.players)
  const assignTokenToPlayer = useStore(s => s.assignTokenToPlayer)

  const selected = objects.find(o => o.id === selectedId)

  return (
    <div className="panel" style={{ width: 300, padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div className="section-title">Rol</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={role === 'gm' ? '' : 'secondary'}
            onClick={() => setRole('gm')}
            style={{ flex: 1 }}
          >
            GM
          </button>
          <button
            className={role === 'player' ? '' : 'secondary'}
            onClick={() => setRole('player')}
            style={{ flex: 1 }}
          >
            Jugador
          </button>
        </div>
      </div>

      {role === 'gm' && (
        <>
          <div>
            <div className="section-title">Herramientas</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                className={activeTool === 'select' ? '' : 'secondary'}
                onClick={() => setActiveTool('select')}
              >
                Seleccionar
              </button>
              <button
                className={activeTool === 'token' ? '' : 'secondary'}
                onClick={() => setActiveTool('token')}
              >
                + Miniatura
              </button>
              <button
                className={activeTool === 'wall' ? '' : 'secondary'}
                onClick={() => setActiveTool('wall')}
              >
                Pared
              </button>
              <button
                className={activeTool === 'door' ? '' : 'secondary'}
                onClick={() => setActiveTool('door')}
                title="Próximamente"
              >
                Puerta
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
              {activeTool === 'wall' && 'Haz clic y arrastra en el suelo para dibujar una pared.'}
              {activeTool === 'token' && 'Haz clic en el suelo para colocar una miniatura.'}
              {activeTool === 'select' && 'Haz clic en un objeto para seleccionarlo.'}
            </p>
          </div>

          <div>
            <div className="section-title">Niebla de guerra</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <input
                type="checkbox"
                checked={fogEnabled}
                onChange={e => setFogEnabled(e.target.checked)}
              />
              Activada
            </label>
          </div>
        </>
      )}

      <div>
        <div className="section-title">Objetos ({objects.length})</div>
        <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {objects.map(obj => (
            <div
              key={obj.id}
              onClick={() => useStore.getState().selectObject(obj.id)}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                background: selectedId === obj.id ? '#2a2a40' : 'transparent',
                cursor: 'pointer',
                fontSize: 13,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>{obj.name} <small style={{ color: 'var(--muted)' }}>({obj.type})</small></span>
              {!obj.visibleToPlayers && <span style={{ color: 'var(--danger)', fontSize: 11 }}>oculto</span>}
            </div>
          ))}
          {objects.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>No hay objetos aún</div>
          )}
        </div>
      </div>

      {selected && role === 'gm' && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div className="section-title">Propiedades</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <div>
              <label>Nombre</label>
              <input
                value={selected.name}
                onChange={e => updateObject(selected.id, { name: e.target.value })}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={selected.visibleToPlayers}
                onChange={e => setObjectVisibility(selected.id, e.target.checked)}
              />
              Visible para jugadores
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={selected.interactableByPlayers}
                onChange={e => setObjectInteractable(selected.id, e.target.checked)}
              />
              Interactuable por jugadores
            </label>

            {selected.type === 'token' && (
              <>
                <div>
                  <label>Radio de visión</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={(selected as any).visionRadius || 6}
                    onChange={e => updateObject(selected.id, { visionRadius: Number(e.target.value) })}
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </div>

                <div>
                  <label>Asignar a jugador</label>
                  <select
                    value={(selected as any).ownerId || ''}
                    onChange={e => assignTokenToPlayer(selected.id, e.target.value || null)}
                    style={{ width: '100%', marginTop: 4 }}
                  >
                    <option value="">— Ninguno —</option>
                    {players.filter(p => p.role === 'player').map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button className="danger" onClick={() => removeObject(selected.id)}>
              Eliminar
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--muted)' }}>
        MVP · D&D 3D VTT<br />
        Cambia a modo Jugador para probar la niebla de guerra.
      </div>
    </div>
  )
}
