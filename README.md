# D&D 3D Virtual Tabletop

Aplicación web de **Virtual Tabletop 3D** para partidas de Dungeons & Dragons y otros TTRPGs.

Similar a Owlbear Rodeo, pero completamente en **3D**.

## Características principales

- **GM tiene control total** sobre la escena, visibilidad e interacción.
- **Jugadores** solo ven e interactúan con lo que el GM permite.
- **Niebla de guerra + Line of Sight** (base implementada).
- **Dibujo rápido** de paredes, puertas y trampas.
- **Carga y almacenamiento** de modelos 3D (miniaturas y props).
- Escena 3D con React Three Fiber + Three.js.
- Preparado para multiplayer con WebRTC (señalización básica incluida).

## Stack técnico

- React 18 + TypeScript
- Vite
- React Three Fiber + Drei + Three.js
- Zustand (estado global)
- PeerJS / WebRTC (multiplayer)
- IndexedDB (almacenamiento local de assets)

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

## Roles

### Game Master
- Ve todo
- Puede dibujar paredes, puertas y trampas
- Controla la niebla de guerra
- Asigna miniaturas a jugadores
- Puede ocultar/mostrar cualquier objeto

### Jugador
- Solo ve lo que está dentro del radio de visión de sus miniaturas
- Solo puede mover las miniaturas que el GM le asignó
- No puede modificar la geometría del mapa

## Estado actual (MVP)

- [x] Escena 3D con grid
- [x] Sistema de roles (GM / Player)
- [x] Panel de control del GM
- [x] Dibujo de paredes (extrusión simple)
- [x] Miniaturas arrastrables
- [x] Base de niebla de guerra (radio de visión)
- [x] Estructura para subir modelos 3D
- [ ] Multiplayer completo en tiempo real (estructura lista)
- [ ] Line of Sight avanzado con paredes bloqueando visión
- [ ] Sistema de puertas abiertas/cerradas afectando visión
- [ ] Biblioteca de assets persistente completa

## Próximos pasos recomendados

1. Completar sincronización WebRTC real.
2. Implementar raycasting de visión real (paredes bloquean).
3. Mejorar herramientas de dibujo (puertas, trampas, polígonos).
4. Integrar carga real de archivos .glb/.gltf.
5. Guardar/cargar sesiones.

## Licencia

MIT — Úsalo libremente para tus partidas.
