# MCP (planned)

This document describes a future **Model Context Protocol** tool surface. v0.1.0 ships HTTP only.

## Intended design

| Piece | Value |
|-------|--------|
| Tool name (illustrative) | `get_reddit_thread_data` |
| Transport | MCP server process calls this Express API |
| Input | `{ url: string, mode?: 'thread' \| 'listing' }` |
| Auth | MCP host holds `SCRAPER_API_KEY`; never pass the key to the LLM client |
| Host env | `REDDIT_SCRAPER_API_URL`, `SCRAPER_API_KEY`; Express host runs `APIFY_API_TOKEN` |

## HTTP contract (today)

Same as `POST /api/services/get-reddit-thread-data` documented at `GET /docs`.

## Errors

Map HTTP 401, 400, and 500 to MCP tool errors. Warn operators that sync runs may take up to several minutes.
