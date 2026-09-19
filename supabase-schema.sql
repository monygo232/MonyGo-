-- MonyGo V11 starter schema
create extension if not exists pgcrypto;
create table if not exists public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 name text, referral_code text unique, points integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.videos(
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, description text, storage_path text, tiktok_post_id text, status text not null default 'draft',
 created_at timestamptz not null default now()
);
create table if not exists public.promote_orders(
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 video_id uuid references public.videos(id) on delete set null, package_ks integer not null,
 status text not null default 'pending_payment', provider_reference text, created_at timestamptz not null default now()
);
create table if not exists public.wallet_ledger(
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 points integer not null, type text not null, reference_id uuid, created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.promote_orders enable row level security;
alter table public.wallet_ledger enable row level security;
create policy "profiles own select" on public.profiles for select using (auth.uid()=id);
create policy "profiles own update" on public.profiles for update using (auth.uid()=id);
create policy "videos own select" on public.videos for select using (auth.uid()=user_id);
create policy "videos own insert" on public.videos for insert with check (auth.uid()=user_id);
create policy "videos own update" on public.videos for update using (auth.uid()=user_id);
create policy "orders own select" on public.promote_orders for select using (auth.uid()=user_id);
create policy "orders own insert" on public.promote_orders for insert with check (auth.uid()=user_id);
create policy "ledger own select" on public.wallet_ledger for select using (auth.uid()=user_id);
-- Create a Storage bucket named "videos" in Supabase Storage and add appropriate RLS policies there.
