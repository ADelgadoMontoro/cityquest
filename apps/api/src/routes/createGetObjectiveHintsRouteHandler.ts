import { createNotFoundResponse } from '../http/errors';
import { createJsonSuccessResponse } from '../http/responses';
import { createGetPublishedObjectiveHintsService } from '../services/createGetPublishedObjectiveHintsService';
import type { ApiRouteHandler } from '../types/http';

function getObjectiveSlugFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length !== 3 || segments[0] !== 'objectives' || segments[2] !== 'hints') {
    return null;
  }

  return segments[1] ?? null;
}

export function createGetObjectiveHintsRouteHandler() {
  const getPublishedObjectiveHintsService = createGetPublishedObjectiveHintsService();

  const handler: ApiRouteHandler = async (_request, context) => {
    const objectiveSlug = getObjectiveSlugFromPathname(context.url.pathname);

    if (!objectiveSlug) {
      return createNotFoundResponse();
    }

    const snapshot = await getPublishedObjectiveHintsService.execute(context.env.DB, objectiveSlug);

    if (!snapshot) {
      return createNotFoundResponse();
    }

    return createJsonSuccessResponse(snapshot, {
      meta: {
        count: snapshot.hints.length,
      },
    });
  };

  return handler;
}
