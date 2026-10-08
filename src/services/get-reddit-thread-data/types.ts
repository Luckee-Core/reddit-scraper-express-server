export type RedditScraperMode = 'thread' | 'listing';

export type GetRedditThreadDataRequest = {
  url: string;
  mode?: RedditScraperMode;
};

export type ApifyRedditScraperLiteInput = {
  debugMode: boolean;
  ignoreStartUrls: boolean;
  includeMediaLinks: boolean;
  includeNSFW: boolean;
  maxComments: number;
  maxCommunitiesCount: number;
  maxItems: number;
  maxPostCount: number;
  maxUserCount: number;
  proxy: {
    useApifyProxy: boolean;
    apifyProxyGroups: string[];
  };
  scrollTimeout: number;
  searchComments: boolean;
  searchCommunities: boolean;
  searchMedia: boolean;
  searchPosts: boolean;
  searchUsers: boolean;
  skipComments: boolean;
  skipCommunity: boolean;
  skipUserPosts: boolean;
  sort: string;
  startUrls: Array<{ url: string }>;
};

export type ApifyDatasetItem = Record<string, unknown>;

export type ProcessGetRedditThreadDataInput = {
  url: string;
  mode?: RedditScraperMode;
};

export type ProcessGetRedditThreadDataResult =
  | { items: ApifyDatasetItem[] }
  | { rawError: string };
