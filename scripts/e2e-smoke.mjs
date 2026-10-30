import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://localhost:3002'
const OUT = path.resolve(process.cwd(), '..', 'docs', 'evidencias')
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Configura ADMIN_EMAIL y ADMIN_PASSWORD en app/.env.local')
  process.exit(2)
}

fs.mkdirSync(OUT, { recursive: true })

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'} · ${name}${detail ? ` · ${detail}` : ''}`)
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
context.on('page', (popup) => {
  if (popup !== page) popup.close().catch(() => {})
})
const errors = []
page.on('pageerror', (error) => errors.push(String(error)))

try {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  check('landing responde', await page.getByText('Pizza de verdad').isVisible())
  await page.screenshot({ path: path.join(OUT, 'e2e-01-landing.png'), fullPage: true })

  await page.goto(`${BASE}/menu`, { waitUntil: 'networkidle' })
  check('menu muestra pizzas', await page.getByRole('tab', { name: 'Pizzas' }).isVisible())
  await page.screenshot({ path: path.join(OUT, 'e2e-02-menu.png'), fullPage: true })

  await page.getByRole('link', { name: 'Personalizar' }).first().click()
  await page.waitForURL(/\/product\/1/)
  check('detalle producto carga', await page.getByText('Mitad y mitad').isVisible())

  await page.getByRole('checkbox').first().check()
  await page.getByRole('button', { name: 'Agregar una unidad' }).click()
  await page.getByRole('button', { name: 'Agregar al carrito' }).click()
  check('producto personalizado agregado', await page.getByText('Agregado al carrito').isVisible())
  await page.screenshot({ path: path.join(OUT, 'e2e-03-producto.png'), fullPage: true })

  await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle' })
  check('carrito conserva item', await page.getByText('Pizza Margarita').isVisible())

  await page.locator('#promo-code').fill('BIENVENIDO10')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await page.getByText('Descuento (BIENVENIDO10)').waitFor({ timeout: 10000 })
  check('promocion aplicada', await page.getByText('Ahorras').isVisible())

  await page.getByRole('link', { name: 'Ir al checkout' }).click()
  await page.waitForURL(/\/checkout/)
  await page.locator('#customer-name').fill('Carlos Prueba')
  await page.locator('#customer-phone').fill('9611234567')
  await page.screenshot({ path: path.join(OUT, 'e2e-04-checkout.png'), fullPage: true })
  await page.getByRole('button', { name: /Confirmar pedido/ }).click()
  await page.waitForURL(/\/order\//, { timeout: 15000 })

  check('pedido creado con folio', await page.getByText('Folio', { exact: true }).isVisible())
  const folio = await page.locator('h1').first().textContent()
  check('folio generado', /#\d+/.test(folio || ''), folio || '')
  check(
    'descuento en el pedido',
    await page.getByText('Descuento (BIENVENIDO10)').first().isVisible(),
  )
  const whatsapp = page.getByRole('link', { name: /Enviar pedido por WhatsApp/ })
  check(
    'whatsapp del dueno',
    (await whatsapp.getAttribute('href'))?.includes('wa.me/529611900363') ?? false,
  )
  await page.screenshot({ path: path.join(OUT, 'e2e-05-seguimiento.png'), fullPage: true })

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.locator('#login-email').fill(ADMIN_EMAIL)
  await page.locator('#login-password').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar al panel' }).click()
  await page.waitForURL(/\/interno/, { timeout: 15000 })
  check('login admin', await page.getByText('Centro de operaciones').isVisible())

  check('sin errores de pagina', errors.length === 0, errors.slice(0, 3).join(' | '))
} catch (error) {
  check('flujo completo', false, String(error))
  await page.screenshot({ path: path.join(OUT, 'e2e-error.png'), fullPage: true }).catch(() => {})
} finally {
  await browser.close()
}

const failed = results.filter((result) => !result.ok)
fs.writeFileSync(
  path.join(OUT, 'e2e-resultados.json'),
  JSON.stringify({ base: BASE, date: new Date().toISOString(), results }, null, 2),
)
console.log(`\n${results.length - failed.length}/${results.length} pruebas OK`)
process.exit(failed.length ? 1 : 0)
