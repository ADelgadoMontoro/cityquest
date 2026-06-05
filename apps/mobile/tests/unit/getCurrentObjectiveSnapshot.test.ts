import { describe, expect, it, vi } from 'vitest';

import { getCurrentObjectiveSnapshot } from '@/services/getCurrentObjectiveSnapshot';
import { getRouteDetail } from '@/services/getRouteDetail';
import type { MobileRouteDetail } from '@/types/route';

vi.mock('@/services/getRouteDetail', () => ({
  getRouteDetail: vi.fn(),
}));

function createRouteDetailFixture(): MobileRouteDetail {
  return {
    destination: {
      name: 'Jaén',
      slug: 'jaen',
    },
    pois: [
      {
        description: 'Second POI by order but listed first on purpose.',
        displayOrder: 1,
        indoorMode: true,
        name: 'Arab Baths of Jaén',
        objectives: [
          {
            description: 'Find the central pool.',
            difficulty: 'easy',
            displayOrder: 1,
            gpsRadiusMeters: 3,
            indoorMode: true,
            slug: 'piscina-sala-templada-banos-arabes',
            targetType: 'pool',
            title: 'Warm Room Central Pool',
          },
        ],
        slug: 'banos-arabes-jaen',
      },
      {
        description: 'First POI by order but listed second on purpose.',
        displayOrder: 0,
        indoorMode: true,
        name: 'Cathedral of Jaén',
        objectives: [
          {
            description: 'Find the monkey detail.',
            difficulty: 'hard',
            displayOrder: 1,
            gpsRadiusMeters: 3,
            indoorMode: false,
            slug: 'mona-catedral-jaen',
            targetType: 'architectural_detail',
            title: 'Cathedral Monkey',
          },
          {
            description: 'Find the statue of Saint Ferdinand.',
            difficulty: 'easy',
            displayOrder: 0,
            gpsRadiusMeters: 20,
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
      description: 'Route detail.',
      difficulty: 'easy',
      estimatedDurationMinutes: 300,
      slug: 'jaen-echoes-of-stone',
      title: 'Jaén: Echoes of Stone',
    },
  };
}

describe('getCurrentObjectiveSnapshot', () => {
  it('returns the explicitly requested objective when a slug is provided', async () => {
    vi.mocked(getRouteDetail).mockResolvedValue(createRouteDetailFixture());

    await expect(
      getCurrentObjectiveSnapshot('jaen-echoes-of-stone', 'piscina-sala-templada-banos-arabes'),
    ).resolves.toEqual({
      destinationName: 'Jaén',
      objective: {
        description: 'Find the central pool.',
        difficulty: 'easy',
        displayOrder: 1,
        gpsRadiusMeters: 3,
        indoorMode: true,
        slug: 'piscina-sala-templada-banos-arabes',
        targetType: 'pool',
        title: 'Warm Room Central Pool',
      },
      poiName: 'Arab Baths of Jaén',
      routeSlug: 'jaen-echoes-of-stone',
      routeTitle: 'Jaén: Echoes of Stone',
    });
  });

  it('falls back to the first ordered objective when no slug is provided', async () => {
    vi.mocked(getRouteDetail).mockResolvedValue(createRouteDetailFixture());

    await expect(getCurrentObjectiveSnapshot('jaen-echoes-of-stone')).resolves.toEqual({
      destinationName: 'Jaén',
      objective: {
        description: 'Find the statue of Saint Ferdinand.',
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
  });

  it('returns null when the route has no objectives', async () => {
    vi.mocked(getRouteDetail).mockResolvedValue({
      ...createRouteDetailFixture(),
      pois: [
        {
          ...createRouteDetailFixture().pois[0]!,
          objectives: [],
        },
      ],
    });

    await expect(getCurrentObjectiveSnapshot('jaen-echoes-of-stone')).resolves.toBeNull();
  });
});
