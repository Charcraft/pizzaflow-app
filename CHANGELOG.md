# Changelog

## [0.1.0] - 2026-10-29

### Agregado
- Inicialización de Next.js 14 con App Router, TypeScript y Tailwind CSS
- Estructura base de Supabase cliente (browser, server, admin)
- Migración SQL inicial con schema completo (profiles, products, orders, order_items, etc.)
- Tipos TypeScript base para database
- Landing page base con branding PizzaFlow
- Rutas: /menu, /cart, /checkout, /mostrador, /cocina, /dashboard
- Componente ProductCard reutilizable
- Hook useCart con persistencia localStorage
- Pistas de documentación en estructura docs/

### Contribuciones
| Integrante | Rol | Archivos | Funcionalidad |
|------------|-----|----------|---------------|
| Carlos de Jesús Martínez Pineda | Desarrollo Fullstack | `app/`, `supabase/migrations/001_init_schema.sql`, `src/lib/supabase/*` | Setup inicial Next.js + Supabase, schema DB, rutas base |
