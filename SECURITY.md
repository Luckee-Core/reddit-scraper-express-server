# Security

## Supported use

**Local / trusted development** and **server-to-server** integration are the primary assumptions: you run Express on your machine or a controlled network, and only trusted backends send `x-scraper-api-key`. See `README.md` for env vars, routes, and the threat model.

**Before exposing this server on a LAN or the internet:** rotate `SCRAPER_API_KEY`, add rate limits on scrape routes, configure CORS explicitly, set reverse-proxy timeouts for long Apify sync runs (up to ~300s), use HTTPS, and bind to a controlled interface.

This service requires **`APIFY_API_TOKEN`** and **`SCRAPER_API_KEY`** on the server. Never expose either value to browser clients or `NEXT_PUBLIC_*` env vars.

## Reporting a vulnerability

**Do not** post exploit details in public issues before a fix is coordinated.

### 1. GitHub private security advisories (preferred)

1. Open this repository on GitHub.
2. Go to the **Security** tab.
3. Use **Report a vulnerability** (private submission).

### 2. Maintainer email (optional; forks should set this)

If private advisories are unavailable, edit this file and add a working address.

## Scope and limitations

- This document does not replace a professional security assessment for production or multi-tenant deployments.
- `POST /api/services/get-reddit-thread-data` triggers paid Apify actor runs; missing rate limits allow cost exhaustion if the API key leaks or the port is open.
- The server forwards Reddit URLs to Apify; it does not fetch arbitrary user URLs outside the Apify actor.
- Permissive CORS (`cors()` defaults) is acceptable for local OSS dev; tighten before public deploy. See `docs/production-hardening.md`.

## Audit resources

Pre-release and security review guides: [mentorai-server `data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source).

## Versions

Security fixes apply to the **default branch** unless maintainers publish a separate support policy.
