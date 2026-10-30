-- 002_full_schema.sql
-- Esquema completo PizzaFlow: roles, mesas, recetas, inventario,
-- division de cuenta, reparto, bitacora, notificaciones y lealtad.
-- Idempotente: se puede ejecutar despues de 001.

-- ============================================================
-- Roles
-- ============================================================
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamptz default now()
);

insert into public.roles (name, description) values
  ('customer', 'Cliente final'),
  ('cajero', 'Cajero de mostrador'),
  ('mesero', 'Mesero de mesa'),
  ('cocinero', 'Personal de cocina'),
  ('repartidor', 'Repartidor a domicilio'),
  ('staff', 'Personal general'),
  ('admin', 'Administrador del sistema')
on conflict (name) do nothing;

alter table public.profiles add column if not exists is_active boolean default true;
alter table public.profiles add column if not exists last_login timestamptz;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_fkey foreign key (role) references public.roles(name);

-- ============================================================
-- Mesas
-- ============================================================
create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  number int unique not null,
  name text,
  capacity int default 4,
  is_active boolean default true
);

insert into public.tables (number, name, capacity, is_active) values
  (1, 'Mesa 1', 4, true),
  (2, 'Mesa 2', 4, true),
  (3, 'Mesa 3', 4, true),
  (4, 'Mesa 4', 6, true)
on conflict (number) do nothing;

-- ============================================================
-- Pedidos: canales, estados y campos operativos
-- ============================================================
alter table public.orders drop constraint if exists orders_source_check;
alter table public.orders
  add constraint orders_source_check
  check (source in ('web', 'counter', 'qr_table', 'phone', 'delivery'));

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check
  check (status in ('pending', 'confirmed', 'preparing', 'in_oven', 'ready', 'completed', 'cancelled'));

alter table public.orders add column if not exists table_number int references public.tables(number);
alter table public.orders add column if not exists delivery_address text;
alter table public.orders add column if not exists assigned_to uuid references public.profiles(id);
alter table public.orders add column if not exists oven_start_time timestamptz;
alter table public.orders add column if not exists oven_end_time timestamptz;

create index if not exists idx_orders_table on public.orders(table_number);
create index if not exists idx_orders_assigned on public.orders(assigned_to);

-- ============================================================
-- Recetas e inventario (PB-07)
-- ============================================================
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references public.recipes(id) on delete cascade,
  ingredient_id uuid references public.ingredients(id),
  quantity numeric(10,2) not null default 1,
  unit text,
  created_at timestamptz default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid unique references public.ingredients(id) on delete cascade,
  quantity numeric(12,2) not null default 0,
  min_quantity numeric(12,2) default 0,
  unit text,
  last_restock timestamptz,
  updated_at timestamptz default now()
);

create index if not exists idx_recipes_product on public.recipes(product_id);
create index if not exists idx_inventory_ingredient on public.inventory(ingredient_id);

-- ============================================================
-- Division de cuenta (PB-10)
-- ============================================================
create table if not exists public.order_splits (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  split_type text not null check (split_type in ('equal', 'by_product', 'manual')),
  total_splits int not null default 1,
  paid_splits int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.split_items (
  id uuid primary key default gen_random_uuid(),
  split_id uuid references public.order_splits(id) on delete cascade,
  order_item_id uuid references public.order_items(id),
  assigned_to text,
  amount_cents int not null,
  paid boolean default false,
  paid_at timestamptz
);

-- ============================================================
-- Reparto y rastreo (PB-14, PB-15)
-- ============================================================
create table if not exists public.delivery_routes (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references public.profiles(id),
  order_id uuid references public.orders(id),
  estimated_time_min int,
  status text default 'pending' check (status in ('pending', 'in_progress', 'delivered', 'failed')),
  evidence_photo_url text,
  evidence_signature text,
  delivered_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.delivery_tracking (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references public.delivery_routes(id) on delete cascade,
  status text not null,
  location_lat numeric(10,8),
  location_lng numeric(10,8),
  estimated_arrival timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_delivery_routes_driver on public.delivery_routes(driver_id);

-- ============================================================
-- Bitacora y notificaciones (PB-11, PB-13)
-- ============================================================
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb default '{}',
  ip_address text,
  created_at timestamptz default now()
);

create table if not exists public.notifications_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  channel text check (channel in ('whatsapp', 'sms', 'push')),
  recipient text not null,
  message text,
  status text default 'pending' check (status in ('pending', 'sent', 'failed', 'retrying')),
  attempts int default 0,
  sent_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_audit_log_user on public.audit_log(user_id, created_at desc);
create index if not exists idx_notifications_order on public.notifications_log(order_id);

-- ============================================================
-- Lealtad (PB-18, segunda fase)
-- ============================================================
create table if not exists public.loyalty_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete cascade,
  points int default 0,
  lifetime_points int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.loyalty_accounts(id) on delete cascade,
  type text check (type in ('earn', 'redeem', 'expire')),
  points int not null,
  order_id uuid references public.orders(id),
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_loyalty_accounts_user on public.loyalty_accounts(user_id);

-- ============================================================
-- RLS: helper de rol
-- ============================================================
create or replace function public.current_role_name() returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function public.is_staff() returns boolean as $$
  select coalesce(public.current_role_name() in
    ('staff', 'admin', 'cajero', 'mesero', 'cocinero', 'repartidor'), false);
$$ language sql stable security definer;

create or replace function public.is_admin() returns boolean as $$
  select coalesce(public.current_role_name() = 'admin', false);
$$ language sql stable security definer;

-- Orders: reemplaza politicas de 001 para incluir todos los roles operativos
drop policy if exists "orders_read_own_or_staff" on public.orders;
drop policy if exists "orders_insert" on public.orders;
drop policy if exists "orders_update_staff" on public.orders;

create policy "orders_read_own_or_staff" on public.orders
  for select using (customer_id = auth.uid() or public.is_staff());

create policy "orders_insert" on public.orders
  for insert with check (customer_id = auth.uid() or customer_id is null or public.is_staff());

create policy "orders_update_staff" on public.orders
  for update using (public.is_staff()) with check (public.is_staff());

-- Order items: reemplaza politicas de 001
drop policy if exists "order_items_read" on public.order_items;
drop policy if exists "order_items_insert" on public.order_items;

create policy "order_items_read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.customer_id = auth.uid() or public.is_staff())
    )
  );

