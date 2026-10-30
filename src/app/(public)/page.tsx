import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PizzaArt } from '@/components/public/PizzaArt'
import { PromoCarousel } from '@/components/public/PromoCarousel'
import { FeaturedCarousel } from '@/components/public/FeaturedCarousel'

export const metadata = {
  title: 'PizzaFlow — Pizzería de barrio en Tuxtla',
  description:
    'Pide pizza artesanal en línea y recógela en mostrador. Personalización instantánea, horno monitoreado y seguimiento en tiempo real. 15-25 min.',
  openGraph: {
    title: 'PizzaFlow — Pizza artesanal con recogida en mostrador',
    description:
      'Menú corto, precio claro y cocina en tiempo real. Pide ahora y pasa a recoger.',
    url: '/',
  },
}

const STEPS = [
  {
    icon: 'pizza' as const,
    title: 'Elige tu pizza',
    text: 'Menú corto y claro: pizzas, bebidas y extras. Sin letras chiquitas.',
  },
  {
    icon: 'spark' as const,
    title: 'Hazla tuya',
    text: 'Tamaño, extras y mitad/mitad. El precio se actualiza al instante.',
  },
  {
    icon: 'bag' as const,
    title: 'Recoge y listo',
    text: 'Te damos folio y hora estimada. Llega, di tu número y te la llevas.',
  },
]

const BENEFITS = [
  {
    icon: 'flame' as const,
    title: 'Horno bajo control',
    text: 'Cada pizza entra con cronómetro. Aviso a 1:30 y alarma a 2:00 para que no salga cruda ni quemada.',
  },
  {
    icon: 'clock' as const,
    title: 'Sin filas ni esperas ciegas',
    text: 'Sabes cuándo estará lista antes de salir de casa. Nada de “ya casi”.',
  },
  {
    icon: 'receipt' as const,
    title: 'Un pedido, un folio',
    text: 'Tu pedido viaja completo a cocina. Sin comandas perdidas ni confusiones.',
  },
]

export default function HomePage() {
  return (
    <main>
      <div className="border-b border-line bg-night text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="sm:truncate">
            <span className="font-semibold text-[#FDBA74]">Hoy:</span> 10% en tu primer
            pedido con{' '}
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px]">
              BIENVENIDO10
            </span>
          </p>
          <a href="#promos" className="text-white/60 hover:text-white">
            Ver promociones →
          </a>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-basil" />
              Pizzería de barrio · Recoger en mostrador
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl lg:text-7xl">
              Pizza de verdad,
              <span className="block text-tomato">sin filas ni confusión.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Pide en línea, personaliza tu pizza y recógela en mostrador en 15-25
              minutos. Cocina recibe tu comanda completa desde el primer clic.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/menu" size="lg">
                Pedir ahora
                <Icon name="arrow-right" size={18} />
              </ButtonLink>
              <ButtonLink href="/#como-funciona" variant="secondary" size="lg">
                Cómo funciona
              </ButtonLink>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Icon name="check" size={14} className="text-basil" />
                Cuenta en 1 minuto
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="check" size={14} className="text-basil" />
                Pago al recoger
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="check" size={14} className="text-basil" />
                Precio final claro
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-square overflow-hidden rounded-panel border border-line bg-[#F6E3C5] shadow-soft">
              <div className="absolute inset-5 flex items-center justify-center">
                <PizzaArt className="h-full" />
              </div>
            </div>
            <div className="absolute -left-3 top-8 rounded-card border border-line bg-paper px-3 py-2 shadow-soft sm:-left-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Horno
              </div>
              <div className="tabular text-lg font-semibold text-ink">2:00</div>
            </div>
            <div className="absolute -bottom-4 right-2 rounded-card border border-line bg-paper px-4 py-3 shadow-soft sm:-right-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Lista en
              </div>
              <div className="text-lg font-semibold text-ink">15-25 min</div>
            </div>
          </div>
        </div>
      </section>

      <section id="promos" className="mx-auto max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
              Promociones
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Ofertas que se antojan.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted">
            Aplica el código en el carrito. El descuento se ve antes de pagar.
          </p>
        </div>
        <PromoCarousel />
      </section>

      <section id="como-funciona" className="border-y border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
              Cómo funciona
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Tres pasos. Cero llamadas.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title} className="rounded-panel border border-line bg-cream p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-tomato/10 text-tomato">
                    <Icon name={step.icon} size={20} />
                  </span>
                  <span className="tabular text-xs font-semibold text-muted">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
              Favoritas de la casa
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Las que siempre se piden.
            </h2>
          </div>
          <a href="/menu" className="text-sm font-medium text-tomato hover:underline">
            Ver menú completo →
          </a>
        </div>
        <FeaturedCarousel />
      </section>

      <section className="bg-night text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
              Operación a la vista
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
              La cocina sabe qué sigue. Tú sabes cuándo llega.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="rounded-panel border border-white/10 bg-white/[0.04] p-5">
                <Icon name={benefit.icon} size={22} className="text-[#FDBA74]" />
                <h3 className="mt-4 text-base font-semibold">{benefit.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/60">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-panel border border-line bg-paper p-6 shadow-soft sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="font-display text-3xl tracking-tight text-ink">
              ¿Tienes hambre?
            </h2>
            <p className="mt-2 text-sm text-muted">
              Arma tu pizza en menos de un minuto. Nosotros nos encargamos del resto.
            </p>
          </div>
          <ButtonLink href="/menu" size="lg">
            Pedir ahora
            <Icon name="arrow-right" size={18} />
          </ButtonLink>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Restaurant',
            name: 'PizzaFlow',
            description:
              'Pizzería de barrio con pedido en línea y recogida en mostrador. Pizzas artesanales, personalización al instante.',
            url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
            servesCuisine: 'Pizza',
            priceRange: '$$',
            acceptsReservations: false,
            hasMenu: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/menu`,
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
                opens: '13:00',
                closes: '22:00',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday','Sunday'],
                opens: '12:00',
                closes: '23:00',
              },
            ],
          }),
        }}
      />
    </main>
  )
}
