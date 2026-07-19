import { describe, expect, it, vi } from 'vitest';

import { getRouteObjectiveProgress } from '@/services/getRouteObjectiveProgress';
import { MVP_DEMO_ACTOR_ID } from '@/services/registerObjectiveCompletion';

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json',
    },
    status,
  });
}

describe('getRouteObjectiveProgress', () => {
  it('maps route objective progress from the live API payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        data: {
          actorId: MVP_DEMO_ACTOR_ID,
          objectives: [
            {
              completedAt: '2026-07-19T17:21:41.608Z',
              objectiveSlug: 'estatua-san-fernando',
              poiSlug: 'catedral-de-jaen',
              status: 'completed',
            },
            {
              completedAt: null,
              objectiveSlug: 'mona-catedral-jaen',
              poiSlug: 'catedral-de-jaen',
              status: 'current',
            },
          ],
          route: {
            slug: 'jaen-echoes-of-stone',
            title: 'Jaén: Echoes of Stone',
          },
        },
        meta: {},
        success: true,
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(getRouteObjectiveProgress('jaen-echoes-of-stone')).resolves.toEqual({
      actorId: MVP_DEMO_ACTOR_ID,
      objectives: [
        {
          completedAt: '2026-07-19T17:21:41.608Z',
          objectiveSlug: 'estatua-san-fernando',
          poiSlug: 'catedral-de-jaen',
          status: 'completed',
        },
        {
          completedAt: null,
          objectiveSlug: 'mona-catedral-jaen',
          poiSlug: 'catedral-de-jaen',
          status: 'current',
        },
      ],
      route: {
        slug: 'jaen-echoes-of-stone',
        title: 'Jaén: Echoes of Stone',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      [
        'http://127.0.0.1:8787/routes/jaen-echoes-of-stone/objective-progress',
        `?actorId=${MVP_DEMO_ACTOR_ID}`,
      ].join(''),
      expect.objectContaining({
        method: 'GET',
      }),
    );
  });

  it('returns null when the route progress endpoint returns 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

    await expect(getRouteObjectiveProgress('missing-route')).resolves.toBeNull();
  });

  it('throws a useful error for unexpected HTTP failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('failure', { status: 500 })));

    await expect(getRouteObjectiveProgress('jaen-echoes-of-stone')).rejects.toThrow(
      'Failed to load route objective progress: 500',
    );
  });
});
