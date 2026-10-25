/**
 * Health check payload returned by GET / and GET /api/health.
 */
export type HealthCheckData = {
  status: 'ok';
  timestamp: string;
  environment: string;
};

/**
 * Builds the health check payload for monitoring endpoints.
 */
export const processHealthCheck = (): HealthCheckData => {
  console.log('🚀 [health.processHealthCheck] Building health payload');

  const data: HealthCheckData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };

  console.log('✅ [health.processHealthCheck] Health payload ready', {
    environment: data.environment,
  });

  return data;
};
