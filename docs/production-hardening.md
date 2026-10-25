# Production hardening (Reddit Scraper Express Server)

This OSS slice ships for **local / trusted server-to-server** use by default. Before exposing the API on a LAN or the internet, work through this checklist.

## Authentication and authorization

| Item | OSS default | Production expectation |
|------|-------------|------------------------|
| Scrape route | `x-scraper-api-key` === `SCRAPER_API_KEY` | Rotate key on deploy; use secrets manager |
| Health / docs | Open | Acceptable; restrict by network if needed |
| Apify token | `APIFY_API_TOKEN` env | Never log; restrict who can read env |

## Network

- Bind to `127.0.0.1` during local dev if unsure about firewall rules.
- Use HTTPS in production; terminate TLS at your reverse proxy.
- Replace permissive `cors()` with an explicit origin allowlist. Do not use `Access-Control-Allow-Origin: *` with credentials.
- Set proxy/load balancer **read timeout ≥ 300s** for `POST /api/services/get-reddit-thread-data` (Apify sync runs).

## Rate limits

Add rate limiting per API key or source IP on:

- `POST /api/services/get-reddit-thread-data` (paid Apify runs + long CPU/wait time)

Without limits, a leaked `SCRAPER_API_KEY` or open port can exhaust Apify credits.

## Request body limits

`express.json({ limit: '16kb' })` is configured in early middleware — sufficient for scrape JSON bodies.

## Abuse notes

- URLs must contain `reddit.com`; the server does not implement general SSRF beyond forwarding to Apify.
- You are responsible for compliant use of scraped public Reddit data (Reddit Terms, applicable law).

## Secrets

- `APIFY_API_TOKEN` and `SCRAPER_API_KEY` are required for production scrape use.
- Run `npm audit` before releases.

## Related

- Threat model: root `README.md`
- Security reporting: `SECURITY.md`
- Governance: [mentorai-server `data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source)
