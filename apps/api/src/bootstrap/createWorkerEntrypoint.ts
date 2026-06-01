import { createApiRuntimeConfig } from '../config/apiConfig';
import { createInitializationRouteHandler } from '../routes/createInitializationRouteHandler';
import type { WorkerEntrypoint } from '../types/worker';
import { createJsonResponse } from '../utils/createJsonResponse';

function isInitializationRequest(request: Request): boolean {
  const url = new URL(request.url);

  return request.method === 'GET' && url.pathname === '/';
}

export function createWorkerEntrypoint(): WorkerEntrypoint {
  return {
    async fetch(request, env) {
      const runtimeConfig = createApiRuntimeConfig(env);
      const handleInitializationRequest = createInitializationRouteHandler({
        config: runtimeConfig,
      });

      if (isInitializationRequest(request)) {
        return handleInitializationRequest();
      }

      return createJsonResponse(404, {
        error: 'not_found',
        message: 'Route not found.',
      });
    },
  };
}
