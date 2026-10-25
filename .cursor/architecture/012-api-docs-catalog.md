# 012 – API docs catalog (`/api-docs.json`)

## Status

Accepted

## Context

The Reddit scraper Express server exposes health probes, Apify proxy scrape, and API documentation at `GET /api-docs.json` (JSON) and `GET /docs` (HTML). No OpenAPI or third-party doc tools.

This is an **Express-only** (archetype A) slice: humans browse `/docs` on Express.

## Decision

### 1) Service location

- Catalog and router live in `src/services/api-docs/`.
- Group builders live in `api-docs-catalog.ts`; assembly in `build-api-docs-catalog.ts`.
- Shared response helpers live in `src/utils/http/`.
- Do **not** place catalog code in `src/data/` (no database access).

### 2) Endpoints

- `GET /api-docs.json` returns `{ success: true, data: ApiDocsCatalog }` via `sendSuccess`.
- `GET /docs` returns self-contained HTML via `renderApiDocsHtml(buildApiDocsCatalog())`.
- Mount `createApiDocsRouter()` in `index.ts` after feature routes, before error middleware.

### 3) Handler rules

- **No Apify calls** on catalog routes — metadata only.
- Handler: `📥` log → `buildApiDocsCatalog()` → response; `try/catch` → `sendHandlerError`.
- JSDoc on router factory, handlers, and `buildApiDocsCatalog`.

### 4) Catalog maintenance

- Update `api-docs-catalog.ts` in the **same PR** when routes change.
- Paths must match mounts in `index.ts` exactly.

### 5) Catalog content

- First group: **Overview** (empty `endpoints`, multi-paragraph `description`).
- Second group: **Health**.
- Third group: **Reddit scrape** — `POST /api/services/get-reddit-thread-data` with header and body examples.
- Root fields: `version`, `baseUrl`, `responseEnvelope`, `groups` — **no** top-level `title`.

## Related

- [006 – Logging & error response standards](./006-logging-and-error-response-standards.md)
- mentorai-server [oss-api-docs-pattern.md](https://github.com/trouthouse-tech/mentorai-server/blob/main/data/open-source/oss-api-docs-pattern.md)
