import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const BASE = 'http://localhost:3002'
const OUT = path.resolve(process.cwd(), '..', 'docs', 'evidencias')
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()

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

  await page.getByRole('checkbox').first().check()
  await page.getByRole('button', { name: 'Agregar al carrito' }).click()
  await page.waitForTimeout(400)
  await shot('04-carrito', '/cart')

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

  await shot('07-mis-pedidos', '/pedido')

  await shot('08-interno-hub', '/interno')
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
