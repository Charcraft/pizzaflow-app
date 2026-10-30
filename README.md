# PizzaFlow

Sistema integral para una pizzería pequeña con venta en mostrador y pedidos web para recoger en local (sin delivery).

**Equipo:** Grupo 4-C · UPChiapas · Análisis y Diseño de Software · 2026  
**Docente:** Rocío Crystal Hernández Camacho  
**Integrantes:**  
- 253390 González Pérez Santos Enoch – Scrum Master  
- 253425 Nucamendi Ruiz Leonardo – Product Owner  
- 253432 Martínez Pineda Carlos de Jesús – Desarrollo Fullstack  
- 253580 Alarcón Valencia Carlos Adrián – Desarrollo Fullstack  

**Despliegue:** https://pizzaflow-app-charcraftycarlos-3119s-projects.vercel.app  
**Repositorio privado:** https://github.com/Charcraft/pizzaflow-app-private  

**Cuenta admin demo:**  
Email: pinedadeidad@67.com  
Contraseña: `alarconesgay`  
Rol: admin  
*Solo para pruebas locales. En producción usar Supabase Auth.*

## Módulos

| Ruta | Módulo | Descripción |
|------|--------|-------------|
| `/` | Landing | Presentación y acceso a los módulos |
| `/menu` | Catálogo | Pizzas con variantes |
| `/product/[id]` | Personalización | Tamaño, extras y precio en vivo |
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
npm run test:operacion  # flujo mostrador -> cocina -> dashboard
npm run deliverable  # genera el PDF de entrega con las evidencias
```

## Base de datos

```bash
supabase start
supabase db reset
supabase gen types typescript --local > src/types/database.ts
```

Migraciones:

- `supabase/migrations/001_init_schema.sql`: tablas base
- `supabase/migrations/002_full_schema.sql`: roles, mesas, recetas, inventario, etc.

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