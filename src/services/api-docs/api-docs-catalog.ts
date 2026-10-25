import type { ApiDocsGroup } from './types';

const ts = '2026-10-25T12:00:00.000Z';

/**
 * Overview group for the Reddit scraper Express API catalog.
 */
export const buildOverviewGroup = (): ApiDocsGroup => ({
  name: 'Overview',
  description: [
    'Self-hosted Express API that proxies public Reddit URLs to [Apify Reddit Scraper Lite](https://apify.com/trudax/reddit-scraper-lite) (`trudax~reddit-scraper-lite`). Returns Apify dataset items (posts, comments, and related objects with a `dataType` field).',
    'Route layout: `GET /` and `GET /api/health` — liveness probes; `POST /api/services/get-reddit-thread-data` — scrape; `GET /api-docs.json` — this catalog; `GET /docs` — HTML reference.',
    'JSON endpoints use `{ success: true, data }` on success and `{ success: false, error: string }` on failure.',
    'Requires server env `APIFY_API_TOKEN` and caller header `x-scraper-api-key` matching `SCRAPER_API_KEY`. **Not for browser clients** — call from your backend only.',
    'Sync Apify runs often take 40 seconds or more (`scrollTimeout` is 40 in actor input). Apify allows up to ~300 seconds for sync runs; configure reverse-proxy timeouts accordingly. Apify billing applies (~$3.40 / 1,000 stored results; see Apify pricing).',
    'Body field `mode`: `thread` (default) fetches a post and up to 10 comments per actor defaults; `listing` fetches up to 10 recent or sorted posts without comments. Actor limits are defined in `src/services/get-reddit-thread-data/config.ts`.',
  ].join('\n\n'),
  endpoints: [],
});

/**
 * Health endpoints group for the API catalog.
 */
export const buildHealthGroup = (): ApiDocsGroup => ({
  name: 'Health',
  description: 'Liveness probes for load balancers and local development.',
  endpoints: [
    {
      method: 'GET',
      path: '/',
      summary: 'Root health check',
      responses: [
        {
          status: 200,
          description: 'Server is running',
          example: {
            success: true,
            data: {
              status: 'ok',
              timestamp: ts,
              environment: 'development',
            },
          },
        },
      ],
    },
    {
      method: 'GET',
      path: '/api/health',
      summary: 'Health check',
      responses: [
        {
          status: 200,
          description: 'Server is running',
          example: {
            success: true,
            data: {
              status: 'ok',
              timestamp: ts,
              environment: 'development',
            },
          },
        },
      ],
    },
  ],
});

/**
 * Reddit scrape endpoints group for the API catalog.
 */
export const buildRedditScrapeGroup = (): ApiDocsGroup => ({
  name: 'Reddit scrape',
  description:
    'Runs Apify Reddit Scraper Lite synchronously and returns dataset items. Use `thread` mode for a single post URL; use `listing` for a subreddit listing URL (e.g. `/r/news/new`).',
  endpoints: [
    {
      method: 'POST',
      path: '/api/services/get-reddit-thread-data',
      summary: 'Fetch Reddit thread or listing via Apify',
      description:
        'Server-to-server only. Validates `url` contains `reddit.com`. Calls Apify `run-sync-get-dataset-items`.',
      requestBody: {
        contentType: 'application/json',
        example: {
          url: 'https://www.reddit.com/r/AI_Agents/comments/1tyyojl/example_thread/',
          mode: 'thread',
        },
      },
      responses: [
        {
          status: 200,
          description: 'Apify dataset items',
          example: {
            success: true,
            data: [{ dataType: 'post', title: 'Example post title' }],
          },
        },
        {
          status: 400,
          description: 'Missing or invalid url or mode',
          example: { success: false, error: 'url is required' },
        },
        {
          status: 401,
          description: 'Missing or invalid x-scraper-api-key',
          example: { success: false, error: 'Unauthorized' },
        },
        {
          status: 500,
          description: 'Missing env, Apify failure, or misconfiguration',
          example: { success: false, error: 'APIFY_API_TOKEN is not configured on the server' },
        },
      ],
    },
  ],
});
