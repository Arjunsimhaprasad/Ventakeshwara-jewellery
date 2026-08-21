# Database Specification — Venkateshwara Jewellery Platform

## Custom ENUM Types
- `user_role`: `'customer'`, `'staff'`, `'admin'`, `'owner'`
- `order_status`: `'pending'`, `'confirmed'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`
- `support_status`: `'open'`, `'in_progress'`, `'resolved'`, `'closed'`
- `product_status`: `'active'`, `'inactive'`

## Tables Overview

- **`profiles`**: User details linked 1-to-1 with auth system. Stores name, phone, role, avatar.
- **`categories`**: Jewellery categories (Gold, Diamond, Polki, Solitaires, Gemstones, Platinum).
- **`products`**: Catalogue items with weight, purity, making charges, stone specs, price, stock, status, featured flag.
- **`product_images`**: High-resolution jewellery images with ordering.
- **`wishlists` & `wishlist_items`**: Customer wishlists.
- **`carts` & `cart_items`**: Customer active shopping carts.
- **`orders` & `order_items`**: Customer orders with shipping info and server-computed totals.
- **`offers`**: Promotional coupon codes and discounts.
- **`support_tickets`**: Customer inquiry tickets with staff assignment.
- **`ai_conversations` & `ai_messages`**: Chat history with Gemini AI assistant.
- **`notifications`**: Customer/admin notifications.
- **`audit_logs`**: System audit trail recording actor, action, entity, and metadata.

## Security & Row Level Security (RLS)

All tables have RLS enabled. Policy rules:
- `categories`, active `products`, active `offers`, and `product_images` are public read.
- `profiles`: Users can read/edit their own profile (role modification prohibited). Admin/Staff can read all profiles.
- `wishlists`, `carts`, `orders`, `support_tickets`, `ai_conversations`: Customers can only read/write their own records.
- `audit_logs`: Admin/Owner read-only access.
