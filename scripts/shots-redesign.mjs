import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const base = 'http://localhost:3002'
const out = 'C:\\Users\\marti\\AppData\\Local\\Temp\\opencode\\redesign'
fs.mkdirSync(out, { recursive: true })

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})

const pages = [
  ['landing', '/', 1440, 1100],
  ['menu', '/menu', 1440, 1100],
  ['producto', '/product/1', 1440, 1100],
  ['interno', '/interno', 1440, 1000],
  ['pos', '/interno/mostrador', 1440, 1000],
  ['cocina', '/interno/cocina', 1440, 1000],
  ['dashboard', '/interno/dashboard', 1440, 1000],
  ['mobile-landing', '/', 390, 844],
  ['mobile-menu', '/menu', 390, 844],
]

for (const [name, route, width, height] of pages) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: false })
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  console.log(name, 'scrollWidth', scrollWidth)
  await page.close()
}

await browser.close()
