import { createNotFoundResponse } from '../http/errors';
import { createJsonSuccessResponse } from '../http/responses';
import { createGetPublishedObjectiveUnlocksService } from '../services/createGetPublishedObjectiveUnlocksService';
import type { ApiRouteHandler } from '../types/http';

function getObjectiveSlugFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length !== 3 || segments[0] !== 'objectives' || segments[2] !== 'unlocks') {
    return null;
  }

  return segments[1] ?? null;
}

export function createGetObjectiveUnlocksRouteHandler() {
  const getPublishedObjectiveUnlocksService = createGetPublishedObjectiveUnlocksService();

  const handler: ApiRouteHandler = async (_request, context) => {
    const objectiveSlug = getObjectiveSlugFromPathname(context.url.pathname);

    if (!objectiveSlug) {
      return createNotFoundResponse();
    }

    const snapshot = await getPublishedObjectiveUnlocksService.execute(
      context.env.DB,
      objectiveSlug,
    );

    if (!snapshot) {
      return createNotFoundResponse();
    }

    return createJsonSuccessResponse(snapshot, {
      meta: {
        count: snapshot.unlockableContents.length,
      },
    });
  };

  return handler;
}
