import { createJsonErrorResponse, createNotFoundResponse } from '../http/errors';
import { createJsonSuccessResponse } from '../http/responses';
import {
  createGetRouteObjectiveProgressService,
} from '../services/createGetRouteObjectiveProgressService';
import type { ApiRouteHandler } from '../types/http';

function getRouteSlugFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length !== 3 || segments[0] !== 'routes' || segments[2] !== 'objective-progress') {
    return null;
  }

  return segments[1] ?? null;
}

function createBadRequestResponse(message: string): Response {
  return createJsonErrorResponse(400, 'BAD_REQUEST', message);
}

export function createGetRouteObjectiveProgressRouteHandler() {
  const getRouteObjectiveProgressService = createGetRouteObjectiveProgressService();

  const handler: ApiRouteHandler = async (_request, context) => {
    const routeSlug = getRouteSlugFromPathname(context.url.pathname);

    if (!routeSlug) {
      return createNotFoundResponse();
    }

    const actorId = context.url.searchParams.get('actorId')?.trim();

    if (!actorId) {
      return createBadRequestResponse('actorId query parameter is required.');
    }

    const snapshot = await getRouteObjectiveProgressService.execute(
      context.env.DB,
      routeSlug,
      actorId,
    );

    if (!snapshot) {
      return createNotFoundResponse();
    }

    return createJsonSuccessResponse(snapshot);
  };

  return handler;
}
