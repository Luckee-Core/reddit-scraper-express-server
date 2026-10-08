import { Request, Response } from 'express';
import { processGetRedditThreadData } from '../process-get-reddit-thread-data';
import type { RedditScraperMode } from '../types';

const LOG = '[get-reddit-thread-data]';

const isRedditUrl = (url: string): boolean => /reddit\.com/i.test(url);

const parseMode = (value: unknown): RedditScraperMode | null => {
  if (value === undefined || value === 'thread') {
    return 'thread';
  }
  if (value === 'listing') {
    return 'listing';
  }
  return null;
};

/**
 * POST /api/services/get-reddit-thread-data
 * Server-to-server only. Requires x-scraper-api-key.
 * Body: { url: string, mode?: 'thread' | 'listing' }
 */
export const getRedditThreadDataHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`📥 ${LOG} POST /`);

  const expectedKey = process.env.SCRAPER_API_KEY?.trim();
  if (!expectedKey) {
    console.error(`❌ ${LOG} SCRAPER_API_KEY is not configured`);
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }

  const providedKey = req.header('x-scraper-api-key')?.trim() ?? '';
  if (providedKey !== expectedKey) {
    console.error(`❌ ${LOG} unauthorized`);
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';

  if (!url) {
    console.error(`❌ ${LOG} missing url`);
    res.status(400).json({ success: false, error: 'url is required' });
    return;
  }

  if (!isRedditUrl(url)) {
    console.error(`❌ ${LOG} invalid url`);
    res.status(400).json({ success: false, error: 'url must be a Reddit thread URL' });
    return;
  }

  const mode = parseMode(req.body?.mode);
  if (!mode) {
    console.error(`❌ ${LOG} invalid mode`);
    res.status(400).json({ success: false, error: 'mode must be thread or listing' });
    return;
  }

  try {
    const result = await processGetRedditThreadData({ url, mode });

    if ('rawError' in result) {
      console.error(`❌ ${LOG} ${result.rawError}`);
      res.status(500).json({ success: false, error: result.rawError });
      return;
    }

    console.log(`📤 ${LOG} 200 count=${result.items.length}`);
    res.status(200).json({ success: true, data: result.items });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ ${LOG} handler error`, message);
    res.status(500).json({ success: false, error: message });
  }
};
