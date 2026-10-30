# Changelog

## [0.2.0] - 2026-10-30

### Agregado
- Flujo web completo: landing, menú por categorías, detalle de producto con
  variantes, extras y mitad/mitad, carrito persistente, checkout y seguimiento
  de pedido con folio y línea de tiempo.
- Módulo de mostrador (POS): catálogo, carrito, datos de cliente y método de
  pago; crea pedidos con folio y los envía a la cola de cocina.
- KDS de cocina: pedidos activos en orden FIFO, semáforo de espera (verde
  <1 min, ámbar 1-2 min, rojo >2 min), cambio de estado y cronómetro de horno
  con aviso a 1:30 y alarma a 2:00.
- Dashboard: pedidos y ventas del día, ticket promedio, tiempo promedio
  pedido→listo, pedidos por estado y top de productos.
- Store de pedidos en `localStorage` como modo demo sin dependencia de Supabase.
- Migración `002_full_schema.sql`: roles, mesas, recetas, inventario, división
  de cuenta, reparto, bitácora, notificaciones y lealtad, con políticas RLS.
- Scripts de verificación: `test:schema` (PGlite) y `test:e2e` (Playwright Core).
- Plantilla `.env.example`.

### Cambiado
- Tailwind CSS 4 configurado con `@tailwindcss/postcss` y `@import "tailwindcss"`.
- `useCart` migrado a store externo con `useSyncExternalStore`.
- Catálogo compartido entre landing, menú, detalle y mostrador.

### Corregido
- Bloque duplicado en `src/types/database.ts` que impedía compilar.
- Dependencia faltante `@supabase/ssr`.
- Estilos sin aplicar por configuración incompleta de Tailwind.
- Prerender de rutas dinámicas con `export const instant = false`.

### Contribuciones

| Integrante | Rol | Archivos | Funcionalidad | Horas estimadas |
|------------|-----|----------|---------------|-----------------|
| Carlos de Jesús Martínez Pineda | Fullstack | `src/app/page.tsx`, `src/app/menu`, `src/app/product`, `src/app/cart`, `src/app/checkout`, `src/app/order`, `src/lib/orders`, `supabase/migrations/002_full_schema.sql` | Flujo web, store de pedidos, schema y RLS | 12 |
| Carlos Adrián Alarcón Valencia | Fullstack | `src/app/mostrador`, `src/app/cocina`, `src/app/dashboard`, `src/components/orders`, `src/hooks/useOvenClock.ts` | POS, KDS, semáforo y cronómetro de horno | 10 |
| Santos Enoch González Pérez | Scrum Master | `scripts/`, `src/app/globals.css`, `src/app/layout.tsx`, `app/package.json` | Integración, verificación de schema, build y estilos | 4 |
| Leonardo Nucamendi Ruiz | Product Owner | `docs/`, `CHANGELOG.md`, `memory.md`, `README.md` | Validación de alcance, pruebas y documentación | 3 |

## [0.1.0] - 2026-10-29

### Agregado
- Inicialización de Next.js 16 con App Router, TypeScript y Tailwind CSS
- Estructura base de Supabase cliente (browser, server, admin)
- Migración SQL inicial con schema base (profiles, products, orders, etc.)
- Tipos TypeScript base para database
- Landing page base con branding PizzaFlow
- Rutas: /menu, /cart, /checkout, /mostrador, /cocina, /dashboard
- Componente ProductCard reutilizable
- Hook useCart con persistencia localStorage
- Estructura docs/

### Contribuciones
| Integrante | Rol | Archivos | Funcionalidad |
|------------|-----|----------|---------------|
| Carlos de Jesús Martínez Pineda | Desarrollo Fullstack | `app/`, `supabase/migrations/001_init_schema.sql`, `src/lib/supabase/*` | Setup inicial Next.js + Supabase, schema DB, rutas base |
