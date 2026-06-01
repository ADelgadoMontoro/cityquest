import type { WorkerRuntimeEnv } from '../types/worker';

export type ApiRuntimeConfig = {
  appEnv: string;
  appName: string;
  logLevel: string;
};

export function createApiRuntimeConfig(env: WorkerRuntimeEnv): ApiRuntimeConfig {
  return {
    appEnv: env.CITYQUEST_APP_ENV ?? 'development',
    appName: env.CITYQUEST_API_NAME ?? 'cityquest-api',
    logLevel: env.CITYQUEST_LOG_LEVEL ?? 'info',
  };
}
