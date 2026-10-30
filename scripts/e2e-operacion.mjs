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
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.locator('#login-email').fill(ADMIN_EMAIL)
  await page.locator('#login-password').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar al panel' }).click()
  await page.waitForURL(/\/interno/, { timeout: 15000 })
  check('login del equipo', await page.getByText('Centro de operaciones').isVisible())

  await page.goto(`${BASE}/interno/mostrador`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Agregar' }).first().click()
  await page.getByRole('button', { name: 'Agregar' }).nth(1).click()
  await page.getByRole('button', { name: 'Cobrar y enviar a cocina' }).click()
  await page.getByText('Pedido enviado a cocina').waitFor({ timeout: 10000 })
  const folioText = await page.getByRole('dialog').locator('p.tabular').textContent()
  check('mostrador crea pedido', /#\d+/.test(folioText || ''), folioText || '')
  const whatsapp = page.getByRole('link', { name: 'Abrir WhatsApp' })
  check(
    'whatsapp del dueno desde POS',
    (await whatsapp.getAttribute('href'))?.includes('wa.me/529611900363') ?? false,
  )
  await page.screenshot({ path: path.join(OUT, '10-pos-ticket.png'), fullPage: true })
  await page.getByRole('button', { name: 'Cerrar' }).click()

  await page.goto(`${BASE}/interno/cocina`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Cocina' }).waitFor()
  await page.getByText('#1001').waitFor({ timeout: 10000 })
  check('cocina lista pedidos', await page.getByText('En horno').first().isVisible())
  await page.screenshot({ path: path.join(OUT, '11-cocina-pedidos.png'), fullPage: true })

  const confirmar = page.getByRole('button', { name: 'Confirmar' }).first()
  await confirmar.click()
  await page.getByRole('button', { name: 'Preparando' }).first().click()
  await page.getByRole('button', { name: 'En horno' }).first().click()
  await page.waitForTimeout(2500)
  check('cocina inicia cronometro', await page.getByText('Horno').first().isVisible())
  await page.screenshot({ path: path.join(OUT, '12-cocina-horno.png'), fullPage: true })

  await page.goto(`${BASE}/interno/dashboard`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Dashboard' }).waitFor()
  await page.waitForTimeout(500)
  check('dashboard muestra metricas', await page.getByText('Pedidos hoy').isVisible())
  await page.screenshot({ path: path.join(OUT, '13-dashboard.png'), fullPage: true })

  check('sin errores de pagina', errors.length === 0, errors.slice(0, 3).join(' | '))
} catch (error) {
  check('flujo operativo', false, String(error))
  await page.screenshot({ path: path.join(OUT, 'e2e-operacion-error.png'), fullPage: true }).catch(() => {})
} finally {
  await browser.close()
}

const failed = results.filter((result) => !result.ok)
fs.writeFileSync(
  path.join(OUT, 'e2e-operacion-resultados.json'),
  JSON.stringify({ base: BASE, date: new Date().toISOString(), results }, null, 2),
)
console.log(`\n${results.length - failed.length}/${results.length} pruebas OK`)
process.exit(failed.length ? 1 : 0)
