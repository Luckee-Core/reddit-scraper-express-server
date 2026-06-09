import { Request, Response } from 'express';
import { processGetRedditThreadData } from '../process-get-reddit-thread-data';

const LOG = '[get-reddit-thread-data]';

const isRedditUrl = (url: string): boolean => /reddit\.com/i.test(url);

/**
 * POST /api/services/get-reddit-thread-data
 * Body: { url: string }
 */
export const getRedditThreadDataHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`📥 ${LOG} POST /`);

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

  try {
    const result = await processGetRedditThreadData({ url });

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
