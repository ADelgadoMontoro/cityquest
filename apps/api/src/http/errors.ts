import { createJsonResponse } from './responses';

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
  };
  success: false;
};

export function createJsonErrorResponse(
  status: number,
  code: string,
  message: string,
  options: Omit<ResponseInit, 'status'> = {},
): Response {
  return createJsonResponse(status, {
    error: {
      code,
      message,
    },
    success: false,
  } satisfies ApiErrorPayload, options);
}

export function createMethodNotAllowedResponse(allowedMethods: string[]): Response {
  return createJsonErrorResponse(405, 'METHOD_NOT_ALLOWED', 'Method not allowed.', {
    headers: {
      allow: allowedMethods.join(', '),
    },
  });
}

export function createNotFoundResponse(): Response {
  return createJsonErrorResponse(404, 'NOT_FOUND', 'Route not found.');
}
