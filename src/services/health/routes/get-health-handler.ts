import type { Request, Response } from 'express';
import { processHealthCheck } from '../process-health-check';

/**
 * GET / — basic health check endpoint.
 */
export const getHealthHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 [health.getHealthHandler] GET /');

  try {
    const data = processHealthCheck();
    console.log('📤 [health.getHealthHandler] 200');
    res.status(200).json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [health.getHealthHandler] Failed:', message);
    res.status(500).json({ success: false, error: message });
  }
};
