import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://localhost:3002'
const OUT = path.resolve(process.cwd(), '..', 'docs', 'evidencias')
fs.mkdirSync(OUT, { recursive: true })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Configura ADMIN_EMAIL y ADMIN_PASSWORD en app/.env.local')
  process.exit(2)
}

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
context.on('page', (popup) => {
  if (popup !== page) popup.close().catch(() => {})
})
await page.addInitScript(() => {
  const style = document.createElement('style')
  style.textContent = 'nextjs-portal { display: none !important; }'
  document.documentElement.appendChild(style)
})

async function shot(name, url, wait = 500) {
  await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(wait)
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false })
  console.log('shot', name)
}

try {
  await shot('01-landing', '/')
  await shot('02-menu', '/menu')
  await shot('03-producto', '/product/1')

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.locator('#promos').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(OUT, '17-promos.png'), fullPage: false })
  console.log('shot 17-promos')

  await shot('16-login', '/login')

  await page.goto(`${BASE}/product/1`, { waitUntil: 'networkidle' })
  await page.getByRole('checkbox').first().check()
  await page.getByRole('button', { name: 'Agregar una unidad' }).click()
  await page.getByRole('button', { name: 'Agregar al carrito' }).click()
  await page.waitForTimeout(300)
  await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle' })
  await page.locator('#promo-code').fill('BIENVENIDO10')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await page.getByText('Descuento (BIENVENIDO10)').waitFor()
  await page.screenshot({ path: path.join(OUT, '04-carrito.png'), fullPage: false })
  console.log('shot 04-carrito')

  await page.getByRole('link', { name: 'Ir al checkout' }).click()
  await page.waitForURL(/\/checkout/)
  await page.locator('#customer-name').fill('María López')
  await page.locator('#customer-phone').fill('961 123 4567')
  await page.screenshot({ path: path.join(OUT, '05-checkout.png'), fullPage: false })
  await page.getByRole('button', { name: /Confirmar pedido/ }).click()
  await page.waitForURL(/\/order\//)
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(OUT, '06-seguimiento.png'), fullPage: false })
  console.log('shot 06-seguimiento')

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(OUT, '18-whatsapp.png'), fullPage: false })
  console.log('shot 18-whatsapp')

  await shot('07-mis-pedidos', '/pedido')

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.locator('#login-email').fill(ADMIN_EMAIL)
  await page.locator('#login-password').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar al panel' }).click()
  await page.waitForURL(/\/interno/)
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(OUT, '08-interno-hub.png'), fullPage: false })
  console.log('shot 08-interno-hub')

  await shot('09-pos', '/interno/mostrador')

  await page.getByRole('button', { name: 'Agregar' }).first().click()
  await page.getByRole('button', { name: 'Cobrar y enviar a cocina' }).click()
  await page.getByText('Pedido enviado a cocina').waitFor()
  await page.screenshot({ path: path.join(OUT, '10-pos-ticket.png'), fullPage: false })
  await page.getByRole('button', { name: 'Cerrar' }).click()
  console.log('shot 10-pos-ticket')

  await shot('11-cocina', '/interno/cocina')

  const confirmar = page.getByRole('button', { name: 'Confirmar' }).first()
  if (await confirmar.count()) {
    await confirmar.click()
    await page.getByRole('button', { name: 'Preparando' }).first().click()
    await page.getByRole('button', { name: 'En horno' }).first().click()
    await page.waitForTimeout(2200)
  }
  await page.screenshot({ path: path.join(OUT, '12-cocina-horno.png'), fullPage: false })
  console.log('shot 12-cocina-horno')

  await shot('13-dashboard', '/interno/dashboard')

  await page.setViewportSize({ width: 390, height: 844 })
  await shot('14-mobile-landing', '/')
  await shot('15-mobile-menu', '/menu')
} finally {
  await browser.close()
}
