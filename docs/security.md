# Security Architecture & Rules — Venkateshwara Jewellery Platform

## Core Principles

1. **Zero Secret Leaks to Frontend**: `GEMINI_API_KEY`, `SUPABASE_SECRET_KEY`, and `JWT_SECRET` must never exist in the `frontend/` directory or Vite runtime variables.
2. **Three-Layer Authorization**:
   - Backend Express Route Middleware (`authenticate`, `requireRole`).
   - Database Row Level Security (RLS) on PostgreSQL tables.
   - Supabase storage & bucket policies.
3. **No Unvalidated Client Claims**:
   - Total checkout price is ALWAYS calculated server-side based on database product prices, tax, making charges, and validated active coupon discount percentages.
   - Product quantities are validated server-side against stock levels.
   - Role updates are forbidden for customer profile endpoints.
4. **Rate Limiting**:
   - `/api/auth/*` rate limited to prevent brute force attacks.
   - `/api/ai/*` rate limited to prevent API abuse.
5. **Request Validation**:
   - All inbound payloads validated via strict Zod schemas before hitting business logic.
6. **Gemini Safety & Privacy**:
   - No passwords, tokens, or payment details sent to Gemini.
   - Output parsed and verified against database entity IDs before returning recommendations or comparison results to the client.
