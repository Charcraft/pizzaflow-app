'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { LogoMark } from '@/components/ui/LogoMark'

const NAV: Array<{ href: string; label: string; icon: IconName; hint: string }> = [
  { href: '/interno', label: 'Resumen', icon: 'home', hint: 'Estado del turno' },
  { href: '/interno/mostrador', label: 'Mostrador', icon: 'store', hint: 'POS y cobro' },
  { href: '/interno/cocina', label: 'Cocina', icon: 'flame', hint: 'KDS y horno' },
  { href: '/interno/dashboard', label: 'Dashboard', icon: 'chart', hint: 'Métricas' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/interno') return pathname === '/interno'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function InternalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#F3F0EA] text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-night text-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 px-6">
          <LogoMark />
          <div>
            <div className="text-sm font-semibold leading-tight">PizzaFlow</div>
            <div className="text-[11px] text-white/50">Operación</div>
          </div>
        </div>

        <div className="mx-4 mt-2 rounded-[10px] border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-basil" />
            Turno en vivo
          </div>
          <div className="mt-1 text-xs text-white/70">Cocina conectada</div>
        </div>

        <nav className="mt-6 flex-1 space-y-1 px-3" aria-label="Navegación interna">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-white text-night'
                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon name={item.icon} size={18} />
                <span className="flex-1">
                  <span className="block font-medium leading-tight">{item.label}</span>
                  <span
                    className={`block text-[11px] ${
                      active ? 'text-muted' : 'text-white/40'
                    }`}
                  >
                    {item.hint}
                  </span>
                </span>
                <Icon
                  name="chevron-right"
                  size={14}
                  className={active ? 'text-muted' : 'text-white/25'}
                />
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white"
          >
            <Icon name="arrow-left" size={16} />
            Ver sitio público
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-[#F3F0EA]/90 backdrop-blur lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/interno" className="flex items-center gap-2">
              <LogoMark size={32} />
              <span className="text-sm font-semibold">PizzaFlow · Operación</span>
            </Link>
            <Link href="/" className="text-xs text-muted hover:text-ink">
              Sitio público
            </Link>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-3 pb-2"
            aria-label="Navegación interna móvil"
          >
            {NAV.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-1.5 rounded-[9px] px-3 py-2 text-xs font-medium ${
                    active ? 'bg-night text-white' : 'bg-white text-ink ring-1 ring-line'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={14} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </header>

        <div>{children}</div>
      </div>
    </div>
  )
}
