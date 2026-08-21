# Venkateshwara Jewellery Platform — System Architecture

## Architecture Overview

```
                          ┌───────────────────────────┐
                          │   React 18 + Vite + TS    │
                          │   Tailwind + Motion UI    │
                          └─────────────┬─────────────┘
                                        │
                             HTTPS / JSON API Requests
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │   Express + TS API Server │
                          │ (Auth, RBAC, Zod Validate)│
                          └──────┬─────────────┬──────┘
                                 │             │
                    DB Queries   │             │ Server-Only SDK
                                 ▼             ▼
                   ┌──────────────────┐   ┌──────────────────────┐
                   │  Supabase RLS    │   │ Google Gemini AI API │
                   │  PostgreSQL DB   │   │   (@google/genai)    │
                   └──────────────────┘   └──────────────────────┘
```

### Layered Responsibilities

1. **Client Layer (`frontend/`)**:
   - Single Page Application (SPA) driven by React Router.
   - Separate experience routes: `/` (Customer App) and `/admin` (Store Admin/Owner Portal).
   - Card tilt interactions, scroll parallax, micro-interactions using Framer Motion.
   - Dynamic lazy-loaded Three.js product viewer with multi-angle image sprite fallback.

2. **Backend API Layer (`backend/`)**:
   - Express REST API written in TypeScript.
   - Enforces Zod schema validation on input parameters.
   - Enforces JWT authentication and 4-tier Role-Based Access Control (`customer`, `staff`, `admin`, `owner`).
   - Server-side price calculation during checkout (never trusts client prices/discounts).
   - Server-side rate limiting on auth and AI endpoints.

3. **Data Layer (`supabase/`)**:
   - Supabase PostgreSQL with custom ENUMs, triggers, and Row Level Security.
   - RLS policies ensure customers can only access their own orders, cart, wishlist, and tickets.

4. **AI Layer**:
   - Google Gemini API accessed strictly backend-only via `@google/genai`.
   - Structured JSON contracts enforced via Zod schema before sending responses to the client.
