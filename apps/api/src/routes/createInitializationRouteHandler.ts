import type { ApiRuntimeConfig } from '../config/apiConfig';
import { createInitializationSnapshotService } from '../services/createInitializationSnapshotService';
import { createJsonResponse } from '../utils/createJsonResponse';

type CreateInitializationRouteHandlerDependencies = {
  config: ApiRuntimeConfig;
};

export function createInitializationRouteHandler({
  config,
}: CreateInitializationRouteHandlerDependencies) {
  const initializationSnapshotService = createInitializationSnapshotService({
    config,
  });

  return async (): Promise<Response> =>
    createJsonResponse(200, initializationSnapshotService.execute());
}
