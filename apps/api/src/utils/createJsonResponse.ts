import type { JsonHttpResponse } from '../types/http';

export function createJsonResponse(statusCode: number, payload: unknown): JsonHttpResponse {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  };
}
