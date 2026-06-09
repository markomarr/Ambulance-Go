-- ============================================================
-- MedRide / Ambulance Go — Database Schema
-- Jalankan di Supabase SQL Editor (Settings → SQL Editor)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ENUM TYPES
-- ────────────────────────────────────────────────────────────
create type service_type_enum as enum ('REGULER', 'ICU');

create type order_status_enum as enum (
  'PENDING',
  'CONFIRMED',
  'ON_THE_WAY',
  'ARRIVED',
  'COMPLETED',
  'CANCELLED'
);

create type payment_method_enum as enum (
  'CREDIT_CARD',
  'DIGITAL_WALLET',
  'BANK_TRANSFER'
);

create type payment_status_enum as enum ('UNPAID', 'PAID');

-- ────────────────────────────────────────────────────────────
-- 2. TABLES
-- ────────────────────────────────────────────────────────────

-- profiles: extends auth.users; auto-created via trigger on signup
create table if not exists profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  name        text        not null,
  phone       text        not null unique,
  email       text,
  address     text,
  settings    jsonb       not null default '{"dark_mode":false,"push_notifications":true,"location_tracking":true}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- drivers: seeded manually via Supabase Studio; updated by simulation script
create table if not exists drivers (
  id              uuid              primary key default gen_random_uuid(),
  name            text              not null,
  phone           text              not null,
  license_plate   text              not null,
  ambulance_type  service_type_enum not null,
  current_lat     float,
  current_lng     float,
  is_available    boolean           not null default true,
  created_at      timestamptz       not null default now(),
  updated_at      timestamptz       not null default now()
);

-- orders: created by users; driver assigned via studio for demo
create table if not exists orders (
  id                   uuid                  primary key default gen_random_uuid(),
  order_number         text                  not null unique,
  user_id              uuid                  not null references profiles(id) on delete cascade,
  pickup_address       text                  not null,
  pickup_lat           float,
  pickup_lng           float,
  destination_address  text                  not null,
  service_type         service_type_enum     not null,
  status               order_status_enum     not null default 'PENDING',
  driver_id            uuid                  references drivers(id) on delete set null,
  estimated_cost       integer               not null,
  final_cost           integer,
  payment_method       payment_method_enum,
  payment_status       payment_status_enum   not null default 'UNPAID',
  eta_minutes          integer,
  created_at           timestamptz           not null default now(),
  updated_at           timestamptz           not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 3. FUNCTIONS & TRIGGERS
-- ────────────────────────────────────────────────────────────

-- Auto-update updated_at on any UPDATE
create or replace function set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

create trigger drivers_updated_at
  before update on drivers
  for each row execute procedure set_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute procedure set_updated_at();

-- Generate order_number: AMB{YYYYMMDD}{3-digit sequence}
create or replace function generate_order_number()
returns text
language plpgsql as $$
declare
  v_date text;
  v_seq  integer;
begin
  v_date := to_char(now() at time zone 'Asia/Jakarta', 'YYYYMMDD');
  select coalesce(count(*), 0) + 1
    into v_seq
    from orders
   where created_at::date = current_date;
  return 'AMB' || v_date || lpad(v_seq::text, 3, '0');
end;
$$;

-- Trigger: set order_number before insert if empty
create or replace function set_order_number()
returns trigger
language plpgsql as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := generate_order_number();
  end if;
  return new;
end;
$$;

create trigger orders_set_number
  before insert on orders
  for each row execute procedure set_order_number();

-- Trigger: auto-create profile row when user registers via Supabase Auth
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public as $$
begin
  insert into public.profiles (id, name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Pengguna Baru'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table orders   enable row level security;
alter table drivers  enable row level security;

-- profiles: user hanya bisa akses profil sendiri
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

-- orders: user hanya bisa akses order sendiri
create policy "orders_select_own"
  on orders for select
  using (auth.uid() = user_id);

create policy "orders_insert_own"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "orders_update_own"
  on orders for update
  using (auth.uid() = user_id);

-- drivers: semua authenticated user bisa read (untuk tracking)
create policy "drivers_select_authenticated"
  on drivers for select
  to authenticated
  using (true);

-- ────────────────────────────────────────────────────────────
-- 5. REALTIME
-- Aktifkan Realtime untuk tabel drivers agar TrackingScreen
-- dapat subscribe ke perubahan current_lat / current_lng
-- ────────────────────────────────────────────────────────────
alter publication supabase_realtime add table drivers;
alter publication supabase_realtime add table orders;
