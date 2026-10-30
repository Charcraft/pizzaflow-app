import { PGlite } from '@electric-sql/pglite'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migrations = [
  'supabase/migrations/001_init_schema.sql',
  'supabase/migrations/002_full_schema.sql',
  'src/lib/supabase/seed_full.sql',
]

const EXPECTED_TABLES = [
  'analytics_events',
  'audit_log',
  'delivery_routes',
  'delivery_tracking',
  'ingredients',
  'inventory',
  'loyalty_accounts',
  'loyalty_transactions',
  'notifications_log',
  'order_items',
  'order_splits',
  'orders',
  'product_variants',
  'products',
  'profiles',
  'promotions',
  'recipe_ingredients',
  'recipes',
  'roles',
  'split_items',
  'tables',
  'user_feedback',
]

const db = new PGlite()

async function run(label, file) {
  let sql = fs.readFileSync(path.join(root, file), 'utf8')
  // PGlite trae pgcrypto integrado; se omite la extension para la prueba local.
  sql = sql.replace(/create extension if not exists "pgcrypto";/i, '')
  try {
    await db.exec(sql)
    console.log(`PASS · ${label}`)
  } catch (error) {
    console.error(`FAIL · ${label}: ${error.message}`)
    throw error
  }
}

try {
  await db.exec(`
    create schema if not exists auth;
    create table if not exists auth.users (id uuid primary key);
    create or replace function auth.uid() returns uuid
      language sql stable as $$ select null::uuid $$;
  `)

  await run('001_init_schema.sql', migrations[0])
  await run('002_full_schema.sql', migrations[1])
  await run('seed_full.sql', migrations[2])

  const tables = await db.query(
    `select table_name from information_schema.tables
     where table_schema = 'public' and table_type = 'BASE TABLE'
     order by table_name`,
  )
  const found = tables.rows.map((row) => row.table_name)
  const missing = EXPECTED_TABLES.filter((name) => !found.includes(name))
  const extra = found.filter((name) => !EXPECTED_TABLES.includes(name))

  console.log(`\nTablas encontradas: ${found.length}/${EXPECTED_TABLES.length}`)
  if (missing.length) console.error(`Faltan: ${missing.join(', ')}`)
  if (extra.length) console.log(`Extra: ${extra.join(', ')}`)

  const counts = await db.query(`
    select
      (select count(*) from public.roles) as roles,
      (select count(*) from public.tables) as mesas,
      (select count(*) from public.products) as productos,
      (select count(*) from public.ingredients) as ingredientes,
      (select count(*) from public.inventory) as inventario,
      (select count(*) from public.promotions) as promociones
  `)
  console.log('Datos seed:', counts.rows[0])

  const policies = await db.query(
    `select count(*)::int as total from pg_policies where schemaname = 'public'`,
  )
  console.log(`Politicas RLS: ${policies.rows[0].total}`)

  const failed = missing.length > 0
  console.log(failed ? '\nRESULTADO: FALLIDO' : '\nRESULTADO: OK')
  process.exit(failed ? 1 : 0)
} catch {
  process.exit(1)
}
