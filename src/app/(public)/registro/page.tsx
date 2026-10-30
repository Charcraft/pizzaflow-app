'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useSession } from '@/hooks/useSession'
import { register } from '@/lib/auth/store'

export default function RegisterPage() {
  const router = useRouter()
  const session = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (!accepted) {
      setError('Acepta los términos para crear tu cuenta.')
      return
    }

    setLoading(true)
    const result = await register({ name, email, phone, password })
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
        <span className="flex h-16 w-16 items-center justify-center rounded-panel bg-basil text-white shadow-soft">
          <Icon name="check" size={30} />
        </span>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-ink">
          Tu cuenta ya está lista
        </h1>
        <p className="mt-2 text-sm text-muted">Sigue con tu pedido o revisa tu perfil.</p>
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
        <div className="relative hidden flex-col justify-between bg-night p-8 text-white lg:flex">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#FFB703_0,transparent_35%),radial-gradient(circle_at_80%_70%,#E11D2E_0,transparent_30%)]" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
              Primera compra
            </span>
            <h2 className="mt-6 font-display text-4xl leading-tight tracking-tight">
              10% off en tu primer pedido.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
              Crea tu cuenta y el código <span className="font-mono text-[#FFD166]">BIENVENIDO10</span>{' '}
              se aplica en el carrito.
            </p>
          </div>
          <ul className="relative space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-[#FFD166]" />
              Pedido guardado con tu nombre
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-[#FFD166]" />
              Historial en “Mi pedido”
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-[#FFD166]" />
              Promos y combos
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
            Crear cuenta
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink">
            Pide en menos de un minuto.
          </h1>
          <p className="mt-2 text-sm text-muted">
            ¿Ya tienes cuenta?{' '}
            <Link href="/entrar" className="font-medium text-tomato hover:underline">
              Inicia sesión
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="reg-name">
                Nombre completo
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 w-full rounded-[10px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                placeholder="María López"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="reg-email">
                  Correo
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-[10px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                  placeholder="tu@correo.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="reg-phone">
                  Teléfono
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-11 w-full rounded-[10px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                  placeholder="961 123 4567"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="reg-password">
                  Contraseña
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-[10px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="reg-confirm">
                  Repetir contraseña
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  className="h-11 w-full rounded-[10px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                  placeholder="Repite tu contraseña"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs leading-5 text-muted">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-tomato"
              />
              Acepto los términos y el uso de mis datos para gestionar el pedido.
            </label>

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
              {loading ? 'Creando cuenta...' : 'Crear cuenta y pedir'}
              {!loading && <Icon name="arrow-right" size={16} />}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
