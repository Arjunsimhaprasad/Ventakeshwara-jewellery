-- Migration: 001_initial_schema.sql
-- Description: Initial schema for Venkateshwara Jewellery Platform with ENUMs, Tables, Triggers, Indexes, and RLS Policies.

create extension if not exists "pgcrypto";

-- Custom ENUM Types
create type user_role as enum ('customer','staff','admin','owner');
create type order_status as enum ('pending','confirmed','processing','shipped','delivered','cancelled');
create type support_status as enum ('open','in_progress','resolved','closed');
create type product_status as enum ('active','inactive');

-- Profiles Table
create table profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  role user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Categories Table
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products Table
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  sku text not null unique,
  description text,
  material text,
  jewellery_type text,
  weight_grams numeric(12,3),
  purity text,
  making_charges numeric(12,2) not null default 0,
  stone_information text,
  price numeric(14,2) not null check (price >= 0),
  discount_percentage numeric(5,2) not null default 0 check (discount_percentage >= 0 and discount_percentage <= 100),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  status product_status not null default 'active',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Product Images Table
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Wishlists Table
create table wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id)
);

-- Wishlist Items Table
create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references wishlists(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(wishlist_id, product_id)
);

-- Carts Table
create table carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Cart Items Table
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique(cart_id, product_id)
);

-- Orders Table
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete restrict,
  order_number text not null unique,
  status order_status not null default 'pending',
  subtotal numeric(14,2) not null check (subtotal >= 0),
  discount_amount numeric(14,2) not null default 0 check (discount_amount >= 0),
  total_amount numeric(14,2) not null check (total_amount >= 0),
  shipping_name text not null,
  shipping_phone text not null,
  shipping_address text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order Items Table
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  sku text,
  unit_price numeric(14,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  subtotal numeric(14,2) not null check (subtotal >= 0)
);

-- Offers Table
create table offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  code text unique,
  discount_percentage numeric(5,2) check (discount_percentage >= 0 and discount_percentage <= 100),
  start_at timestamptz,
  end_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Support Tickets Table
create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  subject text not null,
  category text not null,
  message text not null,
  status support_status not null default 'open',
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AI Conversations Table
create table ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AI Messages Table
create table ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Notifications Table
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Audit Logs Table
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_products_category on products(category_id);
create index idx_products_status on products(status);
create index idx_products_featured on products(is_featured);
create index idx_orders_user on orders(user_id);
create index idx_orders_status on orders(status);
create index idx_order_items_order on order_items(order_id);
create index idx_support_user on support_tickets(user_id);
create index idx_support_status on support_tickets(status);
create index idx_ai_conversations_user on ai_conversations(user_id);
create index idx_ai_messages_conversation on ai_messages(conversation_id);
create index idx_notifications_user on notifications(user_id);
create index idx_audit_logs_actor on audit_logs(actor_id);

-- Automated updated_at Function & Triggers
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles for each row execute function update_updated_at_column();
create trigger update_categories_updated_at before update on categories for each row execute function update_updated_at_column();
create trigger update_products_updated_at before update on products for each row execute function update_updated_at_column();
create trigger update_carts_updated_at before update on carts for each row execute function update_updated_at_column();
create trigger update_orders_updated_at before update on orders for each row execute function update_updated_at_column();
create trigger update_offers_updated_at before update on offers for each row execute function update_updated_at_column();
create trigger update_support_tickets_updated_at before update on support_tickets for each row execute function update_updated_at_column();
create trigger update_ai_conversations_updated_at before update on ai_conversations for each row execute function update_updated_at_column();

-- Enable Row Level Security
alter table profiles enable row level security;
alter table wishlists enable row level security;
alter table wishlist_items enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table support_tickets enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

-- Public Read Policies for Catalog
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table offers enable row level security;

create policy "Categories are viewable by everyone" on categories for select using (is_active = true);
create policy "Active products are viewable by everyone" on products for select using (status = 'active');
create policy "Product images are viewable by everyone" on product_images for select using (true);
create policy "Active offers are viewable by everyone" on offers for select using (is_active = true);

-- Profiles RLS
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile name/phone" on profiles for update using (auth.uid() = id);
create policy "Staff/Admin/Owner full profile access" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin', 'owner'))
);

-- Wishlist & Cart RLS
create policy "Users manage own wishlist" on wishlists for all using (auth.uid() = user_id);
create policy "Users manage own wishlist items" on wishlist_items for all using (
  exists (select 1 from wishlists where wishlists.id = wishlist_items.wishlist_id and wishlists.user_id = auth.uid())
);
create policy "Users manage own cart" on carts for all using (auth.uid() = user_id);
create policy "Users manage own cart items" on cart_items for all using (
  exists (select 1 from carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);

-- Orders RLS
create policy "Users view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users view own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Staff/Admin/Owner full order access" on orders for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin', 'owner'))
);

-- Support Tickets RLS
create policy "Users view and create own support tickets" on support_tickets for all using (auth.uid() = user_id);
create policy "Staff/Admin/Owner full support ticket access" on support_tickets for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin', 'owner'))
);

-- AI Conversations RLS
create policy "Users view and manage own AI conversations" on ai_conversations for all using (auth.uid() = user_id);
create policy "Users view and manage own AI messages" on ai_messages for all using (
  exists (select 1 from ai_conversations where ai_conversations.id = ai_messages.conversation_id and ai_conversations.user_id = auth.uid())
);

-- Audit Logs RLS
create policy "Admin/Owner view audit logs" on audit_logs for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'owner'))
);
