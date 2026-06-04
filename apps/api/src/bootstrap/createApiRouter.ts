import { createMethodNotAllowedResponse, createNotFoundResponse } from '../http/errors';
import { applyCorsHeaders, createPreflightResponse } from '../http/cors';
import { createHealthRouteHandler } from '../routes/createHealthRouteHandler';
import { createGetRouteDetailRouteHandler } from '../routes/createGetRouteDetailRouteHandler';
import { createInitializationRouteHandler } from '../routes/createInitializationRouteHandler';
import { createListDestinationsRouteHandler } from '../routes/createListDestinationsRouteHandler';
import type { ApiRouter, ApiRouteDefinition } from '../types/http';
import type { ApiRuntimeConfig } from '../config/apiConfig';

type CreateApiRouterDependencies = {
  config: ApiRuntimeConfig;
};

function matchesRoutePathname(routePathname: string, requestPathname: string): boolean {
  const routeSegments = routePathname.split('/').filter(Boolean);
  const requestSegments = requestPathname.split('/').filter(Boolean);

  if (routeSegments.length !== requestSegments.length) {
    return false;
  }

  return routeSegments.every((routeSegment, index) => {
    if (routeSegment.startsWith(':')) {
      return requestSegments[index] !== undefined;
    }

    return routeSegment === requestSegments[index];
  });
}

export function createApiRouter({ config }: CreateApiRouterDependencies): ApiRouter {
  const routes: ApiRouteDefinition[] = [
    {
      methods: {
        GET: createInitializationRouteHandler({ config }),
      },
      pathname: '/',
    },
    {
      methods: {
        GET: createHealthRouteHandler({ config }),
      },
      pathname: '/health',
    },
    {
      methods: {
        GET: createListDestinationsRouteHandler(),
      },
      pathname: '/destinations',
    },
    {
      methods: {
        GET: createGetRouteDetailRouteHandler(),
      },
      pathname: '/routes/:routeSlug',
    },
  ];

  return {
    async handleRequest(request, env, executionContext) {
      if (request.method === 'OPTIONS') {
        return createPreflightResponse();
      }

      const url = new URL(request.url);
      const route = routes.find((candidateRoute) =>
        matchesRoutePathname(candidateRoute.pathname, url.pathname),
      );

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
