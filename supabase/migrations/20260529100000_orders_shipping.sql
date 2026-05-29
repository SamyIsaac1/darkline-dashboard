alter table public.orders
  add column if not exists shipping_price numeric,
  add column if not exists shipping_included_in_total boolean not null default false;
