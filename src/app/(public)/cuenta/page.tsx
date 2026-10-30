'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { useOrders } from '@/hooks/useOrders'
import { useSession } from '@/hooks/useSession'
import { logout } from '@/lib/auth/store'
import { formatMoney } from '@/lib/menu/products'
import { STATUS_LABELS } from '@/lib/orders/types'

export default function AccountPage() {
  const session = useSession()
  const orders = useOrders()
  const router = useRouter()

  if (!session) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-panel bg-paper text-tomato shadow-soft">
          <Icon name="users" size={30} />
        </span>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-ink">
          Mi cuenta
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          Entra o crea tu cuenta para guardar tus datos y ver tus pedidos.
        </p>
        <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
          <ButtonLink href="/entrar" size="lg">
            Iniciar sesión
          </ButtonLink>
          <ButtonLink href="/registro" variant="secondary" size="lg">
            Crear cuenta
          </ButtonLink>
        </div>
      </main>
    )
  }

  const myOrders = orders.filter(
    (order) => !order.isDemo && order.customerEmail === session.email,
  )
  const totalSpent = myOrders.reduce((sum, order) => sum + order.totalCents, 0)

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
            Mi cuenta
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Hola, {session.name.split(' ')[0]}.
          </h1>
          <p className="mt-2 text-sm text-muted">
            {session.role === 'customer' ? 'Cliente PizzaFlow' : 'Cuenta del equipo'}
          </p>
        </div>
        <div className="flex gap-2">
          {session.role !== 'customer' && (
            <ButtonLink href="/interno" variant="secondary" size="md">
              Abrir panel interno
            </ButtonLink>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-line bg-paper px-4 text-sm font-medium text-ink hover:bg-cream"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="h-fit rounded-panel border border-line bg-paper p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tomato/10 text-lg font-semibold text-tomato">
              {session.name.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <h2 className="text-sm font-semibold">{session.name}</h2>
              <p className="text-xs text-muted">{session.email}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Teléfono</dt>
              <dd className="font-medium">{session.phone || '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Pedidos</dt>
              <dd className="tabular font-medium">{myOrders.length}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Total gastado</dt>
              <dd className="tabular font-medium">{formatMoney(totalSpent)}</dd>
            </div>
          </dl>
          <Link
            href="/pedido"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-tomato hover:underline"
          >
            Ver todos mis pedidos
            <Icon name="arrow-right" size={15} />
          </Link>
        </section>

        <section className="rounded-panel border border-line bg-paper p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Últimos pedidos</h2>
            <Link href="/menu" className="text-xs font-medium text-tomato hover:underline">
              Pedir de nuevo
            </Link>
          </div>
          {myOrders.length === 0 ? (
            <div className="mt-5 rounded-card border border-dashed border-line p-8 text-center">
              <p className="text-sm font-medium">Aún no tienes pedidos.</p>
              <p className="mt-1 text-xs text-muted">
                Cuando pidas, aparecerán aquí con su folio y estado.
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {myOrders.slice(0, 6).map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/order/${order.id}`}
                    className="flex items-center gap-3 py-3 hover:bg-cream/60"
                  >
                    <span className="tabular flex h-9 w-14 shrink-0 items-center justify-center rounded-[8px] bg-cream text-xs font-semibold">
                      #{order.orderNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{STATUS_LABELS[order.status]}</div>
                      <div className="text-xs text-muted">
                        {new Date(order.createdAt).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        · {order.items.length} partidas
                      </div>
                    </div>
                    <span className="tabular text-sm font-semibold">
                      {formatMoney(order.totalCents)}
                    </span>
                    <Icon name="chevron-right" size={15} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
