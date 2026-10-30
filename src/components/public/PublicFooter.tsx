import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { LogoMark } from '@/components/ui/LogoMark'

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-semibold text-ink">PizzaFlow</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            Pizza artesanal de barrio, hecha al momento. Pide en línea y recógela en
            mostrador sin filas.
          </p>
          <p className="mt-5 text-xs text-muted">
            Grupo 4-C · UPChiapas · Análisis y Diseño de Software · 2026
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Horario
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ink">
            <li className="flex justify-between gap-4">
              <span>Lunes a viernes</span>
              <span className="tabular text-muted">13:00 – 22:00</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Sábado y domingo</span>
              <span className="tabular text-muted">12:00 – 23:00</span>
            </li>
            <li className="flex items-start gap-2 pt-2 text-muted">
              <Icon name="map-pin" size={16} className="mt-0.5 shrink-0" />
              <span>Recoger en mostrador · 15-25 min</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Pedido
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/menu" className="text-ink hover:text-tomato">
                Ver menú
              </Link>
            </li>
            <li>
              <Link href="/cart" className="text-ink hover:text-tomato">
                Mi carrito
              </Link>
            </li>
            <li>
              <Link href="/pedido" className="text-ink hover:text-tomato">
                Mis pedidos
              </Link>
            </li>
            <li className="flex items-center gap-2 pt-2 text-muted">
              <Icon name="phone" size={16} />
              <span>961 000 0000</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 PizzaFlow. Hecho para una pizzería pequeña.</span>
          <span>Precios en MXN · Pago al recoger</span>
        </div>
      </div>
    </footer>
  )
}
