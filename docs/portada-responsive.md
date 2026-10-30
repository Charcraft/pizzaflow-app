# PizzaFlow — Documentación de Responsive Design

**Equipo:** Grupo 4-C - UPChiapas  
**Proyecto:** Pizzeria (PizzaFlow)  
**Fecha:** 30-10-2026  
**Versión:** v0.2.0-responsive

## Integrantes
- Santos Enoch González Pérez — Scrum Master
- Leonardo Nucamendi Ruiz — Product Owner
- Carlos de Jesús Martínez Pineda — Desarrollo Fullstack
- Carlos Adrián Alarcón Valencia — Desarrollo Fullstack

## Objetivo
Garantizar experiencia óptima en móvil, tablet y escritorio para el frente público y operativo (Mostrador / Cocina / Dashboard) con enfoque en accesibilidad táctil, jerarquía visual y rendimiento.

## Alcance documentado
- PublicHeader responsive con menú hamburguesa animado
- Home público (hero, promociones, carruseles, beneficios)
- Footer adaptable
- Layout interno (sidebar colapsable + nav móvil)
- Páginas clave: Menú, Carrito, Checkout, Producto, Orden Tracking

## Convenciones
- Tailwind CSS con tokens definidos en `@theme`
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Touch targets mínimos 44px en móvil
- Sin `new Date()` en prerender; métricas con `useMemo`
