-- ========================================================
-- Venkateshwara Jewellery Platform - Complete Database Setup
-- Run this script once in your Supabase Dashboard SQL Editor
-- ========================================================

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

-- Daily Metal Rates Table
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
create index idx_daily_metal_rates_created_at on daily_metal_rates(created_at desc);

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
alter table daily_metal_rates enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table offers enable row level security;

-- RLS Policies
create policy "Categories are viewable by everyone" on categories for select using (is_active = true);
create policy "Active products are viewable by everyone" on products for select using (status = 'active');
create policy "Product images are viewable by everyone" on product_images for select using (true);
create policy "Active offers are viewable by everyone" on offers for select using (is_active = true);
create policy "Daily metal rates viewable by everyone" on daily_metal_rates for select using (true);

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile name/phone" on profiles for update using (auth.uid() = id);
create policy "Staff/Admin/Owner full profile access" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin', 'owner'))
);

create policy "Users manage own wishlist" on wishlists for all using (auth.uid() = user_id);
create policy "Users manage own wishlist items" on wishlist_items for all using (
  exists (select 1 from wishlists where wishlists.id = wishlist_items.wishlist_id and wishlists.user_id = auth.uid())
);
create policy "Users manage own cart" on carts for all using (auth.uid() = user_id);
create policy "Users manage own cart items" on cart_items for all using (
  exists (select 1 from carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);

create policy "Users view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users view own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Staff/Admin/Owner full order access" on orders for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin', 'owner'))
);

create policy "Users view and create own support tickets" on support_tickets for all using (auth.uid() = user_id);
create policy "Staff/Admin/Owner full support ticket access" on support_tickets for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin', 'owner'))
);

create policy "Users view and manage own AI conversations" on ai_conversations for all using (auth.uid() = user_id);
create policy "Users view and manage own AI messages" on ai_messages for all using (
  exists (select 1 from ai_conversations where ai_conversations.id = ai_messages.conversation_id and ai_conversations.user_id = auth.uid())
);

create policy "Admin/Owner view audit logs" on audit_logs for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'owner'))
);

create policy "Staff/Admin/Owner insert metal rates" on daily_metal_rates for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin', 'owner'))
);

-- Seed Categories
insert into categories (id, name, slug, description, image_url, is_active) values
('c0000000-0000-0000-0000-000000000001', 'Gold Jewellery', 'gold-jewellery', 'Exquisite 22k and 18k handcrafted gold necklaces, bangles, and rings.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000002', 'Diamond Elegance', 'diamond-elegance', 'VVS1 certified solitaire diamond rings, earrings, and pendants.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000003', 'Polki & Heritage', 'polki-heritage', 'Uncut diamonds embedded in traditional Kundan gold setting.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000004', 'Royal Gemstones', 'royal-gemstones', 'Natural Rubies, Emeralds, and Sapphires accented with brilliant diamonds.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', true);

-- Seed Products
insert into products (id, category_id, name, slug, sku, description, material, jewellery_type, weight_grams, purity, making_charges, stone_information, price, discount_percentage, stock_quantity, status, is_featured) values
('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Royal Temple Lakshmi Necklace', 'royal-temple-lakshmi-necklace', 'VJ-GOLD-NK-001', 'Handcrafted 22K yellow gold temple necklace featuring intricate Goddess Lakshmi motif with hanging ghungroo beads.', 'Gold', 'Necklace', 48.500, '22K (916)', 12500.00, 'Natural Rubies and Emerald accents', 345000.00, 5.00, 3, 'active', true),
('f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Eternal Radiance Solitaire Ring', 'eternal-radiance-solitaire-ring', 'VJ-DIA-RN-002', 'Classic 18K white gold solitaire ring featuring a brilliant cut 1.5-carat VVS1 F-color natural diamond.', 'White Gold & Diamond', 'Ring', 6.200, '18K (750)', 4500.00, '1.5 Carat VVS1 F-Color Certified Diamond', 285000.00, 0.00, 5, 'active', true),
('f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Heritage Emerald Kundan Choker', 'heritage-emerald-kundan-choker', 'VJ-POLKI-CK-003', 'Traditional Mughal-inspired Polki choker necklace set in 22K hallmarked gold with Zambian emerald drops.', 'Gold & Polki', 'Choker', 65.000, '22K (916)', 24000.00, 'Uncut Diamonds (Polki) & Zambian Emeralds', 520000.00, 8.00, 2, 'active', true),
('f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'Celestial Sapphire Earrings', 'celestial-sapphire-earrings', 'VJ-GEM-ER-004', 'Royal blue Ceylon sapphire drop earrings surrounded by a halo of round brilliant diamonds.', 'Rose Gold & Gemstone', 'Earrings', 12.800, '18K (750)', 6000.00, '4.2 Carats Natural Ceylon Sapphires & 0.8 Carat Diamonds', 195000.00, 0.00, 4, 'active', true),
('f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'Venkateshwara Classic Gold Bangle Set', 'classic-gold-bangle-set', 'VJ-GOLD-BG-005', 'Pair of handcrafted 22K yellow gold bangles with intricate floral filigree engraving.', 'Gold', 'Bangles', 34.200, '22K (916)', 8500.00, 'Solid Hallmarked Gold', 242000.00, 3.00, 8, 'active', false);

-- Seed Product Images
insert into product_images (product_id, image_url, alt_text, sort_order) values
('f0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 'Royal Temple Lakshmi Necklace Front View', 0),
('f0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', 'Royal Temple Lakshmi Necklace Detail', 1),
('f0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 'Eternal Radiance Solitaire Ring Main View', 0),
('f0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 'Heritage Emerald Kundan Choker Main View', 0),
('f0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', 'Celestial Sapphire Earrings Front', 0);

-- Seed Offers
insert into offers (id, title, description, code, discount_percentage, is_active) values
('e0000000-0000-0000-0000-000000000001', 'Royal Festal Offer', 'Enjoy 10% off on all Temple Gold collections', 'ROYAL10', 10.00, true),
('e0000000-0000-0000-0000-000000000002', 'Welcome Luxury Gift', '5% flat discount on Solitaire purchases', 'WELCOMEVJ', 5.00, true);

-- Seed Metal Rates
insert into daily_metal_rates (gold_24k_per_gram, gold_22k_per_gram, gold_18k_per_gram, silver_per_gram, notes)
values (7350.00, 6738.00, 5512.00, 88.00, 'Initial base rates for Venkateshwara Jewellery');
