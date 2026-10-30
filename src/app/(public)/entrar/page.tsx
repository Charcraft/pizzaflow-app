'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useSession } from '@/hooks/useSession'
import { login } from '@/lib/auth/store'

export default function CustomerLoginPage() {
  const router = useRouter()
  const session = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    const params = new URLSearchParams(window.location.search)
    const next = params.get('next')
    const destination = next && next.startsWith('/') && !next.startsWith('//') ? next : '/menu'
    router.replace(destination)
  }

  if (session) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-panel bg-tomato text-white shadow-soft">
          <Icon name="check" size={30} />
        </span>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-ink">
          Ya estás dentro, {session.name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Puedes seguir con tu pedido o revisar tu cuenta.
        </p>
        <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
          <Link
            href="/menu"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-tomato text-sm font-medium text-white hover:bg-tomato-deep"
          >
            Ir al menú
            <Icon name="arrow-right" size={16} />
          </Link>
          <Link
            href="/cuenta"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-line bg-paper text-sm font-medium text-ink hover:bg-cream"
          >
            Mi cuenta
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <div className="grid gap-8 overflow-hidden rounded-panel border border-line bg-paper shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden flex-col justify-between bg-tomato p-8 text-white lg:flex">
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_20%_20%,#FFB703_0,transparent_35%),radial-gradient(circle_at_80%_70%,#FFB703_0,transparent_30%)]" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
              Cuenta PizzaFlow
            </span>
            <h2 className="mt-6 font-display text-4xl leading-tight tracking-tight">
              Tu pizza favorita, a un clic.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
              Guarda tus datos, aplica promociones y revisa tus pedidos sin volver
              a escribir todo.
            </p>
          </div>
          <ul className="relative space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-[#FFD166]" />
              Checkout más rápido
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-[#FFD166]" />
              Historial de pedidos
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-[#FFD166]" />
              Promociones exclusivas
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
            Iniciar sesión
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink">
            Entra a tu cuenta.
          </h1>
          <p className="mt-2 text-sm text-muted">
            ¿Primera vez?{' '}
            <Link href="/registro" className="font-medium text-tomato hover:underline">
              Crea tu cuenta gratis
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="customer-email">
                Correo
              </label>
              <input
                id="customer-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-[10px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="customer-password">
                Contraseña
              </label>
              <input
                id="customer-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-[10px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-card border border-tomato/30 bg-tomato/5 p-3 text-sm text-tomato">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-tomato text-sm font-medium text-white hover:bg-tomato-deep disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar y pedir'}
              {!loading && <Icon name="arrow-right" size={16} />}
            </button>
          </form>

          <p className="mt-6 text-xs text-muted">
            ¿Eres del equipo?{' '}
            <Link href="/login" className="font-medium text-ink hover:text-tomato">
              Acceso interno
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
