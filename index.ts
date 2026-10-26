import express from 'express';
import dotenv from 'dotenv';

// Hub / luckee-hub-express often export PORT=3001; .env must win (see hub spawn-project-pty).
dotenv.config({ override: true });

const app = express();
const PORT = Number(process.env.PORT) || 3037;

import { setupEarlyMiddleware } from './src/services/middleware';
setupEarlyMiddleware(app);

import { createHealthRouter } from './src/services/health';
app.use('/', createHealthRouter());
app.use('/api/health', createHealthRouter());

import { createGetRedditThreadDataRouter } from './src/services/get-reddit-thread-data';
app.use('/api/services/get-reddit-thread-data', createGetRedditThreadDataRouter());

import { createApiDocsRouter } from './src/services/api-docs';
app.use(createApiDocsRouter());

import { setupErrorHandling } from './src/services/middleware';
setupErrorHandling(app);

import { startServer } from './src/services/server';
startServer(app, {
  port: PORT,
  environment: process.env.NODE_ENV || 'development',
});

export default app;
