import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PizzaFlow · Pizzería de barrio — Pizza artesanal en Tuxtla',
    template: '%s · PizzaFlow',
  },
  description:
    'Pizzería de barrio con pedido en línea y recogida en mostrador. Pizzas artesanales, personalización al instante y cocina en tiempo real. 15-25 min.',
  applicationName: 'PizzaFlow',
  authors: [{ name: 'Grupo 4-C · UPChiapas' }],
  creator: 'PizzaFlow',
  publisher: 'PizzaFlow',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/',
    siteName: 'PizzaFlow',
    title: 'PizzaFlow · Pizzería de barrio — Pizza artesanal en Tuxtla',
    description:
      'Pide tu pizza en línea, personalízala y recógela en mostrador. Horno bajo control y seguimiento en tiempo real.',
  },
  twitter: {
    card: 'summary',
    title: 'PizzaFlow · Pizzería de barrio',
    description:
      'Pide tu pizza en línea y recógela en mostrador. 15-25 min, sin filas.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${bricolage.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
