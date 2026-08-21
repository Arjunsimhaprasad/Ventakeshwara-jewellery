# API Documentation — Venkateshwara Jewellery Platform

## Base URL
`/api`

## Endpoints

### Auth
- `POST /api/auth/register` — Register a customer account
- `POST /api/auth/login` — Authenticate and receive JWT cookie/token
- `POST /api/auth/logout` — Invalidate session
- `GET /api/auth/me` — Fetch current user profile

### Products & Categories
- `GET /api/products` — List active products (Filters: category, material, purity, minPrice, maxPrice, search, sort)
- `GET /api/products/:id` — Get product detail with images and specs
- `POST /api/products` — [Staff|Admin|Owner] Create product
- `PATCH /api/products/:id` — [Staff|Admin|Owner] Update product specs/stock
- `DELETE /api/products/:id` — [Admin|Owner] Soft/hard delete product
- `GET /api/categories` — List active categories
- `POST /api/categories` — [Admin|Owner] Create category
- `PATCH /api/categories/:id` — [Admin|Owner] Update category
- `DELETE /api/categories/:id` — [Admin|Owner] Delete category

### Cart & Wishlist
- `GET /api/cart` — Fetch customer cart with live calculations
- `POST /api/cart/items` — Add product to cart
- `PATCH /api/cart/items/:id` — Update quantity
- `DELETE /api/cart/items/:id` — Remove item from cart
- `DELETE /api/cart` — Clear cart
- `GET /api/wishlist` — Fetch customer wishlist
- `POST /api/wishlist/items` — Add product to wishlist
- `DELETE /api/wishlist/items/:productId` — Remove product from wishlist

### Orders & Checkout
- `POST /api/orders` — Checkout cart, re-deriving prices server-side
- `GET /api/orders` — List user orders (or all orders for staff/admin)
- `GET /api/orders/:id` — Get order detail
- `PATCH /api/orders/:id/status` — [Staff|Admin|Owner] Update order status (`pending` -> `delivered`)

### Customers
- `GET /api/customers` — [Staff|Admin|Owner] Customer directory
- `GET /api/customers/:id` — [Staff|Admin|Owner] Customer profile & order history
- `PATCH /api/customers/:id` — [Admin|Owner] Update customer account details

### Support
- `POST /api/support/tickets` — Create support ticket
- `GET /api/support/tickets` — List support tickets
- `GET /api/support/tickets/:id` — View ticket details & message thread
- `PATCH /api/support/tickets/:id` — [Staff|Admin|Owner] Update status / assign staff

### Offers
- `GET /api/offers` — List active offers
- `POST /api/offers` — [Admin|Owner] Create offer code
- `PATCH /api/offers/:id` — [Admin|Owner] Update offer
- `DELETE /api/offers/:id` — [Admin|Owner] Delete offer

### Analytics & AI
- `GET /api/analytics/dashboard` — [Admin|Owner] Executive KPIs & sales trends
- `POST /api/ai/chat` — Gemini AI customer jewellery assistant
- `POST /api/ai/recommend` — Gemini AI product recommendations
- `POST /api/ai/compare` — Gemini AI product side-by-side comparison
- `POST /api/ai/business-insights` — [Admin|Owner] Gemini AI store analytics & recommendations
- `POST /api/ai/support-assistant` — [Staff|Admin|Owner] Gemini AI support response draft generator
