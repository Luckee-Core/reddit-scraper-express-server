# OSS release status (Reddit Scraper Express Server)

Scored against mentorai-server [`oss-release-readiness-checklist.md`](https://github.com/trouthouse-tech/mentorai-server/blob/main/data/open-source/oss-release-readiness-checklist.md) — **Express-only** archetype.

**Overall:** Ship with debt (v0.1.0)

## Passed (highlights)

| Area | Status |
|------|--------|
| LICENSE / CONTRIBUTING / SECURITY / CHANGELOG | Root files present |
| README + governance link + threat model | Root README |
| `.env.example` | `PORT`, `NODE_ENV`, `APIFY_API_TOKEN`, `SCRAPER_API_KEY`, `PUBLIC_API_URL` |
| Express ADR alignment | `src/services/` thin routers, handlers, `processX()` |
| API docs archetype A | `GET /api-docs.json` + `GET /docs` |
| CI (typecheck, build, audit) | `.github/workflows/ci.yml` |
| Lockfile committed | `package-lock.json` |
| Production hardening doc | `docs/production-hardening.md` |

## Fork exceptions

| Item | Notes |
|------|-------|
| Layout | `src/services/` only — no `src/data/`, no Supabase |
| `/api/data` | Not used — ADR 009 N/A |
| Managed clients | No `getManagedSupabaseClient` / Anthropic — Apify via `fetch` in `processGetRedditThreadData` |
| Auth | API key on scrape route only — not “open” like QR generate |

## §4 codebase shape (this repo only)

| Row | Result |
|-----|--------|
| 4.1 Router factory + processX | Pass |
| 4.2–4.3, 4.6 | N/A (no `/api/data`) |
| 4.4 Managed clients | N/A (Apify env in process) |
| 4.5 Envelope + logging | Pass (health + scrape) |
| 4.7 Dev auth bypass | N/A |

## Open debt (non-blocking for first tag)

| Item | Notes |
|------|-------|
| `CODE_OF_CONDUCT.md` | Added (Contributor Covenant link) |
| GitHub private advisories | Enable in repo settings (manual) |
| Rate limit on scrape route | Documented in production-hardening; not implemented |
| Bind `127.0.0.1` in dev examples | Recommended in hardening doc |
| 404 JSON includes `message` field | Minor drift from strict ADR 006 |

## Security audit notes (summary)

- **Threat model:** trusted backends + API key; Apify cost if key leaks.
- **CORS:** permissive `cors()` — tighten for production.
- **No Anthropic** in this repo.

Last updated: 2026-10 (v0.1.0 OSS release prep).
