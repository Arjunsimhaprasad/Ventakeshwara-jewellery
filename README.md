# Venkateshwara Jewellery Platform

Production-grade, AI-powered luxury jewellery commerce platform with dual permission-separated experiences for **Customers** and **Store Admin/Owners**.

## Key Features

- **Luxury Customer Experience**:
  - Gold, Diamond, Polki, Solitaires & Gemstone Jewellery Collections.
  - Interactive 3D Orbit Viewer & Multi-Angle Drag Sprite fallback.
  - Reusable Cursor-Tracking Tilt Effect on Product Cards.
  - Wishlist, Cart & Server-Derived Checkout flow.
  - Real-time Order Tracking with timeline status visualizer.
  - Interactive Customer Support Ticket Portal.
  - Floating AI Jewellery Assistant for recommendations, side-by-side product comparisons, and styling advice powered by Google Gemini.

- **Store Admin & Owner Portal**:
  - Dense Dashboard with key KPIs (Revenue, Orders, Avg Order Value) & sales analytics chart.
  - Complete Product & Inventory Manager (Prices, Making charges, Stock count, Images, Categories).
  - Order Processing Hub (Status pipeline: `pending` → `confirmed` → `processing` → `shipped` → `delivered`).
  - Active Promotional Offers Manager.
  - Customer Directory & System Audit Logs.
  - AI Business Insights engine analyzing sales patterns, inventory metrics, and actionable recommendations.
  - AI Support Response Helper for rapid customer support resolution.

- **Security & Architecture**:
  - Express + TypeScript API server with Zod schema validation on every request.
  - Supabase PostgreSQL schema with Row Level Security (RLS) enforcement.
  - Strict 3-layer role authorization (`customer`, `staff`, `admin`, `owner`).
  - Server-only Gemini API integration (`@google/genai`). Zero API key leaks to frontend.

---

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts, Three.js / `@react-three/fiber` (Lazy-loaded 3D).
- **Backend**: Node.js, Express, TypeScript, Zod, JWT (`jsonwebtoken`), `bcryptjs`, Helmet, CORS, `@google/genai`.
- **Database**: Supabase PostgreSQL / Custom Migration & RLS.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm / yarn / pnpm

### Environment Setup

1. Copy `.env.example` to `.env` in root, `backend/.env`, and `frontend/.env`:
   ```bash
   cp .env.example .env
   ```

2. Populate `GEMINI_API_KEY` in `backend/.env` (Backend server-side only).

### Running Locally

1. **Install Backend Dependencies & Start Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Install Frontend Dependencies & Start App**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Testing Backend**:
   ```bash
   cd backend
   npm test
   ```

4. **Building Frontend Production Bundle**:
   ```bash
   cd frontend
   npm run build
   ```

---

## Folder Structure

```
venkateshwara-jewellery/
├── frontend/             # React + Vite + TS + Tailwind customer & admin UI
├── backend/              # Express + TS API server & Gemini AI backend service
├── supabase/             # Canonical PostgreSQL migrations (001_initial_schema.sql, seed.sql)
├── docs/                 # System architecture, DB schema, API & security documentation
├── AGENTS.md             # Core project constitution & standards
├── README.md
└── .env.example
```

---

## License

Private & Confidential - Proprietary to **Venkateshwara Jewellery**.
