import { describe, expect, it } from 'vitest';

import { validateObjectiveImageMock } from '@/services/objectiveVisualValidation';
import type { MobileCurrentObjectiveSnapshot } from '@/types/route';

const currentObjective: MobileCurrentObjectiveSnapshot = {
  destinationName: 'Jaen',
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
  poiLatitude: 37.765738,
  poiLongitude: -3.789518,
  poiName: 'Cathedral of Jaen',
  routeSlug: 'jaen-echoes-of-stone',
  routeTitle: 'Jaen: Echoes of Stone',
};

describe('objectiveVisualValidation', () => {
  it('blocks validation when the objective context is missing', () => {
    expect(validateObjectiveImageMock(null, null)).toEqual({
      message: 'The objective context must be loaded before running the visual mock.',
      status: 'blocked',
    });
  });

  it('blocks validation when no image is ready', () => {
    expect(validateObjectiveImageMock(currentObjective, null)).toEqual({
      message: 'Capture or choose an image before running the visual mock.',
      status: 'blocked',
    });
  });

  it('passes the mock when an objective and image are available', () => {
    expect(
      validateObjectiveImageMock(currentObjective, {
        fileName: 'objective.jpg',
        height: 720,
        mimeType: 'image/jpeg',
        uri: 'file:///objective.jpg',
        width: 1280,
      }),
    ).toEqual({
      confidence: 0.86,
      message:
        'Mock visual validation passed. This only confirms that an image is ready for the future recognition step.',
      status: 'passed',
    });
  });
});
