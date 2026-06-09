import type { ApifyRedditScraperLiteInput } from './types';

export const APIFY_REDDIT_SCRAPER_ACTOR_ID = 'trudax~reddit-scraper-lite';

const APIFY_BASE_URL = 'https://api.apify.com/v2/actors';

/**
 * Builds the Apify run-sync-get-dataset-items URL with token query param.
 */
export const getApifyRunSyncUrl = (token: string): string =>
  `${APIFY_BASE_URL}/${APIFY_REDDIT_SCRAPER_ACTOR_ID}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;

/**
 * Builds the fixed trudax~reddit-scraper-lite actor input with the client url in startUrls.
 */
export const buildApifyRedditScraperInput = (url: string): ApifyRedditScraperLiteInput => ({
  debugMode: false,
  ignoreStartUrls: false,
  includeMediaLinks: false,
  includeNSFW: true,
  maxComments: 10,
  maxCommunitiesCount: 2,
  maxItems: 10,
  maxPostCount: 10,
  maxUserCount: 2,
  proxy: {
    useApifyProxy: true,
    apifyProxyGroups: ['RESIDENTIAL'],
  },
  scrollTimeout: 40,
  searchComments: false,
  searchCommunities: false,
  searchMedia: false,
  searchPosts: true,
  searchUsers: false,
  skipComments: false,
  skipCommunity: false,
  skipUserPosts: false,
  sort: 'new',
  startUrls: [{ url }],
});
