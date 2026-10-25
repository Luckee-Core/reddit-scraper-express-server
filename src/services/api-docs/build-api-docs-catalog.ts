import {
  buildHealthGroup,
  buildOverviewGroup,
  buildRedditScrapeGroup,
} from './api-docs-catalog';
import type { ApiDocsCatalog } from './types';

const DEFAULT_PORT = 3037;

/**
 * Builds the full API documentation catalog for the Reddit scraper Express server.
 */
export const buildApiDocsCatalog = (): ApiDocsCatalog => {
  const portFromEnv = Number(process.env.PORT);
  const port =
    Number.isFinite(portFromEnv) && portFromEnv > 0 ? portFromEnv : DEFAULT_PORT;
  const baseUrl =
    process.env.PUBLIC_API_URL?.trim().replace(/\/$/, '') ||
    `http://localhost:${port}`;

  return {
    version: '0.1.0',
    baseUrl,
    responseEnvelope:
      '{ "success": true, "data": T } | { "success": false, "error": string }',
    groups: [buildOverviewGroup(), buildHealthGroup(), buildRedditScrapeGroup()],
  };
};
