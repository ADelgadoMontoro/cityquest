import { createJsonSuccessResponse } from '../http/responses';
import { createListPublishedDestinationsService } from '../services/createListPublishedDestinationsService';
import type { ApiRouteHandler } from '../types/http';

export function createListDestinationsRouteHandler() {
  const listPublishedDestinationsService = createListPublishedDestinationsService();

  const handler: ApiRouteHandler = async (_request, context) => {
    const snapshot = await listPublishedDestinationsService.execute(context.env.DB);

    return createJsonSuccessResponse(snapshot, {
      meta: {
        count: snapshot.destinations.length,
      },
    });
  };

  return handler;
}
