import { createMethodNotAllowedResponse, createNotFoundResponse } from '../http/errors';
import { applyCorsHeaders, createPreflightResponse } from '../http/cors';
import { createInitializationRouteHandler } from '../routes/createInitializationRouteHandler';
import type { ApiRouter, ApiRouteDefinition } from '../types/http';
import type { ApiRuntimeConfig } from '../config/apiConfig';

type CreateApiRouterDependencies = {
  config: ApiRuntimeConfig;
};

export function createApiRouter({ config }: CreateApiRouterDependencies): ApiRouter {
  const routes: ApiRouteDefinition[] = [
    {
      methods: {
        GET: createInitializationRouteHandler({ config }),
      },
      pathname: '/',
    },
  ];

  return {
    async handleRequest(request, env, executionContext) {
      if (request.method === 'OPTIONS') {
        return createPreflightResponse();
      }

      const url = new URL(request.url);
      const route = routes.find((candidateRoute) => candidateRoute.pathname === url.pathname);

      if (!route) {
        return applyCorsHeaders(createNotFoundResponse());
      }

      const handler = route.methods[request.method as keyof typeof route.methods];

      if (!handler) {
        return applyCorsHeaders(createMethodNotAllowedResponse(Object.keys(route.methods)));
      }

      const response = await handler(request, {
        config,
        env,
        executionContext,
        url,
      });

      return applyCorsHeaders(response);
    },
  };
}
