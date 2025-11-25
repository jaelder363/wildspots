# WildSpots

A mobile-first, community-driven platform for discovering and sharing camping sites. Users can upload photos, add reviews, tag wildlife, rate remoteness, filter by terrain and price, and verify profiles for trust and authenticity.

## Monorepo Layout

- client/  — React PWA (local dev: Vite)
- api/     — Express API (local dev: Node)
- supabase/ — SQL migrations + seeds
- docs/    — PRD, strategy, feature chart, annotated user stories, usage contexts

## Getting Started (Local)

1. Prerequisites
   - Node.js LTS
   - pnpm or npm
   - Supabase CLI (optional for local DB)

2. Install and run workspaces (commands will be added as code is scaffolded):
   - client: Vite dev server
   - api: Node/Express server
   - supabase: run migrations and seeds

## Architecture Notes

- Mobile-first PWA frontend (React + Vite), offline-friendly
- REST API (Express) with auth middleware
- Postgres via Supabase (SQL migrations + seed data)
- Monorepo with clear separation of concerns
