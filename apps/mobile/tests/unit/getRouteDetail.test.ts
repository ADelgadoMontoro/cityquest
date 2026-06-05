import { getRouteDetail } from '@/services/getRouteDetail';

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json',
    },
    status,
  });
}

describe('getRouteDetail', () => {
  it('returns null when the route is not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

    await expect(getRouteDetail('missing-route')).resolves.toBeNull();
  });

  it('maps nullable backend fields into safe mobile defaults', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createJsonResponse({
          data: {
            route: {
              description: null,
              destination: {
                id: 'destination-jaen',
                name: 'Jaén',
                slug: 'jaen',
              },
              difficulty: null,
              displayOrder: 0,
              estimatedDurationMinutes: null,
              id: 'route-jaen-echoes-of-stone',
              pois: [
                {
                  accessNotes: null,
                  description: null,
                  displayOrder: 0,
                  id: 'poi-catedral-de-jaen',
                  indoorMode: 1,
                  latitude: 37.765738,
                  longitude: -3.789518,
                  name: 'Cathedral of Jaén',
                  objectives: [
                    {
                      description: null,
                      difficulty: null,
                      displayOrder: 0,
                      gpsRadiusMeters: null,
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
        }),
      ),
    );

    await expect(getRouteDetail('jaen-echoes-of-stone')).resolves.toEqual({
      destination: {
        name: 'Jaén',
        slug: 'jaen',
      },
      pois: [
        {
          description: '',
          displayOrder: 0,
          indoorMode: true,
          name: 'Cathedral of Jaén',
          objectives: [
            {
              description: '',
              difficulty: 'unknown',
              displayOrder: 0,
              gpsRadiusMeters: null,
              indoorMode: false,
              slug: 'estatua-san-fernando',
              targetType: 'statue',
              title: 'Statue of Saint Ferdinand',
            },
          ],
          slug: 'catedral-de-jaen',
        },
      ],
      route: {
        description: '',
        difficulty: 'unknown',
        estimatedDurationMinutes: 0,
        slug: 'jaen-echoes-of-stone',
        title: 'Jaén: Echoes of Stone',
      },
    });
  });

  it('throws a useful error for unexpected HTTP failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('failure', { status: 500 })));

    await expect(getRouteDetail('jaen-echoes-of-stone')).rejects.toThrow(
      'Failed to load route detail: 500',
    );
  });
});
