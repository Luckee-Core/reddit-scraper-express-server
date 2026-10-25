# Integration (server-to-server)

Optional reference for backends that call this API (for example a product CMS).

## Environment (caller)

| Variable | Example | Purpose |
|----------|---------|---------|
| `REDDIT_SCRAPER_EXPRESS_URL` | `http://localhost:3037` | Base URL of this Express server |
| `SCRAPER_API_KEY` | shared secret | Sent as `x-scraper-api-key` on scrape requests |

The caller must **not** expose `SCRAPER_API_KEY` to browsers.

## Scrape request

```http
POST /api/services/get-reddit-thread-data
Content-Type: application/json
x-scraper-api-key: <SCRAPER_API_KEY>

{"url":"https://www.reddit.com/r/news/comments/...","mode":"thread"}
```

Success: `{ "success": true, "data": [ /* Apify dataset items */ ] }`

## Health

```http
GET /api/health
```

Success: `{ "success": true, "data": { "status": "ok", "timestamp": "...", "environment": "..." } }`
