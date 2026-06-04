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

function createDatabaseStubWithPreparedResults(
  preparedResults: Array<Record<string, unknown>[]>,
): D1Database {
  let prepareCallIndex = 0;

  return {
    batch: async () => [],
    dump: async () => new ArrayBuffer(0),
    exec: async () => ({
      meta: {},
      success: true,
    }),
    prepare: () => {
      const results = preparedResults[prepareCallIndex] ?? [];
      prepareCallIndex += 1;

      return createPreparedStatementStub(results);
    },
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

  it('returns a structured route detail response at /routes/jaen-echoes-of-stone', async () => {
    const response = await workerEntrypoint.fetch(
      new Request('http://localhost/routes/jaen-echoes-of-stone'),
      createEnv({
        DB: createDatabaseStubWithPreparedResults([
          [
            {
              description:
                'Jaén: Echoes of Stone turns the city into a visual investigation, guiding visitors through real heritage details in the Cathedral of Jaén and the Arab Baths to unlock hidden stories.',
              destination_id: 'destination-jaen',
              destination_name: 'Jaén',
              destination_slug: 'jaen',
              difficulty: 'easy',
              display_order: 0,
              estimated_duration_minutes: 300,
              id: 'route-jaen-echoes-of-stone',
              slug: 'jaen-echoes-of-stone',
              status: 'published',
              title: 'Jaén: Echoes of Stone',
            },
          ],
          [
            {
              access_notes:
                'Located in Plaza de Santa María. Some objectives may require access to the cathedral interior, so opening hours and ticket availability should be checked before visiting.',
              description:
                'A monumental Renaissance cathedral in the heart of Jaén, where sacred architecture, hidden stone details and local legends make the city’s history feel alive.',
              display_order: 0,
              id: 'poi-catedral-de-jaen',
              indoor_mode: 1,
              latitude: 37.765738,
              longitude: -3.789518,
              name: 'Cathedral of Jaén',
              route_id: 'route-jaen-echoes-of-stone',
              slug: 'catedral-de-jaen',
              status: 'published',
            },
          ],
          [
            {
              description:
                'Find the statue of Saint Ferdinand, the Christian king linked to the conquest of Jaén and one of the key historical figures behind the city’s medieval memory.',
              difficulty: 'easy',
              display_order: 0,
              gps_radius_meters: 20,
              id: 'objective-catedral-de-jaen-estatua-san-fernando',
              indoor_mode: 0,
              poi_id: 'poi-catedral-de-jaen',
              slug: 'estatua-san-fernando',
              status: 'published',
              target_type: 'statue',
              title: 'Statue of Saint Ferdinand',
            },
          ],
        ]),
      }),
      createExecutionContext(),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');

    await expect(response.json()).resolves.toEqual({
      data: {
        route: {
          description:
            'Jaén: Echoes of Stone turns the city into a visual investigation, guiding visitors through real heritage details in the Cathedral of Jaén and the Arab Baths to unlock hidden stories.',
          destination: {
            id: 'destination-jaen',
            name: 'Jaén',
            slug: 'jaen',
          },
          difficulty: 'easy',
          displayOrder: 0,
          estimatedDurationMinutes: 300,
          id: 'route-jaen-echoes-of-stone',
          pois: [
            {
              accessNotes:
                'Located in Plaza de Santa María. Some objectives may require access to the cathedral interior, so opening hours and ticket availability should be checked before visiting.',
              description:
                'A monumental Renaissance cathedral in the heart of Jaén, where sacred architecture, hidden stone details and local legends make the city’s history feel alive.',
              displayOrder: 0,
              id: 'poi-catedral-de-jaen',
              indoorMode: 1,
              latitude: 37.765738,
              longitude: -3.789518,
              name: 'Cathedral of Jaén',
              objectives: [
                {
                  description:
                    'Find the statue of Saint Ferdinand, the Christian king linked to the conquest of Jaén and one of the key historical figures behind the city’s medieval memory.',
                  difficulty: 'easy',
                  displayOrder: 0,
                  gpsRadiusMeters: 20,
                  id: 'objective-catedral-de-jaen-estatua-san-fernando',
                  indoorMode: 0,
                  slug: 'estatua-san-fernando',
                  status: 'published',
                  targetType: 'statue',
                  title: 'Statue of Saint Ferdinand',
                },
              ],
              slug: 'catedral-de-jaen',
              status: 'published',
            },
          ],
          slug: 'jaen-echoes-of-stone',
          status: 'published',
          title: 'Jaén: Echoes of Stone',
        },
      },
      meta: {},
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
