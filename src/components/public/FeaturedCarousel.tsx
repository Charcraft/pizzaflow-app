import Link from 'next/link'
import { AutoCarousel } from '@/components/public/AutoCarousel'
import { PizzaArt } from '@/components/public/PizzaArt'
import { Icon } from '@/components/ui/Icon'
import { DEMO_PRODUCTS, formatMoney } from '@/lib/menu/products'

const FEATURED = [DEMO_PRODUCTS[0], DEMO_PRODUCTS[1], DEMO_PRODUCTS[3]]

export function FeaturedCarousel() {
  const slides = FEATURED.map((product) => (
    <div
      key={product.id}
      className="grid overflow-hidden rounded-panel border border-line bg-paper shadow-soft md:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="flex min-h-64 items-center justify-center bg-[#F6E3C5] p-6">
        <PizzaArt
          className="h-56 sm:h-64"
          rotation={(Number(product.id) * 11) % 18 - 9}
          variant={product.artVariant ?? 0}
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <span className="w-fit rounded-full bg-tomato/10 px-2.5 py-1 text-[11px] font-semibold text-tomato">
          Favorita de la casa
        </span>
        <h3 className="mt-4 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          {product.name}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">{product.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="tabular text-2xl font-semibold text-ink">
            Desde {formatMoney(product.basePriceCents)}
          </span>
          <Link
            href={`/product/${product.id}`}
            className="inline-flex h-10 items-center gap-1.5 rounded-[9px] bg-tomato px-4 text-sm font-medium text-white hover:bg-tomato-deep"
          >
            Personalizar
            <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </div>
    </div>
  ))

  return <AutoCarousel slides={slides} label="Favoritas de la casa" autoMs={6500} />
}
