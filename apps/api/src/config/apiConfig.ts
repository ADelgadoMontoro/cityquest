export type ApiRuntimeConfig = {
  appName: string;
  appEnv: string;
  logLevel: string;
};

export function loadApiRuntimeConfig(): ApiRuntimeConfig {
  return {
    appName: process.env.CITYQUEST_API_NAME ?? 'CityQuest API',
    appEnv: process.env.CITYQUEST_APP_ENV ?? 'development',
    logLevel: process.env.CITYQUEST_LOG_LEVEL ?? 'info',
  };
}
