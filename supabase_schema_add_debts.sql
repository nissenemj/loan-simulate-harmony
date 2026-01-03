-- Enable UUID extension if not already enabled (usually is in Supabase)
create extension if not exists "uuid-ossp";

-- 1. Table for storing Debts (Lainat ja Luottokortit)
create table public.debts (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  balance numeric(12, 2) not null check (balance >= 0),
  interest_rate numeric(5, 2) not null check (interest_rate >= 0),
  minimum_payment numeric(12, 2) not null check (minimum_payment >= 0),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  constraint debts_pkey primary key (id)
);

-- 2. Table for User Settings (Budget, Strategy)
create table public.user_settings (
  user_id uuid not null references public.profiles(id) on delete cascade,
  monthly_budget numeric(12, 2) default 0,
  selected_strategy text default 'avalanche' check (selected_strategy in ('avalanche', 'snowball', 'custom')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  constraint user_settings_pkey primary key (user_id)
);

-- 3. Enable Row Level Security (RLS)
alter table public.debts enable row level security;
alter table public.user_settings enable row level security;

-- 4. RLS Policies for Debts
-- Users can view their own debts
create policy "Users can view own debts"
  on public.debts for select
  using (auth.uid() = user_id);

-- Users can insert their own debts
create policy "Users can insert own debts"
  on public.debts for insert
  with check (auth.uid() = user_id);

-- Users can update their own debts
create policy "Users can update own debts"
  on public.debts for update
  using (auth.uid() = user_id);

-- Users can delete their own debts
create policy "Users can delete own debts"
  on public.debts for delete
  using (auth.uid() = user_id);

-- 5. RLS Policies for User Settings
create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);
