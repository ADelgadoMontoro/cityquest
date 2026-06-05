import { describe, expect, it, vi } from 'vitest';

import { getCurrentObjectiveSnapshot } from '@/services/getCurrentObjectiveSnapshot';
import { getObjectiveUnlockSnapshot } from '@/services/getObjectiveUnlockSnapshot';
import { listDestinationSelectorItems } from '@/services/listDestinationSelectorItems';

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json',
    },
    status,
  });
}

describe('live MVP mobile service flow', () => {
  it('walks from destinations to objective reward using live-backed service adapters', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      if (url.endsWith('/destinations')) {
        return createJsonResponse({
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
      }

      if (url.endsWith('/routes/jaen-echoes-of-stone')) {
        return createJsonResponse({
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
                  accessNotes: null,
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
      }

      if (url.endsWith('/objectives/estatua-san-fernando/unlocks')) {
        return createJsonResponse({
          data: {
            objective: {
              id: 'objective-catedral-de-jaen-estatua-san-fernando',
              slug: 'estatua-san-fernando',
              title: 'Statue of Saint Ferdinand',
            },
            unlockableContents: [
              {
                audioUrl: null,
                contentType: 'text',
                displayOrder: 0,
                id: 'unlockable-estatua-san-fernando-king-who-changed-jaen',
                imageUrl: null,
                longText:
                  'Ferdinand III, later known as Saint Ferdinand, is one of the key figures in the medieval history of Jaén.',
                shortText:
                  'This statue represents Ferdinand III of Castile, the Christian king whose conquest of Jaén in 1246 marked a turning point in the city’s medieval history.',
                title: 'The King Who Changed Jaén',
              },
            ],
          },
          meta: {
            count: 1,
          },
          success: true,
        });
      }

      throw new Error(`Unexpected URL in live MVP service flow test: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    const destinations = await listDestinationSelectorItems();
    const routeSlug = destinations.availableDestinations[0]?.routeSlug;

    expect(routeSlug).toBe('jaen-echoes-of-stone');

    const currentObjective = await getCurrentObjectiveSnapshot(routeSlug ?? '');
    const objectiveSlug = currentObjective?.objective.slug;

    expect(objectiveSlug).toBe('estatua-san-fernando');

    const reward = await getObjectiveUnlockSnapshot(routeSlug ?? '', objectiveSlug);

    expect(reward?.unlockableContents[0]?.title).toBe('The King Who Changed Jaén');
    expect(reward?.poiName).toBe('Cathedral of Jaén');
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
