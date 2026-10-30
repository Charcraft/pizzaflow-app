'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { LogoMark } from '@/components/ui/LogoMark'
import { useSession } from '@/hooks/useSession'
import { login } from '@/lib/auth/store'

export default function LoginPage() {
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
    router.replace(next && next.startsWith('/interno') ? next : '/interno')
  }

  return (
    <main className="min-h-screen bg-cream lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden flex-col justify-between bg-night p-10 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <div>
            <div className="text-sm font-semibold">PizzaFlow</div>
            <div className="text-[11px] text-white/50">Operación</div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
            Acceso del equipo
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight">
            El turno empieza aquí.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
            POS, comandas de cocina, cronómetro de horno y métricas del día en un
            solo lugar. El sitio público queda separado para tus clientes.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2.5">
              <Icon name="store" size={16} className="text-[#FDBA74]" />
              Cobra en mostrador
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="flame" size={16} className="text-[#FDBA74]" />
              Controla el horno
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="chart" size={16} className="text-[#FDBA74]" />
              Revisa el turno
            </li>
          </ul>
        </div>

        <p className="text-xs text-white/40">Grupo 4-C · UPChiapas · 2026</p>
      </section>

      <section className="flex min-h-screen items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 lg:hidden">
            <LogoMark />
            <div>
              <div className="text-sm font-semibold">PizzaFlow</div>
              <div className="text-[11px] text-muted">Operación</div>
            </div>
          </div>

          <div className="mt-8 rounded-panel border border-line bg-paper p-7 shadow-soft lg:mt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
              Iniciar sesión
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Acceso del equipo</h1>
            <p className="mt-1.5 text-sm text-muted">
              Ingresa con la cuenta del administrador.
            </p>

            {session && (
              <div className="mt-4 rounded-card border border-basil/30 bg-basil/5 p-3 text-sm text-basil">
                Ya hay una sesión activa como {session.name}.
                <Link href="/interno" className="ml-1 font-medium underline">
                  Continuar al panel
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="login-email">
                  Correo
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-[10px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                  placeholder="correo@dominio.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="login-password">
                  Contraseña
                </label>
                <input
                  id="login-password"
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
                {loading ? 'Verificando...' : 'Entrar al panel'}
                {!loading && <Icon name="arrow-right" size={16} />}
              </button>
            </form>

            <Link
              href="/"
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-line text-sm text-ink hover:bg-cream"
            >
              <Icon name="arrow-left" size={15} />
              Volver al sitio público
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-muted">
            Acceso exclusivo del personal de la pizzería.
          </p>
        </div>
      </section>
    </main>
  )
}
