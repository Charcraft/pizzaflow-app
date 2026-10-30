import Link from 'next/link'
import { AutoCarousel } from '@/components/public/AutoCarousel'
import { Icon } from '@/components/ui/Icon'
import { formatMoney } from '@/lib/menu/products'
import { PROMOTIONS } from '@/lib/promotions'

const THEMES = [
  {
    bg: 'bg-tomato',
    text: 'text-white',
    muted: 'text-white/75',
    chip: 'bg-white/15',
    accent: 'text-[#FFD166]',
    button: 'bg-white text-tomato hover:bg-cream',
    codeBorder: 'border-white/30',
  },
  {
    bg: 'bg-night',
    text: 'text-white',
    muted: 'text-white/70',
    chip: 'bg-white/10',
    accent: 'text-[#FFB703]',
    button: 'bg-gold text-night hover:bg-[#FFD166]',
    codeBorder: 'border-white/25',
  },
  {
    bg: 'bg-gold',
    text: 'text-ink',
    muted: 'text-ink/70',
    chip: 'bg-ink/10',
    accent: 'text-tomato',
    button: 'bg-ink text-white hover:bg-night-soft',
    codeBorder: 'border-ink/25',
  },
]

export function PromoCarousel() {
  const slides = PROMOTIONS.map((promo, index) => {
    const theme = THEMES[index % THEMES.length]
    const value =
      promo.type === 'percent' ? `${promo.value}%` : formatMoney(promo.value).replace('.00', '')
    return (
      <div key={promo.code} className={`relative overflow-hidden ${theme.bg} ${theme.text}`}>
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-white/10" />
        <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full border-[22px] border-white/10" />
        <div className="relative grid gap-6 p-7 sm:p-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${theme.chip}`}>
              {promo.badge} · PizzaFlow
            </span>
            <h2 className="mt-4 font-display text-3xl leading-[1.02] tracking-tight sm:text-5xl">
              {promo.title}
            </h2>
            <p className={`mt-3 max-w-md text-sm leading-6 ${theme.muted}`}>
              {promo.description} Pedido mínimo {formatMoney(promo.minOrderCents)}.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className={`rounded-[8px] border border-dashed px-3 py-1.5 font-mono text-xs font-semibold ${theme.codeBorder} ${theme.accent}`}>
                {promo.code}
              </span>
              <Link
                href="/menu"
                className={`inline-flex h-10 items-center gap-1.5 rounded-[9px] px-4 text-sm font-semibold ${theme.button}`}
              >
                Pedir con este código
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <div className={`font-display text-[86px] leading-none tracking-[-0.06em] sm:text-[120px] ${theme.accent}`}>
              {value}
            </div>
          </div>
        </div>
      </div>
    )
  })

  return <AutoCarousel slides={slides} label="Promociones PizzaFlow" />
}
