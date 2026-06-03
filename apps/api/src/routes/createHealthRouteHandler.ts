import type { ApiRuntimeConfig } from '../config/apiConfig';
import { createJsonSuccessResponse } from '../http/responses';
import { createHealthSnapshotService } from '../services/createHealthSnapshotService';
import type { ApiRouteHandler } from '../types/http';

type CreateHealthRouteHandlerDependencies = {
  config: ApiRuntimeConfig;
};

export function createHealthRouteHandler({ config }: CreateHealthRouteHandlerDependencies) {
  const healthSnapshotService = createHealthSnapshotService({
    config,
  });

  const handler: ApiRouteHandler = async (_request, _context) => {
    const snapshot = healthSnapshotService.execute();

    return createJsonSuccessResponse(
      {
        environment: snapshot.environment,
        service: snapshot.service,
        status: snapshot.status,
      },
      {
        meta: {
          timestamp: snapshot.timestamp,
        },
      },
    );
  };

  return handler;
}
