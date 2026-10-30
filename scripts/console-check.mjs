import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage()
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    console.log(`[console.${msg.type()}] ${msg.text()}`)
  }
})
page.on('pageerror', (error) => console.log(`[pageerror] ${error}`))

for (const route of ['/dashboard', '/cocina', '/mostrador', '/']) {
  console.log(`\n=== ${route} ===`)
  await page.goto(`http://localhost:3002${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
}
await browser.close()
