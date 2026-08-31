-- Migration: 002_gold_rates.sql
-- Description: Table, indexes, and RLS policies for tracking daily gold and silver metal rates.

create table daily_metal_rates (
  id uuid primary key default gen_random_uuid(),
  gold_24k_per_gram numeric(10,2) not null check (gold_24k_per_gram > 0),
  gold_22k_per_gram numeric(10,2) not null check (gold_22k_per_gram > 0),
  gold_18k_per_gram numeric(10,2) not null check (gold_18k_per_gram > 0),
  silver_per_gram numeric(10,2) not null check (silver_per_gram > 0),
  notes text,
  updated_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Index for ordering by recency
create index idx_daily_metal_rates_created_at on daily_metal_rates(created_at desc);

-- Enable RLS
alter table daily_metal_rates enable row level security;

-- RLS Policies
create policy "Daily metal rates viewable by everyone" on daily_metal_rates
  for select using (true);

create policy "Staff/Admin/Owner insert metal rates" on daily_metal_rates
  for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin', 'owner'))
  );

-- Seed initial metal rates
insert into daily_metal_rates (gold_24k_per_gram, gold_22k_per_gram, gold_18k_per_gram, silver_per_gram, notes)
values (7350.00, 6738.00, 5512.00, 88.00, 'Initial base rates for Venkateshwara Jewellery');
