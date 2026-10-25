import type { Request, Response } from 'express';
import { sendHandlerError, sendSuccess } from '../../../utils/http';
import { buildApiDocsCatalog } from '../build-api-docs-catalog';

/**
 * GET /api-docs.json — returns the API documentation catalog (metadata only).
 */
export const getApiDocsHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 [api-docs.getApiDocsHandler] GET /api-docs.json');

  try {
    const catalog = buildApiDocsCatalog();
    sendSuccess(res, catalog);
    console.log('✅ [api-docs.getApiDocsHandler] Catalog built');
    console.log('📤 [api-docs.getApiDocsHandler] 200');
  } catch (error) {
    sendHandlerError(res, error, 'GET /api-docs.json');
  }
};
