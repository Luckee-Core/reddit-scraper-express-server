import { Router } from 'express';
import { getRedditThreadDataHandler } from './routes/get-reddit-thread-data-handler';

/**
 * Creates the get-reddit-thread-data router.
 */
export const createGetRedditThreadDataRouter = (): Router => {
  const router = Router();
  router.post('/', getRedditThreadDataHandler);
  return router;
};
