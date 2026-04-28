# SupplySense AI — Supply Chain Delay Prediction

## Overview
A React + Vite frontend with an Express + TypeScript backend that predicts supply chain delays, optimizes routes, and surfaces alerts. Optional integrations: Supabase (data persistence), Google Maps (map view), OpenAI (AI consultant), OpenWeather. Without these credentials the backend falls back to in-memory data and the corresponding UI features are disabled or show "not configured".

## Project Layout
- `src/` — Vite + React + TypeScript frontend (Tailwind v4, MUI, Radix, motion)
  - `src/main.tsx` — entrypoint
  - `src/app/App.tsx` — main app
  - `src/app/services/api.ts` — API client (uses `/api` by default; override with `VITE_API_URL`)
- `backend/` — Express + TypeScript backend
  - `backend/server.ts` — main server
  - `backend/routes/` — REST routes (`/api/shipments`, `/api/predictions`, `/api/routes`, `/api/alerts`, `/api/analytics`, `/api/weather`, `/api/config`, `/api/ai`)
  - `backend/data/` — unified store (Supabase or in-memory)
  - `backend/services/` — OpenAI, weather, maps, analytics
- `vite.config.ts` — Vite config (host `0.0.0.0`, port `5000`, proxies `/api`, `/health`, `/debug` to backend on `3001`)

## Replit Setup
- **Frontend workflow** (`Frontend`): `npm run dev` → port `5000` (webview). Vite is configured with `allowedHosts: true` to work behind the Replit proxy.
- **Backend workflow** (`Backend`): `cd backend && npx ts-node server.ts` → port `3001` (console). Bound to all interfaces via Express default; the frontend reaches it via the Vite dev proxy.
- The frontend calls `/api` by default, which the dev proxy forwards to `http://localhost:3001`.

## Environment Variables (optional)
None are required to run. To enable optional features set:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `OPENWEATHER_API_KEY`
- `FRONTEND_URL` (extra CORS origins, comma separated)

## Deployment
Configured as **Autoscale**:
- Build: `npm run build && cd backend && npx tsc`
- Run: `cd backend && node dist/server.js`
- The compiled backend serves the built frontend from `dist/` and listens on `process.env.PORT`.
