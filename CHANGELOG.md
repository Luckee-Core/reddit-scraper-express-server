# Changelog

## 0.1.0 — 2026-10

Initial open-source release of the Reddit Scraper Express Server.

- `POST /api/services/get-reddit-thread-data` — Apify Reddit Scraper Lite proxy (thread + listing modes)
- Server-to-server auth via `x-scraper-api-key`
- Health endpoints with standard `{ success, data }` JSON envelope
- `GET /api-docs.json` machine-readable API catalog
- `GET /docs` human-readable API reference (archetype A)
- Shared HTTP response helpers (`sendSuccess`, `sendHandlerError`)
- OSS docs: LICENSE, CONTRIBUTING, SECURITY, production hardening guide
- CI: typecheck, build, npm audit
