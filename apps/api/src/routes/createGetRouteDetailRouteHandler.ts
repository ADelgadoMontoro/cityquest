import { createNotFoundResponse } from '../http/errors';
import { createJsonSuccessResponse } from '../http/responses';
import { createGetRouteDetailService } from '../services/createGetRouteDetailService';
import type { ApiRouteHandler } from '../types/http';

function getRouteSlugFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length !== 2 || segments[0] !== 'routes') {
    return null;
  }

  return segments[1] ?? null;
}

export function createGetRouteDetailRouteHandler() {
  const getRouteDetailService = createGetRouteDetailService();

  const handler: ApiRouteHandler = async (_request, context) => {
    const routeSlug = getRouteSlugFromPathname(context.url.pathname);

    if (!routeSlug) {
      return createNotFoundResponse();
    }

    const snapshot = await getRouteDetailService.execute(context.env.DB, routeSlug);

    if (!snapshot) {
      return createNotFoundResponse();
    }

    return createJsonSuccessResponse(snapshot);
  };

  return handler;
}
