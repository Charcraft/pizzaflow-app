# PizzaFlow

Sistema integral para una pizzería pequeña con venta en mostrador y pedidos web para recoger en local (sin delivery).

**Equipo:** Grupo 4-C · UPChiapas · Análisis y Diseño de Software · 2026

## Módulos

| Ruta | Módulo | Descripción |
|------|--------|-------------|
| `/` | Landing | Presentación y acceso a los módulos |
| `/menu` | Catálogo | Pizzas, bebidas y extras con variantes |
| `/product/[id]` | Personalización | Tamaño, extras, mitad/mitad y precio en vivo |
| `/cart` | Carrito | Persistencia local, cantidades y totales |
| `/checkout` | Checkout | Datos de recogida, pago y creación de pedido |
| `/order/[id]` | Seguimiento | Folio, estado y tiempo estimado |
| `/mostrador` | POS | Alta de pedidos de mostrador |
| `/cocina` | KDS | Comandas FIFO, semáforo y cronómetro de horno |
| `/dashboard` | Métricas | Ventas, ticket promedio, tiempos y top productos |

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL + Auth + Realtime) para la versión conectada
- Vitest no requerido: pruebas de humo con Playwright Core y PGlite

## Modo demo

La aplicación funciona sin Supabase: los pedidos y el carrito se guardan en
`localStorage` mediante `src/lib/orders/store.ts` y `src/hooks/useCart.ts`.
Los pedidos sembrados permiten ver el semáforo de cocina (verde, ámbar y rojo).

## Scripts

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run build        # build de producción
npm run test:schema  # aplica 001 + 002 + seed en Postgres WASM
npm run test:e2e     # flujo menú -> carrito -> checkout -> seguimiento
```

`test:e2e` requiere el servidor de desarrollo activo. Se puede apuntar a otro
puerto con `BASE_URL=http://localhost:3002 npm run test:e2e`.

## Base de datos

```bash
supabase start
supabase db reset
supabase gen types typescript --local > src/types/database.ts
```

Migraciones:

- `supabase/migrations/001_init_schema.sql`: tablas base (perfiles, productos,
  pedidos, items, promociones, analytics y feedback).
- `supabase/migrations/002_full_schema.sql`: roles, mesas, recetas, inventario,
  división de cuenta, reparto, bitácora, notificaciones y lealtad.

Datos de ejemplo: `src/lib/supabase/seed_full.sql`.

## Estructura

```
app/
├── src/app/           # Rutas (landing, menú, mostrador, cocina, dashboard)
├── src/components/    # Componentes reutilizables
├── src/hooks/         # useCart, useOrders, useOvenClock
├── src/lib/orders/    # Tipos y store de pedidos (modo demo)
├── src/lib/menu/      # Catálogo compartido
├── src/lib/supabase/  # Clientes browser/server/admin y seeds
├── src/types/         # Tipos de base de datos
├── scripts/           # Pruebas de humo y verificación de schema
└── supabase/          # Migraciones SQL
```

## Variables de entorno

Copia `.env.example` a `.env.local` y llena los valores de tu proyecto Supabase.
Sin variables configuradas la app sigue funcionando en modo demo.

## Convenciones

- Componentes en PascalCase, un componente por archivo.
- Hooks con prefijo `use`.
- Commits convencionales: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Importes monetarios en centavos (`*_cents`).
