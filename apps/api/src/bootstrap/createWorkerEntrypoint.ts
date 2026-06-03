import { createApiRuntimeConfig } from '../config/apiConfig';
import { createApiRouter } from './createApiRouter';
import type { WorkerEntrypoint } from '../types/worker';

export function createWorkerEntrypoint(): WorkerEntrypoint {
  return {
    async fetch(request, env, context) {
      const runtimeConfig = createApiRuntimeConfig(env);
      const apiRouter = createApiRouter({
        config: runtimeConfig,
      });

      return apiRouter.handleRequest(request, env, context);
    },
  };
}
