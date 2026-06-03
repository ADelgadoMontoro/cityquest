const allowedHeaders = ['authorization', 'content-type', 'x-requested-with'];
const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

export function applyCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  createCorsHeaders().forEach((value, key) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export function createCorsHeaders(): Headers {
  const headers = new Headers();

  headers.set('access-control-allow-headers', allowedHeaders.join(', '));
  headers.set('access-control-allow-methods', allowedMethods.join(', '));
  headers.set('access-control-allow-origin', '*');

  return headers;
}

export function createPreflightResponse(): Response {
  return new Response(null, {
    headers: createCorsHeaders(),
    status: 204,
  });
}
