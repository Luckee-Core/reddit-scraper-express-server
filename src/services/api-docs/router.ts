import { Router } from 'express';
import { getApiDocsHandler } from './routes/get-api-docs-handler';
import { getDocsHandler } from './routes/get-docs-handler';

/**
 * Creates the API docs router (JSON catalog and HTML reference).
 */
export const createApiDocsRouter = (): Router => {
  const router = Router();
  router.get('/api-docs.json', getApiDocsHandler);
  router.get('/docs', getDocsHandler);
  return router;
};
