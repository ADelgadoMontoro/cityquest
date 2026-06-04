import { describe, expect, it } from 'vitest';

import workerEntrypoint from '../../src';
import type { D1Database, D1PreparedStatement } from '../../src/types/cloudflare';
import type { WorkerExecutionContext, WorkerRuntimeEnv } from '../../src/types/worker';

function createExecutionContext(): WorkerExecutionContext {
  return {
    passThroughOnException: () => undefined,
    waitUntil: () => undefined,
  };
}

function createPreparedStatementStub(
  results: Record<string, unknown>[] = [],
): D1PreparedStatement {
  return {
    all: async () => ({
      meta: {},
      results,
      success: true,
    }),
    bind: () => createPreparedStatementStub(results),
    first: async () => null,
    raw: async () => [],
    run: async () => ({
      meta: {},
      success: true,
    }),
  };
}

function createDatabaseStub(results: Record<string, unknown>[] = []): D1Database {
  return {
    batch: async () => [],
    dump: async () => new ArrayBuffer(0),
    exec: async () => ({
      meta: {},
      success: true,
    }),
    prepare: () => createPreparedStatementStub(results),
  };
}

function createEnv(overrides: Partial<WorkerRuntimeEnv> = {}): WorkerRuntimeEnv {
  return {
    DB: createDatabaseStub(),
    CITYQUEST_API_NAME: 'cityquest-api',
    CITYQUEST_APP_ENV: 'development',
    CITYQUEST_LOG_LEVEL: 'info',
    ...overrides,
  };
}

describe('workerEntrypoint integration', () => {
  it('returns a structured health response at /health', async () => {
    const response = await workerEntrypoint.fetch(
      new Request('http://localhost/health'),
      createEnv(),
      createExecutionContext(),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');

    const payload = await response.json();

    expect(payload).toEqual({
      data: {
        environment: 'development',
        service: 'cityquest-api',
        status: 'ok',
      },
      meta: {
        timestamp: expect.any(String),
      },
      success: true,
    });
  });

  it('returns a structured destinations listing at /destinations', async () => {
    const response = await workerEntrypoint.fetch(
      new Request('http://localhost/destinations'),
      createEnv({
        DB: createDatabaseStub([
          {
            cover_image_url: null,
            description:
              'Jaén is a historic Andalusian city where castles, cathedrals, Arab baths and local legends reveal centuries of cultural heritage.',
            display_order: 0,
            id: 'destination-jaen',
            name: 'Jaén',
            slug: 'jaen',
            status: 'published',
          },
        ]),
      }),
      createExecutionContext(),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');

    await expect(response.json()).resolves.toEqual({
      data: {
        destinations: [
          {
            coverImageUrl: null,
            description:
              'Jaén is a historic Andalusian city where castles, cathedrals, Arab baths and local legends reveal centuries of cultural heritage.',
            displayOrder: 0,
            id: 'destination-jaen',
            name: 'Jaén',
            slug: 'jaen',
            status: 'published',
          },
        ],
      },
      meta: {
        count: 1,
      },
      success: true,
    });
  });

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

  it('returns method-not-allowed for unsupported methods on /health', async () => {
    const response = await workerEntrypoint.fetch(
      new Request('http://localhost/health', {
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

  it('handles cors preflight requests for /health', async () => {
    const response = await workerEntrypoint.fetch(
      new Request('http://localhost/health', {
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
