/**
 * Setup Early Middleware
 * Configures CORS, body parsing, and other early middleware
 */

import cors from 'cors';
import express, { Express } from 'express';

export const setupEarlyMiddleware = (app: Express): void => {
  // CORS middleware
  app.use(cors());
  
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));
};
