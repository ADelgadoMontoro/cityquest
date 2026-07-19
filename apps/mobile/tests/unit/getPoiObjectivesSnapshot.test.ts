import { describe, expect, it } from 'vitest';

import { buildPoiObjectivesSnapshot } from '@/services/getPoiObjectivesSnapshot';
import type { MobileRouteObjectiveProgressSnapshot } from '@/types/objectiveProgress';
import type { MobileRouteDetail } from '@/types/route';

function createRouteDetailFixture(): MobileRouteDetail {
  return {
    destination: {
      name: 'Jaén',
      slug: 'jaen',
    },
    pois: [
      {
        description: 'Cathedral POI.',
        displayOrder: 0,
        indoorMode: true,
        latitude: 37.765738,
        longitude: -3.789518,
        name: 'Cathedral of Jaén',
        objectives: [
          {
            description: 'Find the statue.',
            difficulty: 'easy',
            displayOrder: 0,
            gpsRadiusMeters: 700,
            indoorMode: false,
            slug: 'estatua-san-fernando',
            targetType: 'statue',
            title: 'Statue of Saint Ferdinand',
          },
          {
            description: 'Find the monkey.',
            difficulty: 'hard',
            displayOrder: 1,
            gpsRadiusMeters: 700,
            indoorMode: false,
            slug: 'mona-catedral-jaen',
            targetType: 'architectural_detail',
            title: 'Cathedral Monkey',
          },
          {
            description: 'Find the choir panel.',
            difficulty: 'medium',
            displayOrder: 2,
            gpsRadiusMeters: 700,
            indoorMode: true,
            slug: 'placa-santa-catalina-coro',
            targetType: 'decorative_panel',
            title: 'Saint Catherine Choir Panel',
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

const progressFixture: MobileRouteObjectiveProgressSnapshot = {
  actorId: 'cityquest-local-demo-actor',
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
    {
      completedAt: null,
      objectiveSlug: 'placa-santa-catalina-coro',
      poiSlug: 'catedral-de-jaen',
      status: 'locked',
    },
  ],
  route: {
    slug: 'jaen-echoes-of-stone',
    title: 'Jaén: Echoes of Stone',
  },
};

describe('buildPoiObjectivesSnapshot', () => {
  it('merges route POI objectives with completed/current/locked progress', () => {
    expect(
      buildPoiObjectivesSnapshot(createRouteDetailFixture(), progressFixture, 'catedral-de-jaen'),
    ).toMatchObject({
      destinationName: 'Jaén',
      poi: {
        name: 'Cathedral of Jaén',
        objectives: [
          {
            completedAt: '2026-07-19T17:21:41.608Z',
            progressStatus: 'completed',
            slug: 'estatua-san-fernando',
          },
          {
            completedAt: null,
            progressStatus: 'current',
            slug: 'mona-catedral-jaen',
          },
          {
            completedAt: null,
            progressStatus: 'locked',
            slug: 'placa-santa-catalina-coro',
          },
        ],
      },
      routeSlug: 'jaen-echoes-of-stone',
      routeTitle: 'Jaén: Echoes of Stone',
    });
  });

  it('returns null when the POI is missing from route detail', () => {
    expect(
      buildPoiObjectivesSnapshot(createRouteDetailFixture(), progressFixture, 'missing-poi'),
    ).toBeNull();
  });

  it('keeps unmatched route objectives locked by default', () => {
    expect(
      buildPoiObjectivesSnapshot(
        createRouteDetailFixture(),
        {
          ...progressFixture,
          objectives: progressFixture.objectives.slice(0, 1),
        },
        'catedral-de-jaen',
      )?.poi.objectives.map((objective) => ({
        progressStatus: objective.progressStatus,
        slug: objective.slug,
      })),
    ).toEqual([
      {
        progressStatus: 'completed',
        slug: 'estatua-san-fernando',
      },
      {
        progressStatus: 'locked',
        slug: 'mona-catedral-jaen',
      },
      {
        progressStatus: 'locked',
        slug: 'placa-santa-catalina-coro',
      },
    ]);
  });
});
