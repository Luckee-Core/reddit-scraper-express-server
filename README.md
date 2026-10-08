# reddit-scraper-express-server

Express API that proxies Reddit thread scrapes to **[Apify Reddit Scraper Lite](https://apify.com/trudax/reddit-scraper-lite)** (`trudax/reddit-scraper-lite`). Keeps your `APIFY_API_TOKEN` server-side so the Next.js app and other clients never talk to Apify directly.

## Why Apify Reddit Scraper Lite?

We use [trudax/reddit-scraper-lite](https://apify.com/trudax/reddit-scraper-lite) instead of Reddit's official API for thread comment fetches:

- **No Reddit OAuth** — scrape public posts and comments without app credentials or rate-limit headaches on the client.
- **Pay per result** — ~$3.40 / 1,000 stored results; the Apify free tier ($5/mo credits) covers light usage.
- **Thread + comments in one run** — pass a post URL via `startUrls` and get the post plus nested comments in a single dataset.
- **Residential proxies built in** — the Lite actor uses Apify proxy configuration tuned for Reddit.

See the [actor README on Apify](https://apify.com/trudax/reddit-scraper-lite) for full input/output schema, pricing, and example dataset items.

## Flow in the content-research stack

```
content-researcher (Next.js)
  → POST /api/reddit-search/threads/:id/get-reddit-thread-data
content-researcher-express-server
  → loads thread permalink from Supabase
  → POST { url } to reddit-scraper-express-server
reddit-scraper-express-server  ← this repo
  → Apify run-sync-get-dataset-items (trudax~reddit-scraper-lite)
  → returns dataset items (post + comments)
content-researcher-express-server
  → maps comments, persists to reddit_thread_comment, returns to UI
```

**content-researcher-express-server** points at this service via `REDDIT_SCRAPER_EXPRESS_URL` (default `http://localhost:3037`).

## Quick start

### 1. Install

```bash
npm install
```

### 2. Environment

Create `.env` from `.env.example`:

```env
PORT=3037
NODE_ENV=development
APIFY_API_TOKEN=your_apify_token_here
SCRAPER_API_KEY=shared_server_key
```

`APIFY_API_TOKEN` is required. Create one in the [Apify console → Integrations](https://console.apify.com/account/integrations).

`SCRAPER_API_KEY` is required. Callers (CMS, other Express servers) must send it as `x-scraper-api-key`. This endpoint is server-to-server; do not put the key in a browser bundle.

### 3. Run

```bash
npm run dev
```

Server listens on `http://localhost:3037`.

### 4. Smoke test

```bash
curl -X POST http://localhost:3037/api/services/get-reddit-thread-data \
  -H "Content-Type: application/json" \
  -H "x-scraper-api-key: shared_server_key" \
  -d '{"url":"https://www.reddit.com/r/AI_Agents/comments/1tyyojl/need_help_orchestrating_a_video_editing_agent/"}'
```

Community listing (10 posts, no comments):

```bash
curl -X POST http://localhost:3037/api/services/get-reddit-thread-data \
  -H "Content-Type: application/json" \
  -H "x-scraper-api-key: shared_server_key" \
  -d '{"url":"https://www.reddit.com/r/news/new","mode":"listing"}'
```

Sync Apify runs can take **40s+** (`scrollTimeout` is 40 in actor input). Apify allows up to ~300s for sync runs.

## API

### `POST /api/services/get-reddit-thread-data`

Runs [Reddit Scraper Lite](https://apify.com/trudax/reddit-scraper-lite) synchronously via Apify's `run-sync-get-dataset-items` endpoint and returns the dataset.

**Body (JSON)**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Reddit thread or community listing URL (any `reddit.com` subdomain) |
| `mode` | string | No | `thread` (default) or `listing`. Listing skips comments and community metadata. |

**Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `x-scraper-api-key` | Yes | Must match `SCRAPER_API_KEY`. Server-to-server only. |

**Success (200)**

```json
{ "success": true, "data": [ /* Apify dataset items */ ] }
```

Each item is a post, comment, user, or community object with a `dataType` field. For thread fetches you typically get one `post` item and many `comment` items. See [Apify output examples](https://apify.com/trudax/reddit-scraper-lite#results).

**Unauthorized (401)** — missing or invalid `x-scraper-api-key`

**Client error (400)** — `{ "success": false, "error": "..." }` (missing or non-Reddit URL)

**Server error (500)** — missing `SCRAPER_API_KEY` / `APIFY_API_TOKEN`, Apify failure, or unexpected response shape

### Health

- `GET /` — basic health check
- `GET /api/health` — detailed health check

## Apify actor configuration

This service calls:

```
POST https://api.apify.com/v2/actors/trudax~reddit-scraper-lite/run-sync-get-dataset-items?token=...
```

Actor input is built in `src/services/get-reddit-thread-data/config.ts`. The client `url` is passed as a single `startUrls` entry. Current defaults:

| Parameter | Value | Notes |
|-----------|-------|-------|
| `startUrls` | `[{ url }]` | Thread permalink from caller |
| `skipComments` | `false` | Extract comments for the post |
| `maxComments` | `10` | Per-post comment cap in actor input |
| `scrollTimeout` | `40` | Seconds to scroll/load comments |
| `includeMediaLinks` | `false` | Faster RSS-style post extraction |
| `proxy.useApifyProxy` | `true` | Apify residential proxy |
| `proxy.apifyProxyGroups` | `["RESIDENTIAL"]` | |

To change limits (e.g. more comments per thread), edit `buildApifyRedditScraperInput` in `config.ts`.

## Project structure

```
reddit-scraper-express-server/
├── index.ts
├── src/services/
│   ├── get-reddit-thread-data/   # Apify proxy (handler, process, config)
│   ├── health/
│   ├── middleware/
│   └── server/
├── .env.example
└── package.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with hot reload (port 3037) |
| `npm start` | Run with ts-node |
| `npm run build` | Compile TypeScript to `dist/` |

## Deployment

```bash
npm run build
NODE_ENV=production node dist/index.js
```

Set `APIFY_API_TOKEN` and `SCRAPER_API_KEY` in the host environment (Railway, etc.). Point callers at the deployed URL with `REDDIT_SCRAPER_EXPRESS_URL` and the same `SCRAPER_API_KEY`.

## Architecture & agent rules

Cursor agents should follow **`.cursor/rules/AGENTS.md`** and ADRs in **`.cursor/architecture/`**.

- HTTP + business logic: `src/services/{feature}/` (routers, handlers, `processX()`)
- Cross-cutting: `src/services/middleware`, `health`, `server`
- Factory pattern: `createXRouter(): Router`
- Use `type`, not `interface`

## License

MIT
