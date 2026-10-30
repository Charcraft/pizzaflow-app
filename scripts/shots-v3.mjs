import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const BASE = 'http://localhost:3002'
const OUT = 'C:\\Users\\marti\\AppData\\Local\\Temp\\opencode\\v3'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

for (const [name, route] of [
  ['landing', '/'],
  ['menu', '/menu'],
  ['producto', '/product/1'],
  ['registro', '/registro'],
  ['entrar', '/entrar'],
]) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: path.join(OUT, `${name}.png`) })
  console.log(name)
}

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.locator('#promos').scrollIntoViewIfNeeded()
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(OUT, 'promos.png') })
console.log('promos')

await browser.close()
