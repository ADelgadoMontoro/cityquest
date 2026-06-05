import { describe, expect, it, vi } from 'vitest';

import {
  listDestinationSelectorItems,
  listLockedDestinationSelectorItems,
} from '@/services/listDestinationSelectorItems';

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json',
    },
    status,
  });
}

describe('listDestinationSelectorItems', () => {
  it('separates playable and published-but-unrouted destinations from the live payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createJsonResponse({
          data: {
            destinations: [
              {
                coverImageUrl: null,
                description: 'Historic Andalusian capital.',
                displayOrder: 1,
                id: 'destination-jaen',
                name: 'Jaén',
                slug: 'jaen',
                status: 'published',
              },
              {
                coverImageUrl: null,
                description: 'Renaissance twin city.',
                displayOrder: 0,
                id: 'destination-baeza',
                name: 'Baeza',
                slug: 'baeza-live',
                status: 'published',
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

    const result = await listDestinationSelectorItems();

    expect(result.availableDestinations).toEqual([
      {
        availability: 'available',
        coverImageUrl: null,
        description: 'Historic Andalusian capital.',
        displayOrder: 1,
        id: 'destination-jaen',
        name: 'Jaén',
        routeSlug: 'jaen-echoes-of-stone',
        routeTitle: 'Jaén: Echoes of Stone',
        slug: 'jaen',
        status: 'published',
      },
    ]);

    expect(result.publishedUnroutedDestinations).toEqual([
      {
        availability: 'publishedUnrouted',
        coverImageUrl: null,
        description: 'Renaissance twin city.',
        displayOrder: 0,
        id: 'destination-baeza',
        name: 'Baeza',
        slug: 'baeza-live',
        status: 'published',
      },
    ]);

    expect(result.lockedDestinations).toEqual(listLockedDestinationSelectorItems());
  });

  it('maps missing descriptions to safe empty strings', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createJsonResponse({
          data: {
            destinations: [
              {
                coverImageUrl: null,
                description: null,
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
        }),
      ),
    );

    const result = await listDestinationSelectorItems();

    expect(result.availableDestinations[0]?.description).toBe('');
  });

  it('throws a useful error when the Worker returns a non-success status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('failure', { status: 503 })));

    await expect(listDestinationSelectorItems()).rejects.toThrow(
      'Failed to load destinations: 503',
    );
  });
});
