# Reddit Scraper Express Server

Open-source Express API that proxies public Reddit thread and listing URLs to **[Apify Reddit Scraper Lite](https://apify.com/trudax/reddit-scraper-lite)** (`trudax/reddit-scraper-lite`). Keeps `APIFY_API_TOKEN` and your `SCRAPER_API_KEY` on the server so callers never talk to Apify directly.

**Not for browser clients** — integrate from your backend with `x-scraper-api-key`.

## TL;DR

```bash
git clone https://github.com/Luckee-Core/reddit-scraper-express-server.git
cd reddit-scraper-express-server
npm install
cp .env.example .env
# Set APIFY_API_TOKEN and SCRAPER_API_KEY
npm run dev
```

Open [http://localhost:3037/docs](http://localhost:3037/docs) for the API reference.

```bash
curl -s http://localhost:3037/api/health | jq .

curl -X POST http://localhost:3037/api/services/get-reddit-thread-data \
  -H "Content-Type: application/json" \
  -H "x-scraper-api-key: YOUR_SCRAPER_API_KEY" \
  -d '{"url":"https://www.reddit.com/r/news/new","mode":"listing"}'
```

Sync Apify runs can take **40s+** (up to ~300s). Plan proxy timeouts accordingly.

## Features

- **Thread scrape** — post + comments (actor defaults: up to 10 comments, 40s scroll)
- **Listing scrape** — up to 10 posts, no comments (`mode: "listing"`)
- **API key auth** on scrape route (`x-scraper-api-key`)
- **Health** with `{ success, data }` JSON envelope
- **API docs** — `GET /api-docs.json` and `GET /docs` (HTML)
- **MIT** — self-host on Railway, Docker, or your VPC

## Why Apify Reddit Scraper Lite?

- **No Reddit OAuth** for read-only public scrape flows
- **Pay per result** — see [Apify pricing](https://apify.com/trudax/reddit-scraper-lite#pricing)
- **Residential proxies** built into the actor

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | Health check |
| `GET` | `/api/health` | No | Health check |
| `POST` | `/api/services/get-reddit-thread-data` | `x-scraper-api-key` | Apify sync scrape |
| `GET` | `/api-docs.json` | No | API catalog (JSON) |
| `GET` | `/docs` | No | API reference (HTML) |

### `POST /api/services/get-reddit-thread-data`

**Headers:** `x-scraper-api-key` (required), `Content-Type: application/json`

**Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Any `reddit.com` thread or listing URL |
| `mode` | string | No | `thread` (default) or `listing` |

**Success (200):** `{ "success": true, "data": [ /* Apify dataset items */ ] }`

**Errors:** `400` validation, `401` unauthorized, `500` misconfiguration or Apify failure

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No (default `3037`) | HTTP listen port |
| `NODE_ENV` | No | `development` or `production` |
| `APIFY_API_TOKEN` | Yes (scrape) | [Apify console → Integrations](https://console.apify.com/account/integrations) |
| `SCRAPER_API_KEY` | Yes (scrape) | Shared secret for `x-scraper-api-key` — server-only |
| `PUBLIC_API_URL` | No | Base URL in API docs catalog |

Copy `.env.example` to `.env`. Never commit secrets.

## Threat model and trust boundaries

**Intended use:** localhost or a private network where only **trusted backends** hold `SCRAPER_API_KEY`.

- **Apify billing:** each scrape spends Apify credits; a leaked API key on an open port enables cost abuse.
- **CORS:** permissive `cors()` defaults — fine for local dev; tighten before public deploy ([`docs/production-hardening.md`](docs/production-hardening.md)).
- **No database** — stateless proxy.
- **Compliance:** you are responsible for lawful use of scraped public Reddit data.

Before LAN or internet exposure, see [`docs/production-hardening.md`](docs/production-hardening.md) and [`SECURITY.md`](SECURITY.md).

## Apify actor configuration

Actor input is built in `src/services/get-reddit-thread-data/config.ts`. To change comment limits or timeouts, edit `buildApifyRedditScraperInput`.

## Project structure

```text
reddit-scraper-express-server/
├── index.ts
├── src/services/
│   ├── api-docs/
│   ├── get-reddit-thread-data/
│   ├── health/
│   ├── middleware/
│   └── server/
├── docs/
└── .cursor/architecture/
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm start` | Run with ts-node |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run typecheck` | TypeScript check without emit |

`package-lock.json` is committed — use `npm ci` in CI and production.

## Deployment

```bash
npm run build
NODE_ENV=production node dist/index.js
```

Set `APIFY_API_TOKEN` and `SCRAPER_API_KEY` in the host environment.

## Example integration

See [`docs/integration.md`](docs/integration.md) for env names (`REDDIT_SCRAPER_EXPRESS_URL`, `SCRAPER_API_KEY`) used by product backends.

## Roadmap

- **MCP tool** wrapping the same HTTP contract — see [`docs/mcp.md`](docs/mcp.md)

## OSS governance

This repo follows the TroutHouseTech open-source governance pack:

[mentorai-server `data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source)

Release status: [`docs/oss-release-status.md`](docs/oss-release-status.md)

## Architecture

Follow **`.cursor/rules/AGENTS.md`** and **`.cursor/architecture/`** (including [012 – API docs](./.cursor/architecture/012-api-docs-catalog.md)).

## License

MIT — see [LICENSE](./LICENSE).
