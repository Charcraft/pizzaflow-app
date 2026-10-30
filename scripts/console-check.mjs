import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage()
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Configura ADMIN_EMAIL y ADMIN_PASSWORD en app/.env.local')
  process.exit(2)
}
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    console.log(`[console.${msg.type()}] ${msg.text()}`)
  }
})
page.on('pageerror', (error) => console.log(`[pageerror] ${error}`))

await page.goto('http://localhost:3002/login', { waitUntil: 'networkidle' })
await page.locator('#login-email').fill(ADMIN_EMAIL)
await page.locator('#login-password').fill(ADMIN_PASSWORD)
await page.getByRole('button', { name: 'Entrar al panel' }).click()
await page.waitForURL(/\/interno/)

for (const route of ['/interno/dashboard', '/interno/cocina', '/interno/mostrador', '/interno', '/', '/menu', '/login']) {
  console.log(`\n=== ${route} ===`)
  await page.goto(`http://localhost:3002${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
}
await browser.close()
