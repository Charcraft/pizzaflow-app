-- Seed data for PizzaFlow development
-- Run after migrations

-- Insert sample products
insert into public.products (name, description, base_price_cents, category, sort_order, is_active)
values
  ('Pizza Margarita', 'Salsa de tomate, mozzarella fresca y albahaca', 8500, 'pizza', 1, true),
  ('Pizza Pepperoni', 'Salsa de tomate, mozzarella y pepperoni', 9500, 'pizza', 2, true),
  ('Pizza Hawaiana', 'Salsa de tomate, mozzarella, jamón y piña', 9500, 'pizza', 3, true),
  ('Pizza Cuatro Quesos', 'Mozzarella, parmesano, gorgonzola y provolone', 10500, 'pizza', 4, true),
  ('Refresco 600ml', 'Coca Cola, Sprite o Fanta', 2500, 'bebida', 1, true),
  ('Agua 500ml', 'Agua mineral', 1500, 'bebida', 2, true),
  ('Queso Extra', 'Extra de mozzarella', 1500, 'extra', 1, true),
  ('Borde de Queso', 'Borde rebozado con queso', 2000, 'extra', 2, true)
on conflict do nothing;

-- Variants for pizzas
do $$
declare
  pizza_id uuid;
begin
  select id into pizza_id from public.products where name = 'Pizza Margarita';
  if pizza_id is not null then
    insert into public.product_variants (product_id, name, price_modifier_cents, sort_order)
    values
      (pizza_id, 'Pequeña', -2000, 1),
      (pizza_id, 'Mediana', 0, 2),
      (pizza_id, 'Grande', 3000, 3),
      (pizza_id, 'Familiar', 6000, 4)
    on conflict do nothing;
  end if;
end $$;

-- Languages for other products (if they exist)
-- Ingredients sample
insert into public.ingredients (name, price_cents, is_vegetarian, is_vegan)
values
  ('Champiñones', 500, true, false),
  ('Aceitunas', 400, true, true),
  ('Pimiento', 300, true, true),
  ('Cebolla caramelizada', 400, true, true)
on conflict do nothing;
