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
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
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
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found.',
      },
      success: false,
    });
  });

  it('returns a method-not-allowed payload for unsupported methods on known routes', async () => {
    const response = await workerEntrypoint.fetch(
      new Request('http://localhost/', {
        method: 'POST',
      }),
      createEnv(),
      createExecutionContext(),
    );

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed.',
      },
      success: false,
    });
  });

  it('handles cors preflight requests centrally', async () => {
    const response = await workerEntrypoint.fetch(
      new Request('http://localhost/unknown', {
        method: 'OPTIONS',
      }),
      createEnv(),
      createExecutionContext(),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('access-control-allow-methods')).toContain('OPTIONS');
    expect(response.headers.get('access-control-allow-headers')).toContain('content-type');
    await expect(response.text()).resolves.toBe('');
  });
});
