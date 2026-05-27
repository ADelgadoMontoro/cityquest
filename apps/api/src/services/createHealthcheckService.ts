import type { ApiRuntimeConfig } from '../config/apiConfig';
import type { HealthcheckRequest, HealthcheckSnapshot } from '../models/health';

type CreateHealthcheckServiceDependencies = {
  config: ApiRuntimeConfig;
  now?: () => Date;
};

export type HealthcheckService = {
  execute: (request: HealthcheckRequest) => HealthcheckSnapshot;
};

export function createHealthcheckService({
  config,
  now = () => new Date(),
}: CreateHealthcheckServiceDependencies): HealthcheckService {
  return {
    execute(request) {
      return {
        app: config.appName,
        environment: config.appEnv,
        requestId: request.requestId,
        status: 'ok',
        timestamp: now().toISOString(),
      };
    },
  };
}
