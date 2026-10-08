import type { ApifyRedditScraperLiteInput, RedditScraperMode } from './types';

export const APIFY_REDDIT_SCRAPER_ACTOR_ID = 'trudax~reddit-scraper-lite';

const APIFY_BASE_URL = 'https://api.apify.com/v2/actors';

/**
 * Builds the Apify run-sync-get-dataset-items URL with token query param.
 */
export const getApifyRunSyncUrl = (token: string): string =>
  `${APIFY_BASE_URL}/${APIFY_REDDIT_SCRAPER_ACTOR_ID}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;

const threadInput = (url: string): ApifyRedditScraperLiteInput => ({
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

/**
 * Builds trudax~reddit-scraper-lite actor input. Listing mode skips comments and community metadata.
 */
export const buildApifyRedditScraperInput = (
  url: string,
  mode: RedditScraperMode = 'thread'
): ApifyRedditScraperLiteInput => {
  const base = threadInput(url);
  if (mode !== 'listing') {
    return base;
  }
  return {
    ...base,
    skipComments: true,
    maxComments: 0,
    skipCommunity: true,
    maxPostCount: 10,
    maxItems: 10,
    includeMediaLinks: true,
    searchPosts: true,
  };
};
