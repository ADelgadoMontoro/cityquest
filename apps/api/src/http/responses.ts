type CreateJsonResponseOptions = Omit<ResponseInit, 'status'>;

export type ApiSuccessPayload<TData> = {
  data: TData;
  meta: Record<string, unknown>;
  success: true;
};

export function createJsonResponse(
  status: number,
  payload: unknown,
  options: CreateJsonResponseOptions = {},
): Response {
  const headers = new Headers(options.headers);

  headers.set('content-type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(payload), {
    ...options,
    headers,
    status,
  });
}

export function createJsonSuccessResponse<TData>(
  data: TData,
  options: {
    meta?: Record<string, unknown>;
    status?: number;
  } = {},
): Response {
  return createJsonResponse(options.status ?? 200, {
    data,
    meta: options.meta ?? {},
    success: true,
  } satisfies ApiSuccessPayload<TData>);
}
