alter table public.orders
  add column if not exists shipping_price numeric,
  add column if not exists shipping_paid boolean not null default false;
