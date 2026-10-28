/**
 * Logs every HTTP request and response status for local debugging.
 */

import { Express, Request, Response, NextFunction } from 'express';

/**
 * Registers request/response logging middleware (📥 on entry, 📤 on finish).
 */
export const setupRequestLogging = (app: Express): void => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const path = req.originalUrl || req.url;
    const startedAt = Date.now();
    console.log(`📥 ${req.method} ${path}`);

    res.on('finish', () => {
      console.log(`📤 ${req.method} ${path} ${res.statusCode} ${Date.now() - startedAt}ms`);
    });

    next();
  });
};
