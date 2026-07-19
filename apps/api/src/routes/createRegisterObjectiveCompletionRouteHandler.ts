import { createJsonErrorResponse, createNotFoundResponse } from '../http/errors';
import { createJsonSuccessResponse } from '../http/responses';
import {
  createRegisterObjectiveCompletionService,
  type RegisterObjectiveCompletionInput,
} from '../services/createRegisterObjectiveCompletionService';
import type { ApiRouteHandler } from '../types/http';

type CompletionRequestBody = {
  actorId?: unknown;
  gpsStatus?: unknown;
  routeSlug?: unknown;
  validationMode?: unknown;
  visualStatus?: unknown;
};

function getObjectiveSlugFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length !== 3 || segments[0] !== 'objectives' || segments[2] !== 'completions') {
    return null;
  }

  return segments[1] ?? null;
}

function createBadRequestResponse(message: string): Response {
  return createJsonErrorResponse(400, 'BAD_REQUEST', message);
}

async function readCompletionRequestBody(request: Request): Promise<CompletionRequestBody | null> {
  try {
    return (await request.json()) as CompletionRequestBody;
  } catch {
    return null;
  }
}

function parseCompletionInput(
  objectiveSlug: string,
  body: CompletionRequestBody,
): RegisterObjectiveCompletionInput | Response {
  if (typeof body.actorId !== 'string' || body.actorId.trim().length === 0) {
    return createBadRequestResponse('actorId is required.');
  }

  if (typeof body.routeSlug !== 'string' || body.routeSlug.trim().length === 0) {
    return createBadRequestResponse('routeSlug is required.');
  }

  if (body.validationMode !== 'mock_visual') {
    return createBadRequestResponse('validationMode must be mock_visual.');
  }

  if (body.gpsStatus !== 'within_radius' && body.gpsStatus !== 'radius_unavailable') {
    return createBadRequestResponse('gpsStatus must be within_radius or radius_unavailable.');
  }

  if (body.visualStatus !== 'passed') {
    return createBadRequestResponse('visualStatus must be passed.');
  }

  return {
    actorId: body.actorId.trim(),
    gpsStatus: body.gpsStatus,
    objectiveSlug,
    routeSlug: body.routeSlug.trim(),
    validationMode: body.validationMode,
    visualStatus: body.visualStatus,
  };
}

export function createRegisterObjectiveCompletionRouteHandler() {
  const registerObjectiveCompletionService = createRegisterObjectiveCompletionService();

  const handler: ApiRouteHandler = async (request, context) => {
    const objectiveSlug = getObjectiveSlugFromPathname(context.url.pathname);

    if (!objectiveSlug) {
      return createNotFoundResponse();
    }

    const body = await readCompletionRequestBody(request);

    if (!body) {
      return createBadRequestResponse('Request body must be valid JSON.');
    }

    const input = parseCompletionInput(objectiveSlug, body);

    if (input instanceof Response) {
      return input;
    }

    const snapshot = await registerObjectiveCompletionService.execute(context.env.DB, input);

    if (!snapshot) {
      return createNotFoundResponse();
    }

    return createJsonSuccessResponse(snapshot);
  };

  return handler;
}
