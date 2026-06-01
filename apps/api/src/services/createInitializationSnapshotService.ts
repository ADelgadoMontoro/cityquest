import type { ApiRuntimeConfig } from '../config/apiConfig';
import type { InitializationSnapshot } from '../models/initialization';

type CreateInitializationSnapshotServiceDependencies = {
  config: ApiRuntimeConfig;
};

export type InitializationSnapshotService = {
  execute: () => InitializationSnapshot;
};

export function createInitializationSnapshotService({
  config,
}: CreateInitializationSnapshotServiceDependencies): InitializationSnapshotService {
  return {
    execute() {
      return {
        environment: config.appEnv,
        service: config.appName,
        status: 'initialized',
      };
    },
  };
}
