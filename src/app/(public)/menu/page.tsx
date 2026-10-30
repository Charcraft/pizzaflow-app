import Link from 'next/link'
import { MenuBrowser } from '@/components/public/MenuBrowser'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'Menú',
}

export default function MenuPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
            Menú
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Elige tu próxima pizza.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Masa artesanal, ingredientes frescos y precio claro desde el inicio.
            Recoge en mostrador en 15-25 minutos.
          </p>
        </div>
        <Link
          href="/cart"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-line bg-paper px-4 text-sm font-medium text-ink hover:bg-cream"
        >
          <Icon name="bag" size={17} />
          Ver carrito
        </Link>
      </div>

      <div className="mt-8">
        <MenuBrowser />
      </div>
    </main>
  )
}
