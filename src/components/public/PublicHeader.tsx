'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useSession } from '@/hooks/useSession'
import { logout } from '@/lib/auth/store'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { LogoMark } from '@/components/ui/LogoMark'

const LINKS = [
  { href: '/menu', label: 'Menú' },
  { href: '/#como-funciona', label: 'Cómo funciona' },
  { href: '/pedido', label: 'Mi pedido' },
]

export function PublicHeader() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const session = useSession()
  const [open, setOpen] = useState(false)

  return (
    <header className="relative sticky top-0 z-40 border-b border-line/80 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="PizzaFlow, inicio">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight text-ink">PizzaFlow</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[10px] px-3 py-2 text-sm transition-colors ${
                  active ? 'bg-ink/5 font-medium text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={session ? '/cuenta' : '/entrar'}
            aria-label={session ? `Mi cuenta, ${session.name}` : 'Entrar o crear cuenta'}
            className="relative flex h-10 w-10 items-center justify-center rounded-[9px] text-ink ring-1 ring-line hover:bg-paper sm:h-11 sm:w-11 lg:hidden"
          >
            <Icon name="users" size={20} />
            {session && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-tomato" aria-hidden />
            )}
          </Link>
          <Link
            href={session ? '/cuenta' : '/entrar'}
            aria-label={session ? `Mi cuenta, ${session.name}` : 'Entrar o crear cuenta'}
            className="hidden items-center gap-1.5 rounded-[9px] px-2.5 py-1.5 text-xs text-muted hover:text-ink lg:flex"
          >
            <Icon name="users" size={16} />
            <span>{session ? session.name.split(' ')[0] : 'Entrar'}</span>
          </Link>
          <Link
            href="/cart"
            className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[9px] text-ink ring-1 ring-line hover:bg-paper"
            aria-label={`Carrito, ${totalItems} productos`}
          >
            <Icon name="bag" size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-tomato px-1 text-[11px] font-semibold text-white tabular">
                {totalItems}
              </span>
            )}
          </Link>
          <div className="hidden lg:block">
            <ButtonLink href="/menu" size="md">
              Pedir ahora
              <Icon name="arrow-right" size={16} />
            </ButtonLink>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] text-ink ring-1 ring-line hover:bg-paper lg:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform duration-200 ease-in-out ${
                  open ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-5 bg-ink transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-5 bg-ink transition-transform duration-200 ease-in-out ${
                  open ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        inert={!open}
        className={`absolute left-0 top-16 z-40 w-full border-t border-line bg-cream shadow-lg transition-all duration-250 ease-out lg:hidden ${
          open ? 'translate-y-0 opacity-100 max-h-[80vh] overflow-y-auto' : '-translate-y-2 opacity-0 pointer-events-none max-h-0'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3 space-y-1" aria-label="Navegación móvil">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex h-14 items-center rounded-[12px] px-4 text-[15px] font-medium text-ink hover:bg-paper active:bg-paper"
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/cuenta"
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center gap-2 rounded-[12px] border border-line bg-paper text-[15px] font-medium text-ink hover:bg-cream"
              >
                <Icon name="users" size={17} />
                {session.name.split(' ')[0]}
              </Link>
              <button
                type="button"
                onClick={() => { setOpen(false); logout() }}
                className="flex h-14 items-center justify-center gap-2 rounded-[12px] border border-line bg-paper text-[15px] font-medium text-ink hover:bg-cream"
              >
                <Icon name="log-out" size={17} />
                Salir
              </button>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/entrar"
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center gap-2 rounded-[12px] border border-line bg-paper text-[15px] font-medium text-ink hover:bg-cream"
              >
                <Icon name="users" size={17} />
                Entrar
              </Link>
              <Link
                href="/registro"
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center gap-2 rounded-[12px] border border-line bg-paper text-[15px] font-medium text-ink hover:bg-cream"
              >
                <Icon name="user-plus" size={17} />
                Crear cuenta
              </Link>
            </div>
          )}
          <Link
            href="/menu"
            onClick={() => setOpen(false)}
            className="mt-2 flex h-14 items-center justify-center gap-2.5 rounded-[12px] bg-tomato text-[15px] font-semibold text-white shadow-sm"
          >
            Pedir ahora
            <Icon name="arrow-right" size={16} />
          </Link>
        </nav>
      </div>
    </header>
  )
}
