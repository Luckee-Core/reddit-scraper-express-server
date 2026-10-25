import { Router } from 'express';
import { getHealthHandler } from './routes/get-health-handler';

/**
 * Creates the health check router.
 */
export const createHealthRouter = (): Router => {
  const router = Router();
  router.get('/', getHealthHandler);
  return router;
};
