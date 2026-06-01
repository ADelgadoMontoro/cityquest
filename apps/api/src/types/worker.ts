export type WorkerRuntimeEnv = {
  CITYQUEST_API_NAME?: string;
  CITYQUEST_APP_ENV?: string;
  CITYQUEST_LOG_LEVEL?: string;
};

export type WorkerExecutionContext = {
  passThroughOnException: () => void;
  waitUntil: (promise: Promise<unknown>) => void;
};

export type WorkerEntrypoint = {
  fetch: (
    request: Request,
    env: WorkerRuntimeEnv,
    ctx: WorkerExecutionContext,
  ) => Promise<Response>;
};
