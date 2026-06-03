import type { ApiRuntimeConfig } from '../config/apiConfig';
import { createJsonResponse } from '../http/responses';
import { createInitializationSnapshotService } from '../services/createInitializationSnapshotService';
import type { ApiRouteHandler } from '../types/http';

type CreateInitializationRouteHandlerDependencies = {
  config: ApiRuntimeConfig;
};

export function createInitializationRouteHandler({
  config,
}: CreateInitializationRouteHandlerDependencies) {
  const initializationSnapshotService = createInitializationSnapshotService({
    config,
  });

  const handler: ApiRouteHandler = async (_request, _context) => {
    return createJsonResponse(200, initializationSnapshotService.execute());
  };

  return handler;
}
