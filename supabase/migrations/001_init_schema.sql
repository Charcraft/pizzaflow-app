-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Profiles (Supabase Auth + extended profile)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  phone text,
  role text default 'customer' check (role in ('customer', 'staff', 'admin')),
  created_at timestamptz default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  base_price_cents int not null,
  image_url text,
  category text not null check (category in ('pizza', 'bebida', 'extra')),
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Product variants
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  price_modifier_cents int default 0,
  sort_order int default 0
);

-- Ingredients
create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents int default 0,
  is_vegetarian boolean default false,
  is_vegan boolean default false,
  allergen_info text
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number int generated always as identity,
  source text not null check (source in ('web', 'counter')),
  status text not null default 'pending' check (status in ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  customer_id uuid references public.profiles(id),
  customer_name text,
  customer_phone text,
  pickup_time timestamptz,
  subtotal_cents int not null,
  discount_cents int default 0,
  total_cents int not null,
  payment_method text check (payment_method in ('cash', 'card', 'transfer', 'pending')),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  quantity int not null default 1,
  unit_price_cents int not null,
  total_price_cents int not null,
  customizations jsonb default '{}',
  notes text
);

-- Promotions
create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  type text not null check (type in ('percent', 'fixed', 'buy_x_get_y')),
  value int not null,
  min_order_cents int default 0,
  max_uses int,
  used_count int default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean default true
);

-- Analytics events
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  session_id text,
  user_id uuid references public.profiles(id),
  properties jsonb default '{}',
  page_url text,
  created_at timestamptz default now()
);

-- User feedback
create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  user_id uuid references public.profiles(id),
  rating int check (rating between 1 and 5),
  reason text,
  comment text,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_orders_status_created on public.orders(status, created_at desc);
create index if not exists idx_orders_source_date on public.orders(source, created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_analytics_event_name_date on public.analytics_events(event_name, created_at desc);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.ingredients enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.promotions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.user_feedback enable row level security;

-- Helper function for RLS
create or replace function public.is_admin() returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Profiles policies
create policy "profiles_read_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- Products policies (public read)
create policy "products_read" on public.products
  for select using (is_active = true or public.is_admin());

create policy "products_write_admin" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- Orders policies
create policy "orders_read_own_or_staff" on public.orders
  for select using (
    customer_id = auth.uid() or public.is_admin() or exists (
      select 1 from public.profiles where id = auth.uid() and role in ('staff', 'admin')
    )
  );

create policy "orders_insert" on public.orders
  for insert with check (
    customer_id = auth.uid() or customer_id is null or public.is_admin() or exists (
      select 1 from public.profiles where id = auth.uid() and role in ('staff', 'admin')
    )
  );

create policy "orders_update_staff" on public.orders
  for update using (public.is_admin() or exists (
    select 1 from public.profiles where id = auth.uid() and role in ('staff', 'admin')
  ));

-- Order items policies
create policy "order_items_read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (
        o.customer_id = auth.uid() or public.is_admin() or exists (
          select 1 from public.profiles where id = auth.uid() and role in ('staff', 'admin')
        )
      )
    )
  );

create policy "order_items_insert" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (
        o.customer_id = auth.uid() or public.is_admin() or exists (
          select 1 from public.profiles where id = auth.uid() and role in ('staff', 'admin')
        )
      )
    )
  );
