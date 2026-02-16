# Prueba tecnica — Conectar tarjetas entre columnas

App React + TypeScript que permite crear grupos y tarjetas en dos columnas, y conectarlas visualmente con lineas SVG.

## Ejecutar

```bash
npm install
npm start
```

## Decisiones tecnicas y por que

### Prop drilling en lugar de Context/Redux

La app tiene 4 niveles de componentes: `App > Columna > Grupo > Tarjeta`. Con tan pocos niveles, prop drilling es la solucion mas directa y facil de seguir. Context o Redux anadirían indirección sin resolver un problema real — no hay props que se pasen "de paso" sin usarse, ni multiples consumidores lejanos del mismo estado. Si la app creciera (mas niveles, mas estado compartido), migraria a Context o a una libreria de estado.

### IDs string con crypto.randomUUID()

Los IDs numericos con `Date.now() + counter` tienen riesgo de colision en operaciones rapidas y no son semanticamente identificadores. `crypto.randomUUID()` genera UUIDs v4 criptograficamente unicos, disponible en todos los navegadores modernos. Los datos iniciales usan IDs legibles (`'col-1'`, `'card-1001'`) para facilitar debugging.

### Refs sincronicas para estabilizar callbacks

`handleCardClick` necesita leer `selectedCard` y `connections`, pero si los incluyera como dependencias del `useCallback`, se recrearía en cada cambio, provocando re-renders en cascada por toda la jerarquia. La solucion: refs (`selectedCardRef`, `connectionsRef`) que se asignan en el cuerpo del componente (sincronicamente, antes del render). El callback mantiene dependencias `[]` y lee valores frescos via la ref. Es un patron documentado en la comunidad React; la alternativa seria `useRef` + `useEffect` para sincronizar, pero la asignacion directa en el body es mas simple y equivalente en este caso.

### Scroll con capture phase

Los eventos `scroll` no burbujean en el DOM. Cuando una columna (con `overflow-y: auto`) hace scroll, ese evento solo se dispara en ella, no llega a `window` por bubbling. Usar `addEventListener('scroll', handler, true)` con capture phase permite que un unico listener en `window` intercepte el scroll de cualquier elemento de la pagina. Esto elimina la necesidad de buscar elementos `.columna` con `querySelectorAll` o pasar callbacks `onScroll` manualmente.

### Hook useInlineEdit

Grupo y Tarjeta comparten el mismo patron de edicion inline (doble click, input, Enter/Escape/blur). En lugar de duplicar el estado y los handlers, se extrajo a un hook que recibe el nombre actual y un callback de confirmacion. Esto no es una abstraccion prematura — el patron ya estaba duplicado en dos componentes.

### Inmutabilidad del estado

Toda modificacion de `columns`, `connections` o `selectedCard` crea nuevos objetos con spread. Esto permite que React detecte cambios por referencia (`===`), que es la base de su sistema de reconciliacion. Mutar directamente el estado no dispararía re-renders.

## Estructura

```
src/
  types.ts              — Interfaces del modelo de datos
  App.tsx               — Estado central + handlers
  hooks/
    useInlineEdit.ts    — Hook de edicion inline compartido
  components/
    Columna.tsx/.css    — Contenedor de grupos
    Grupo.tsx/.css      — Contenedor de tarjetas con titulo editable
    Tarjeta.tsx/.css    — Tarjeta individual seleccionable
    Lineas.tsx          — Overlay SVG que dibuja conexiones
```
