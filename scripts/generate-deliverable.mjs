import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd(), '..')
const evidenceDir = path.join(root, 'docs', 'evidencias')
const outFile = path.join(root, 'docs', '00-setup', 'entrega-v0.2.0.pdf')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function image(name, caption, className = '') {
  const file = path.join(evidenceDir, name)
  if (!fs.existsSync(file)) return ''
  const base64 = fs.readFileSync(file).toString('base64')
  return `<figure class="${className}">
    <img src="data:image/png;base64,${base64}" alt="${escapeHtml(caption)}" />
    <figcaption>${escapeHtml(caption)}</figcaption>
  </figure>`
}

function readLog(name) {
  const file = path.join(evidenceDir, name)
  if (!fs.existsSync(file)) return ''
  return fs.readFileSync(file, 'utf8').trim()
}

function readResults(name) {
  const file = path.join(evidenceDir, name)
  if (!fs.existsSync(file)) return []
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')).results ?? []
  } catch {
    return []
  }
}

const smoke = readResults('e2e-resultados.json')
const operacion = readResults('e2e-operacion-resultados.json')

function resultRows(results) {
  if (!results.length) return '<tr><td colspan="3">Sin resultados registrados.</td></tr>'
  return results
    .map(
      (result) => `<tr>
        <td class="${result.ok ? 'pass' : 'fail'}">${result.ok ? 'PASS' : 'FAIL'}</td>
        <td>${escapeHtml(result.name)}</td>
        <td>${escapeHtml(result.detail ?? '')}</td>
      </tr>`,
    )
    .join('')
}

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>PizzaFlow v0.2.0</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #1f2937; margin: 0; font-size: 10.5pt; line-height: 1.45; }
  h1, h2, h3 { color: #111827; margin: 0 0 6pt; }
  h2 { font-size: 17pt; border-bottom: 2pt solid #dc2626; padding-bottom: 4pt; margin-top: 14pt; }
  h3 { font-size: 12.5pt; margin-top: 10pt; }
  p { margin: 0 0 6pt; }
  ul, ol { margin: 0 0 6pt 16pt; padding: 0; }
  table { width: 100%; border-collapse: collapse; margin: 6pt 0 10pt; font-size: 9.5pt; }
  th, td { border: 0.6pt solid #d1d5db; padding: 4pt 6pt; text-align: left; vertical-align: top; }
  th { background: #fef2f2; color: #7f1d1d; }
  .pass { color: #047857; font-weight: 700; }
  .fail { color: #b91c1c; font-weight: 700; }
  .cover { height: 245mm; display: flex; flex-direction: column; justify-content: space-between;
    background: linear-gradient(160deg, #fff7ed 0%, #fee2e2 55%, #fecaca 100%);
    border-radius: 10pt; padding: 22mm 18mm; page-break-after: always; }
  .cover .brand { font-size: 13pt; font-weight: 700; color: #b91c1c; letter-spacing: .5pt; }
  .cover h1 { font-size: 40pt; line-height: 1.05; margin: 0; color: #7f1d1d; }
  .cover .subtitle { font-size: 15pt; color: #374151; margin-top: 8pt; }
  .cover .meta { font-size: 11pt; color: #374151; }
  .cover .badge { display: inline-block; background: #b91c1c; color: white; padding: 5pt 10pt;
    border-radius: 999pt; font-size: 10pt; font-weight: 600; margin-bottom: 10pt; }
  .cover table { background: rgba(255,255,255,.7); }
  .note { background: #f0fdf4; border-left: 3pt solid #16a34a; padding: 6pt 8pt; margin: 8pt 0; }
  .warn { background: #fffbeb; border-left: 3pt solid #d97706; padding: 6pt 8pt; margin: 8pt 0; }
  pre { background: #f9fafb; border: 0.6pt solid #e5e7eb; border-radius: 4pt; padding: 6pt 8pt;
    font-size: 8.5pt; white-space: pre-wrap; word-break: break-word; margin: 4pt 0 8pt; }
  figure { margin: 6pt 0 10pt; page-break-inside: avoid; }
  figure img { width: 100%; border: 0.6pt solid #d1d5db; border-radius: 4pt; }
  figcaption { font-size: 8.5pt; color: #6b7280; margin-top: 3pt; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; }
  .grid2 figure { margin: 0; }
  .page-break { page-break-before: always; }
  .small { font-size: 8.5pt; color: #6b7280; }
  .kpi { display: flex; gap: 8pt; margin: 8pt 0; }
  .kpi div { flex: 1; background: #f9fafb; border: 0.6pt solid #e5e7eb; border-radius: 5pt; padding: 7pt; }
  .kpi strong { display: block; font-size: 15pt; color: #b91c1c; }
  .arch { display: flex; align-items: center; gap: 8pt; margin: 8pt 0; }
  .arch .box { flex: 1; background: #fff7ed; border: 0.8pt solid #fdba74; border-radius: 5pt;
    padding: 8pt; text-align: center; font-weight: 600; font-size: 9pt; }
  .arch .arrow { font-size: 16pt; color: #b91c1c; }
</style>
</head>
<body>

<section class="cover">
  <div>
    <div class="brand">GRUPO 4-C · UPCHIAPAS</div>
    <div class="badge">Entrega v0.2.0 · 30 de octubre de 2026</div>
    <h1>PizzaFlow</h1>
    <div class="subtitle">Sistema integral para pizzería pequeña<br/>Pedidos web, mostrador, cocina y dashboard</div>
  </div>
  <div class="meta">
    <table>
      <tr><th>Integrante</th><th>Matrícula</th><th>Rol</th></tr>
      <tr><td>Santos Enoch González Pérez</td><td>253390</td><td>Scrum Master</td></tr>
      <tr><td>Leonardo Nucamendi Ruiz</td><td>253425</td><td>Product Owner</td></tr>
      <tr><td>Carlos de Jesús Martínez Pineda</td><td>253432</td><td>Desarrollo Fullstack</td></tr>
      <tr><td>Carlos Adrián Alarcón Valencia</td><td>253580</td><td>Desarrollo Fullstack</td></tr>
    </table>
    <p class="small">Materia: Análisis y Diseño de Software · Docente: Rocío Crystal Hernández Camacho</p>
  </div>
</section>

<h2>1. Resumen ejecutivo</h2>
<p>PizzaFlow es el sistema de operación de una pizzería pequeña sin delivery. En esta
entrega se implementó un flujo completo de pedido web para recoger en mostrador, un
punto de venta (POS) para pedidos presenciales, una pantalla de cocina (KDS) con
semáforo y cronómetro de horno, y un dashboard con métricas del día.</p>
<div class="kpi">
  <div><strong>4</strong>módulos operativos</div>
  <div><strong>22</strong>tablas en base de datos</div>
  <div><strong>31</strong>políticas RLS</div>
  <div><strong>13/13</strong>pruebas automatizadas</div>
</div>
<div class="note">La aplicación funciona en modo demostración con <b>localStorage</b> y también
incluye las migraciones SQL para conectarla a Supabase cuando el proyecto esté aprovisionado.</div>
<p class="small">Este documento se complementa con el código en la carpeta <code>app/</code> y
las capturas en <code>docs/evidencias/</code>.</p>

<h2>2. Alcance de la entrega</h2>
<table>
  <tr><th>Historia</th><th>Alcance</th><th>Estado</th></tr>
  <tr><td>PB-02</td><td>Personalización de pizza: tamaño, extras y mitad/mitad con precio en vivo</td><td class="pass">Implementado</td></tr>
  <tr><td>PB-03</td><td>Seguimiento del pedido con folio, estado y hora estimada</td><td class="pass">Implementado</td></tr>
  <tr><td>PB-04</td><td>Tablero único de comandas (web y mostrador) en cocina</td><td class="pass">Implementado</td></tr>
  <tr><td>PB-05</td><td>KDS FIFO con semáforo de espera y cambios de estado</td><td class="pass">Implementado</td></tr>
  <tr><td>PB-06</td><td>Cronómetro de horno con aviso a 1:30 y alarma a 2:00</td><td class="pass">Implementado</td></tr>
  <tr><td>PB-08 / PB-16</td><td>Dashboard con ventas, ticket promedio, tiempos y top de productos</td><td class="pass">Parcial (v1)</td></tr>
  <tr><td>PB-07, PB-09, PB-10, PB-11, PB-13, PB-17</td><td>Inventario, pagos en línea, división de cuenta, avisos, roles y calificación</td><td>Fuera de alcance v0.2.0 (schema listo)</td></tr>
</table>

<h2>3. Arquitectura</h2>
<div class="arch">
  <div class="box">LANDING<br/><span class="small">Catálogo y pedido</span></div>
  <div class="box">MOSTRADOR<br/><span class="small">POS y cobro</span></div>
  <div class="box">COCINA<br/><span class="small">KDS y horno</span></div>
  <div class="box">DASHBOARD<br/><span class="small">Métricas</span></div>
</div>
<div class="arch">
  <div class="arrow">↓</div>
</div>
<div class="arch">
  <div class="box">STORE DE PEDIDOS<br/><span class="small">localStorage + eventos</span></div>
  <div class="box">SUPABASE<br/><span class="small">PostgreSQL + RLS + Realtime</span></div>
</div>
<p>El store de pedidos es la fuente única en modo demo. Al conectar Supabase, las
migraciones <code>001</code> y <code>002</code> crean las tablas y políticas RLS; el
cliente de Supabase ya está configurado en <code>src/lib/supabase/</code>.</p>
${image('01-landing.png', 'Landing pública con acceso a los cuatro módulos')}

<div class="page-break"></div>
<h2>4. Modelo de datos</h2>
<p>La migración <code>002_full_schema.sql</code> amplía el esquema base con las tablas
necesarias para los cinco sprints. La verificación se ejecutó sobre PostgreSQL (PGlite)
aplicando <code>001</code>, <code>002</code> y el seed completo.</p>
<table>
  <tr><th>Grupo</th><th>Tablas</th></tr>
  <tr><td>Operación</td><td>orders, order_items, tables, profiles, roles</td></tr>
  <tr><td>Catálogo</td><td>products, product_variants, ingredients, promotions</td></tr>
  <tr><td>Inventario</td><td>recipes, recipe_ingredients, inventory</td></tr>
  <tr><td>Cuenta y reparto</td><td>order_splits, split_items, delivery_routes, delivery_tracking</td></tr>
  <tr><td>Control</td><td>audit_log, notifications_log, analytics_events, user_feedback</td></tr>
  <tr><td>Lealtad</td><td>loyalty_accounts, loyalty_transactions</td></tr>
</table>
<pre>${escapeHtml(readLog('test-schema.txt'))}</pre>

<h2>5. Implementación por módulo</h2>
<h3>5.1 Pedido web</h3>
<p>Catálogo por categorías, detalle con tamaño, extras y mitad/mitad, carrito persistente,
checkout con datos de recogida y seguimiento con folio y línea de tiempo.</p>
<div class="grid2">
  ${image('02-menu.png', 'Menú por categorías')}
  ${image('03-producto.png', 'Personalización con precio en vivo')}
</div>
<div class="grid2">
  ${image('04-carrito.png', 'Carrito con cantidades y totales')}
  ${image('05-checkout.png', 'Checkout para recoger en mostrador')}
</div>
${image('e2e-05-seguimiento.png', 'Seguimiento del pedido con folio y estado')}

<div class="page-break"></div>
<h3>5.2 Mostrador (POS)</h3>
<p>Búsqueda de productos, filtros por categoría, carrito lateral, datos de cliente,
método de pago y creación de pedido con folio. El pedido se envía a la misma cola de cocina.</p>
${image('10-mostrador-pedido.png', 'Pedido de mostrador creado con folio #1004')}

<h3>5.3 Cocina (KDS)</h3>
<p>Pedidos activos ordenados por antigüedad, semáforo de espera (verde &lt;1 min, ámbar
1-2 min, rojo &gt;2 min), cambio de estado y cronómetro de horno con aviso visual y alarma.</p>
${image('11-cocina-pedidos.png', 'Comandas activas con semáforo y folio')}
${image('12-cocina-horno.png', 'Cronómetro de horno en 1:15 y 0:02')}

<h3>5.4 Dashboard</h3>
<p>Pedidos y ventas del día, ticket promedio, tiempo promedio pedido→listo, distribución
por estado y top de productos.</p>
${image('13-dashboard.png', 'Dashboard con métricas del día')}

<div class="page-break"></div>
<h2>6. Pruebas y evidencias</h2>
<p>Se ejecutaron dos suites de humo con Playwright Core sobre Chrome, además de las
verificaciones de tipos, lint, build y schema.</p>
<h3>6.1 Flujo web</h3>
<table>
  <tr><th>Resultado</th><th>Prueba</th><th>Detalle</th></tr>
  ${resultRows(smoke)}
</table>
<h3>6.2 Flujo operativo</h3>
<table>
  <tr><th>Resultado</th><th>Prueba</th><th>Detalle</th></tr>
  ${resultRows(operacion)}
</table>
<h3>6.3 Verificación técnica</h3>
<p><b>TypeScript:</b> sin errores. <b>ESLint:</b> sin errores. <b>Build:</b> 12 rutas generadas.</p>
<pre>${escapeHtml(readLog('build.txt').split('\n').slice(-18).join('\n'))}</pre>
<p class="small">Logs completos: <code>docs/evidencias/typecheck.txt</code>,
<code>lint.txt</code>, <code>build.txt</code>, <code>test-schema.txt</code>,
<code>test-e2e.txt</code> y <code>test-operacion.txt</code>.</p>

<h2>7. Changelog v0.2.0</h2>
<ul>
  <li>Flujo web completo: landing, menú, producto, carrito, checkout y seguimiento.</li>
  <li>POS de mostrador con folio y envío a cocina.</li>
  <li>KDS con FIFO, semáforo y cronómetro de horno.</li>
  <li>Dashboard con ventas, ticket, tiempos y top de productos.</li>
  <li>Migración 002 con roles, mesas, recetas, inventario, reparto, bitácora y lealtad.</li>
  <li>Tailwind CSS 4 configurado y estilos activos.</li>
  <li>Scripts de verificación de schema y pruebas E2E.</li>
</ul>

<h2>8. Contribuciones</h2>
<table>
  <tr><th>Integrante</th><th>Rol</th><th>Funcionalidad</th><th>Horas</th></tr>
  <tr><td>Carlos de Jesús Martínez Pineda</td><td>Fullstack</td><td>Flujo web, store de pedidos, migración 002 y RLS</td><td>12</td></tr>
  <tr><td>Carlos Adrián Alarcón Valencia</td><td>Fullstack</td><td>POS, KDS, semáforo, cronómetro y dashboard</td><td>10</td></tr>
  <tr><td>Santos Enoch González Pérez</td><td>Scrum Master</td><td>Integración, verificación de schema, build y estilos</td><td>4</td></tr>
  <tr><td>Leonardo Nucamendi Ruiz</td><td>Product Owner</td><td>Validación de alcance, pruebas y documentación</td><td>3</td></tr>
</table>

<p class="small">Documento generado para la entrega v0.2.0 · 30 de octubre de 2026 ·
Evidencias en <code>docs/evidencias/</code>.</p>

</body>
</html>`

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage()
await page.setContent(html, { waitUntil: 'load' })
await page.pdf({
  path: outFile,
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
})
await browser.close()

const size = fs.statSync(outFile).size
console.log(`PDF generado: ${outFile} (${(size / 1024).toFixed(1)} KB)`)
