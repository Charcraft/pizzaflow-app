-- Seed data for PizzaFlow development - Full schema
-- Run after migrations 001 and 002

-- Roles
insert into public.roles (name, description) values
  ('customer', 'Cliente final'),
  ('cajero', 'Cajero de mostrador'),
  ('mesero', 'Mesero de mesa'),
  ('cocinero', 'Personal de cocina'),
  ('repartidor', 'Repartidor a domicilio'),
  ('staff', 'Personal general'),
  ('admin', 'Administrador del sistema')
on conflict (name) do nothing;

-- Mesas físicas (4 mesas)
insert into public.tables (number, name, capacity, is_active) values
  (1, 'Mesa 1', 4, true),
  (2, 'Mesa 2', 4, true),
  (3, 'Mesa 3', 4, true),
  (4, 'Mesa 4', 6, true)
on conflict (number) do nothing;

-- Productos
insert into public.products (name, description, base_price_cents, category, sort_order, is_active) values
  ('Pizza Margarita', 'Salsa de tomate, mozzarella fresca y albahaca', 8500, 'pizza', 1, true),
  ('Pizza Pepperoni', 'Salsa de tomate, mozzarella y pepperoni', 9500, 'pizza', 2, true),
  ('Pizza Hawaiana', 'Salsa de tomate, mozzarella, jamón y piña', 9500, 'pizza', 3, true),
  ('Pizza Cuatro Quesos', 'Mozzarella, parmesano, gorgonzola y provolone', 10500, 'pizza', 4, true),
  ('Pizza Vegetariana', 'Salsa de tomate, mozzarella, champiñones, pimiento, aceitunas', 9500, 'pizza', 5, true),
  ('Refresco 600ml', 'Coca Cola, Sprite o Fanta', 2500, 'bebida', 1, true),
  ('Agua 500ml', 'Agua mineral', 1500, 'bebida', 2, true),
  ('Cerveza 355ml', 'Cerveza artesanal', 3500, 'bebida', 3, true),
  ('Queso Extra', 'Extra de mozzarella', 1500, 'extra', 1, true),
  ('Borde de Queso', 'Borde rebozado con queso', 2000, 'extra', 2, true),
  ('Alitas 6 piezas', 'Alitas BBQ', 7500, 'extra', 3, true)
on conflict do nothing;

-- Ingredientes
insert into public.ingredients (name, price_cents, is_vegetarian, is_vegan, allergen_info) values
  ('Masa de pizza', 0, true, true, null),
  ('Salsa de tomate', 0, true, true, null),
  ('Mozzarella', 0, true, false, 'Lácteos'),
  ('Pepperoni', 0, false, false, null),
  ('Jamón', 0, false, false, null),
  ('Piña', 0, true, true, null),
  ('Champiñones', 500, true, false, null),
  ('Aceitunas', 400, true, true, null),
  ('Pimiento', 300, true, true, null),
  ('Cebolla caramelizada', 400, true, true, null),
  ('Parmesano', 0, true, false, 'Lácteos'),
  ('Gorgonzola', 0, true, false, 'Lácteos'),
  ('Provolone', 0, true, false, 'Lácteos')
on conflict do nothing;

-- Inventario inicial
do $$
declare
  ing_id uuid;
begin
  select id into ing_id from public.ingredients where name = 'Masa de pizza';
  if ing_id is not null then
    insert into public.inventory (ingredient_id, quantity, min_quantity, unit)
    values (ing_id, 100, 20, 'kg')
    on conflict (ingredient_id) do nothing;
  end if;
end $$;

-- Variantes de pizza
do $$
declare
  pizza_id uuid;
begin
  for pizza_id in (select id from public.products where category = 'pizza') loop
    insert into public.product_variants (product_id, name, price_modifier_cents, sort_order)
    values
      (pizza_id, 'Pequeña', -2000, 1),
      (pizza_id, 'Mediana', 0, 2),
      (pizza_id, 'Grande', 3000, 3),
      (pizza_id, 'Familiar', 6000, 4)
    on conflict do nothing;
  end loop;
end $$;

-- Recetas básicas
do $$
declare
  prod_id uuid;
  rec_id uuid;
begin
  select id into prod_id from public.products where name = 'Pizza Margarita';
  if prod_id is not null then
    insert into public.recipes (product_id, name, is_active)
    values (prod_id, 'Receta Margarita', true)
    on conflict do nothing;
    select id into rec_id from public.recipes where product_id = prod_id;
    -- ingredientes se agregan manualmente si existen
  end if;
end $$;

-- Promociones ejemplo
insert into public.promotions (code, name, description, type, value, min_order_cents, is_active) values
  ('BIENVENIDO10', 'Descuento bienvenida', '10% de descuento en primera compra', 'percent', 10, 5000, true),
  ('2X1ALITAS', '2x1 Alitas', 'Compra 2 paquetes de alitas y paga 1', 'buy_x_get_y', 1, 0, true)
on conflict (code) do nothing;
