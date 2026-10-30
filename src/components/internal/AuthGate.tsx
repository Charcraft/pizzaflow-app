'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useSession } from '@/hooks/useSession'
import { LogoMark } from '@/components/ui/LogoMark'
import { Icon } from '@/components/ui/Icon'

export function AuthGate({ children }: { children: ReactNode }) {
  const session = useSession()
  const pathname = usePathname()

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F0EA] p-5">
        <div className="w-full max-w-md rounded-panel border border-line bg-paper p-7 shadow-soft">
          <div className="flex items-center gap-3">
            <LogoMark size={40} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                PizzaFlow · Operación
              </p>
              <h1 className="text-xl font-semibold tracking-tight">Acceso al equipo</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Esta área es solo para el personal. Inicia sesión para abrir el POS, la
            cocina y el dashboard.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-tomato text-sm font-medium text-white hover:bg-tomato-deep"
          >
            <Icon name="users" size={17} />
            Iniciar sesión
          </Link>
          <Link
            href="/"
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-line text-sm text-ink hover:bg-cream"
          >
            <Icon name="arrow-left" size={15} />
            Volver al sitio público
          </Link>
        </div>
      </div>
    )
  }

  if (session.role === 'customer') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F0EA] p-5">
        <div className="w-full max-w-md rounded-panel border border-line bg-paper p-7 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tomato/10 text-tomato">
            <Icon name="users" size={26} />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Área del equipo</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Tu cuenta es de cliente. Para pedir, vuelve al menú; para operar el
            negocio, entra con una cuenta del personal.
          </p>
          <Link
            href="/menu"
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-tomato text-sm font-medium text-white hover:bg-tomato-deep"
          >
            Ir al menú
          </Link>
          <Link
            href="/cuenta"
            className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-line text-sm text-ink hover:bg-cream"
          >
            Mi cuenta
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
