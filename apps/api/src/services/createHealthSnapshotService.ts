import type { ApiRuntimeConfig } from '../config/apiConfig';
import type { HealthSnapshot } from '../models/health';

type CreateHealthSnapshotServiceDependencies = {
  config: ApiRuntimeConfig;
  now?: () => Date;
};

export type HealthSnapshotService = {
  execute: () => HealthSnapshot;
};

export function createHealthSnapshotService({
  config,
  now = () => new Date(),
}: CreateHealthSnapshotServiceDependencies): HealthSnapshotService {
  return {
    execute() {
      return {
        environment: config.appEnv,
        service: config.appName,
        status: 'ok',
        timestamp: now().toISOString(),
      };
    },
  };
}
