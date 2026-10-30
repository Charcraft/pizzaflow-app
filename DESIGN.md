# Design System: PizzaFlow

## Tokens
- Colors: `ink` (text), `cream` (bg), `tomato` (accent), `basil` (accent), `line` (borders), `night` (dark bg).
- Border Radius: `[10px]` (`rounded-[10px]`), `[9px]` (`rounded-[9px]`), `[12px]` (`rounded-[12px]`), `[8px]` (`rounded-[8px]`), `full`.
- Font: (Inherited)

## Anti-patrones
- No hardcoded hex values (use defined Tailwind colors).
- No buttons or touch targets smaller than 44px on mobile.
- No text smaller than 12px for critical info.

## Pendientes de decisión
- Definir comportamiento de transición del menú móvil (¿slide-in o fade?).

## Bitácora de cambios
| ID | Fecha | Problema | Solución | Regla derivada |
|---|---|---|---|---|
| 1 | 2026-10-30 | Navbar móvil sin animación y sin hamburguesa con transición | Animación transform + opacity, menú hamburguesa a X, overlay con slide-in. Tocah targets 44px. | Usar transiciones CSS puras, no extra JS. Estado open controlado con useState. |
