export type JsonHttpResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

export type JsonResponseBody = Record<string, unknown>;
