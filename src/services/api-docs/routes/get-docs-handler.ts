import type { Request, Response } from 'express';
import { sendHandlerError } from '../../../utils/http';
import { buildApiDocsCatalog } from '../build-api-docs-catalog';
import { renderApiDocsHtml } from '../render-api-docs-html';

/**
 * GET /docs — human-readable API reference HTML (metadata only).
 */
export const getDocsHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 [api-docs.getDocsHandler] GET /docs');

  try {
    const catalog = buildApiDocsCatalog();
    const html = renderApiDocsHtml(catalog);
    console.log('✅ [api-docs.getDocsHandler] HTML rendered');
    console.log('📤 [api-docs.getDocsHandler] 200');
    res.status(200).type('html').send(html);
  } catch (error) {
    sendHandlerError(res, error, 'GET /docs');
  }
};
