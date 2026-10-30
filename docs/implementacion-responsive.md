# Implementación de Responsive Design — PizzaFlow

## 1. Principios aplicados
- **Mobile-first**: maquetación base móvil, mejoras progresivas con `sm:`/`lg:`
- **Jerarquía visual**: tamaños tipográficos escalables y espaciado consistente
- **Accesibilidad táctil**: botones ≥44px, contraste AA, foco visible
- **Performance**: sin librerías de gráficos en dashboard, `useMemo` para métricas

## 2. PublicHeader (Navbar)
**Archivo:** `src/components/public/PublicHeader.tsx`

### Cambios
- Header `sticky` con backdrop-blur, padding `px-4 sm:px-6 lg:px-8`
- Nav principal oculto en `<lg>`; botón hamburguesa visible solo `md:hidden`
- Menú móvil con overlay `fixed` bajo el header:
  - Animate con `transform translate-y` + `opacity` + `max-h` para transición suave
  - `h-14` items, `rounded-[12px]`, área táctil 44px+
  - Cierre al seleccionar y focus trap básico
- Hamburguesa animada a X con 3 spans y `transition-transform`
- Carrito con badge, tamaño responsive `h-10 w-10 sm:h-11 sm:w-11`
- Enlace de cuenta oculto hasta `lg`

### Bitácora
| Fecha | Problema | Solución |
|-------|----------|----------|
| 2026-10-30 | Menú sin animación, targets pequeños | Transición CSS, targets 44px, overlay con scroll interno |

## 3. Home público
**Archivo:** `src/app/(public)/page.tsx`

- Banner superior: `flex-col sm:flex-row`, texto `sm:truncate`
- Hero: grid `lg:grid-cols-[1.05fr_0.95fr]`, títulos `text-5xl sm:text-6xl lg:text-7xl`
- CTA: `flex-col gap-3 sm:flex-row`
- Secciones con padding `px-5 sm:px-8` y `py-14 sm:py-20`
- Carruseles responsivos con `PromoCarousel` / `FeaturedCarousel`
- Footer grid `sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]`

## 4. Layout interno
**Archivo:** `src/components/internal/InternalShell.tsx`

- Sidebar fijo `hidden lg:flex w-64`
- Header móvil con nav horizontal scrollable `overflow-x-auto`
- Contenido con `lg:pl-64`
- Tarjetas KDS en grid `md:grid-cols-2 xl:grid-cols-3`

## 5. Páginas operativas
**Mostrador** `src/app/interno/mostrador/page.tsx`
- Layout 2 columnas `lg:grid-cols-[1fr_380px]`
- Catálogo grid `sm:grid-cols-2 xl:grid-cols-3`
- Ticket sticky `lg:sticky lg:top-6`

**Cocina** `src/app/interno/cocina/page.tsx`
- Métricas en grid `grid-cols-2 md:grid-cols-4`
- OrderCard con semáforo y cronómetro de horno

**Dashboard** `src/app/interno/dashboard/page.tsx`
- Cards `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`
- Gráficos con barras CSS, sin librerías externas
- `useMemo` para métricas, hora como string ISO para evitar prerender error

## 6. Validaciones
- `npx tsc --noEmit` sin errores
- `npm run lint` sin errores
- `npm run build` exitoso, 21 rutas generadas

## 7. Evidencias visuales
Capturas de devtools en móvil se guardan en `docs/responsive/capturas/`.

### Recomendaciones futuras
- Añadir `prefers-reduced-motion`
- Implementar `next/image` con `sizes` para hero
- Test en iOS Safari y Android Chrome real
