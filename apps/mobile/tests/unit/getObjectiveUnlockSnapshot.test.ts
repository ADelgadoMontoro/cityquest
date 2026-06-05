import { getCurrentObjectiveSnapshot } from '@/services/getCurrentObjectiveSnapshot';
import { getObjectiveUnlockSnapshot } from '@/services/getObjectiveUnlockSnapshot';

vi.mock('@/services/getCurrentObjectiveSnapshot', () => ({
  getCurrentObjectiveSnapshot: vi.fn(),
}));

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json',
    },
    status,
  });
}

describe('getObjectiveUnlockSnapshot', () => {
  it('returns null when the current objective cannot be resolved', async () => {
    vi.mocked(getCurrentObjectiveSnapshot).mockResolvedValue(null);
    const fetchMock = vi.fn();

    vi.stubGlobal('fetch', fetchMock);

    await expect(getObjectiveUnlockSnapshot('jaen-echoes-of-stone')).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps and sorts unlockable content from the live API payload', async () => {
    vi.mocked(getCurrentObjectiveSnapshot).mockResolvedValue({
      destinationName: 'Jaén',
      objective: {
        description: 'Find the statue.',
        difficulty: 'easy',
        displayOrder: 0,
        gpsRadiusMeters: 20,
        indoorMode: false,
        slug: 'estatua-san-fernando',
        targetType: 'statue',
        title: 'Statue of Saint Ferdinand',
      },
      poiName: 'Cathedral of Jaén',
      routeSlug: 'jaen-echoes-of-stone',
      routeTitle: 'Jaén: Echoes of Stone',
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createJsonResponse({
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
                displayOrder: 1,
                id: 'unlock-2',
                imageUrl: null,
                longText: null,
                shortText: null,
                title: 'Second unlock',
              },
              {
                audioUrl: null,
                contentType: 'text',
                displayOrder: 0,
                id: 'unlock-1',
                imageUrl: null,
                longText: 'Long reward text.',
                shortText: 'Short reward text.',
                title: 'First unlock',
              },
            ],
          },
          meta: {
            count: 2,
          },
          success: true,
        }),
      ),
    );

    await expect(
      getObjectiveUnlockSnapshot('jaen-echoes-of-stone', 'estatua-san-fernando'),
    ).resolves.toEqual({
      destinationName: 'Jaén',
      objective: {
        slug: 'estatua-san-fernando',
        title: 'Statue of Saint Ferdinand',
      },
      poiName: 'Cathedral of Jaén',
      routeSlug: 'jaen-echoes-of-stone',
      routeTitle: 'Jaén: Echoes of Stone',
      unlockableContents: [
        {
          audioUrl: null,
          contentType: 'text',
          displayOrder: 0,
          id: 'unlock-1',
          imageUrl: null,
          longText: 'Long reward text.',
          shortText: 'Short reward text.',
          title: 'First unlock',
        },
        {
          audioUrl: null,
          contentType: 'text',
          displayOrder: 1,
          id: 'unlock-2',
          imageUrl: null,
          longText: '',
          shortText: '',
          title: 'Second unlock',
        },
      ],
    });
  });

  it('returns null when the Worker returns 404 for the objective unlocks endpoint', async () => {
    vi.mocked(getCurrentObjectiveSnapshot).mockResolvedValue({
      destinationName: 'Jaén',
      objective: {
        description: 'Find the statue.',
        difficulty: 'easy',
        displayOrder: 0,
        gpsRadiusMeters: 20,
        indoorMode: false,
        slug: 'estatua-san-fernando',
        targetType: 'statue',
        title: 'Statue of Saint Ferdinand',
      },
      poiName: 'Cathedral of Jaén',
      routeSlug: 'jaen-echoes-of-stone',
      routeTitle: 'Jaén: Echoes of Stone',
    });

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

    await expect(
      getObjectiveUnlockSnapshot('jaen-echoes-of-stone', 'estatua-san-fernando'),
    ).resolves.toBeNull();
  });
});
