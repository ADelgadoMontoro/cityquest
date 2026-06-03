import type { ApiRuntimeConfig } from '../config/apiConfig';
import type { WorkerExecutionContext, WorkerRuntimeEnv } from './worker';

export type RoutedHttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';

export type ApiRouteContext = {
  config: ApiRuntimeConfig;
  env: WorkerRuntimeEnv;
  executionContext: WorkerExecutionContext;
  url: URL;
};

export type ApiRouteHandler = (
  request: Request,
  context: ApiRouteContext,
) => Promise<Response> | Response;

export type ApiRouteDefinition = {
  methods: Partial<Record<RoutedHttpMethod, ApiRouteHandler>>;
  pathname: string;
};

export type ApiRouter = {
  handleRequest: (
    request: Request,
    env: WorkerRuntimeEnv,
    executionContext: WorkerExecutionContext,
  ) => Promise<Response>;
};
