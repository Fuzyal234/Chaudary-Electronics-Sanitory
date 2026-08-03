-- ============================================================================
--  Chaudhry Store — Supabase schema (products + staff roles + image storage)
--  Run this once in the Supabase dashboard → SQL Editor → New query → Run.
--  Safe to re-run (idempotent).
-- ============================================================================

-- ---------- Tables ----------------------------------------------------------

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'viewer' check (role in ('admin','ceo','editor','viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id                text primary key,
  name              text not null,
  category          text not null default '',
  subcategory       text,
  brand             text not null default '',
  price             numeric not null default 0,
  old_price         numeric,
  discount          int,
  rating            numeric not null default 0,
  reviews           int not null default 0,
  description       text not null default '',
  short_description text not null default '',
  specifications    jsonb not null default '{}'::jsonb,
  features          text[] not null default '{}',
  stock             int not null default 0,
  images            text[] not null default '{}',
  tags              text[] not null default '{}',
  is_new            boolean not null default false,
  is_featured       boolean not null default false,
  is_best_seller    boolean not null default false,
  is_trending       boolean not null default false,
  sku               text not null default '',
  weight            text,
  dimensions        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------- Role helpers (SECURITY DEFINER avoids RLS recursion) -------------

create or replace function public.is_editor() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()) in ('admin','ceo','editor'),
    false);
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()) in ('admin','ceo'),
    false);
$$;

-- ---------- Auto-create a profile on sign-up --------------------------------

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'viewer')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Keep products.updated_at fresh ----------------------------------

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------- Row-Level Security ----------------------------------------------

alter table public.products enable row level security;
alter table public.profiles enable row level security;

-- products: anyone can read; editors write; admins/CEO delete.
drop policy if exists "products read"   on public.products;
drop policy if exists "products insert" on public.products;
drop policy if exists "products update" on public.products;
drop policy if exists "products delete" on public.products;
create policy "products read"   on public.products for select using (true);
create policy "products insert" on public.products for insert with check (public.is_editor());
create policy "products update" on public.products for update using (public.is_editor()) with check (public.is_editor());
create policy "products delete" on public.products for delete using (public.is_admin());

-- profiles: read your own (admins read all); admins manage roles.
drop policy if exists "profiles read self"  on public.profiles;
drop policy if exists "profiles update self" on public.profiles;
drop policy if exists "profiles admin all"  on public.profiles;
create policy "profiles read self"  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles update self" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles admin all"  on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage bucket for product images -------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images read"   on storage.objects;
drop policy if exists "product images insert" on storage.objects;
drop policy if exists "product images update" on storage.objects;
drop policy if exists "product images delete" on storage.objects;
create policy "product images read"   on storage.objects for select using (bucket_id = 'product-images');
create policy "product images insert" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_editor());
create policy "product images update" on storage.objects for update using (bucket_id = 'product-images' and public.is_editor());
create policy "product images delete" on storage.objects for delete using (bucket_id = 'product-images' and public.is_editor());

-- ---------- Realtime (live catalog updates across all clients) --------------

do $$ begin
  alter publication supabase_realtime add table public.products;
exception when duplicate_object then null; end $$;

-- ============================================================================
--  AFTER RUNNING THIS:
--  1) In the app, go to /admin/login and "Create a staff account".
--  2) Promote yourself to admin (replace the email):
--        update public.profiles set role = 'admin' where email = 'you@chaudhry.pk';
--  3) Sign in to /admin and click "Import starter catalog" to seed the 70 products.
--
--  Tip: To skip email confirmation for staff, disable it under
--       Authentication → Providers → Email → "Confirm email".
-- ============================================================================
