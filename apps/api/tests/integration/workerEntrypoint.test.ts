import { describe, expect, it } from 'vitest';

import workerEntrypoint from '../../src';
import type { WorkerExecutionContext, WorkerRuntimeEnv } from '../../src/types/worker';

function createExecutionContext(): WorkerExecutionContext {
  return {
    passThroughOnException: () => undefined,
    waitUntil: () => undefined,
  };
}

function createEnv(overrides: Partial<WorkerRuntimeEnv> = {}): WorkerRuntimeEnv {
  return {
    CITYQUEST_API_NAME: 'cityquest-api',
    CITYQUEST_APP_ENV: 'development',
    CITYQUEST_LOG_LEVEL: 'info',
    ...overrides,
  };
}

describe('workerEntrypoint integration', () => {
  it('returns the initialization response at the root route', async () => {
    const response = await workerEntrypoint.fetch(
      new Request('http://localhost/'),
      createEnv(),
      createExecutionContext(),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    await expect(response.json()).resolves.toEqual({
      environment: 'development',
      service: 'cityquest-api',
      status: 'initialized',
    });
  });

  it('returns a not-found payload for unsupported routes', async () => {
    const response = await workerEntrypoint.fetch(
      new Request('http://localhost/unknown'),
      createEnv(),
      createExecutionContext(),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: 'not_found',
      message: 'Route not found.',
    });
  });
});
