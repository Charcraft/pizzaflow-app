import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
})

export const metadata: Metadata = {
  title: {
    default: 'PizzaFlow · Pizzería de barrio',
    template: '%s · PizzaFlow',
  },
  description:
    'Pide tu pizza en línea, personalízala y recógela en mostrador. Cocina y operación en tiempo real.',
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