create policy "order_items_insert" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.customer_id = auth.uid() or public.is_staff())
    )
  );

-- Tablas nuevas: RLS
alter table public.roles enable row level security;
alter table public.tables enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.inventory enable row level security;
alter table public.order_splits enable row level security;
alter table public.split_items enable row level security;
alter table public.delivery_routes enable row level security;
alter table public.delivery_tracking enable row level security;
alter table public.audit_log enable row level security;
alter table public.notifications_log enable row level security;
alter table public.loyalty_accounts enable row level security;
alter table public.loyalty_transactions enable row level security;

-- Roles: lectura autenticada, escritura admin
create policy "roles_read" on public.roles
  for select using (auth.uid() is not null);
create policy "roles_write_admin" on public.roles
  for all using (public.is_admin()) with check (public.is_admin());

-- Mesas: lectura publica, escritura staff
create policy "tables_read" on public.tables
  for select using (true);
create policy "tables_write_staff" on public.tables
  for all using (public.is_staff()) with check (public.is_staff());

-- Recetas e inventario: lectura staff, escritura admin
create policy "recipes_read_staff" on public.recipes
  for select using (public.is_staff());
create policy "recipes_write_admin" on public.recipes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "recipe_ingredients_read_staff" on public.recipe_ingredients
  for select using (public.is_staff());
create policy "recipe_ingredients_write_admin" on public.recipe_ingredients
  for all using (public.is_admin()) with check (public.is_admin());

create policy "inventory_read_staff" on public.inventory
  for select using (public.is_staff());
create policy "inventory_write_staff" on public.inventory
  for all using (public.is_staff()) with check (public.is_staff());

-- Division de cuenta: staff
create policy "order_splits_staff" on public.order_splits
  for all using (public.is_staff()) with check (public.is_staff());
create policy "split_items_staff" on public.split_items
  for all using (public.is_staff()) with check (public.is_staff());

-- Reparto: staff
create policy "delivery_routes_staff" on public.delivery_routes
  for all using (public.is_staff()) with check (public.is_staff());
create policy "delivery_tracking_staff" on public.delivery_tracking
  for all using (public.is_staff()) with check (public.is_staff());

-- Bitacora: staff inserta, admin lee
create policy "audit_log_insert_staff" on public.audit_log
  for insert with check (public.is_staff());
create policy "audit_log_read_admin" on public.audit_log
  for select using (public.is_admin());

-- Notificaciones: staff
create policy "notifications_staff" on public.notifications_log
  for all using (public.is_staff()) with check (public.is_staff());

-- Lealtad: dueno de la cuenta o admin
create policy "loyalty_accounts_own" on public.loyalty_accounts
  for select using (user_id = auth.uid() or public.is_admin());
create policy "loyalty_accounts_write_admin" on public.loyalty_accounts
  for all using (public.is_admin()) with check (public.is_admin());

create policy "loyalty_transactions_own" on public.loyalty_transactions
  for select using (
    exists (
      select 1 from public.loyalty_accounts a
      where a.id = loyalty_transactions.account_id
        and (a.user_id = auth.uid() or public.is_admin())
    )
  );
create policy "loyalty_transactions_write_admin" on public.loyalty_transactions
  for all using (public.is_admin()) with check (public.is_admin());
