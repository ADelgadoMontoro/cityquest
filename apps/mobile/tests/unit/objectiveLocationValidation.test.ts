import { describe, expect, it, vi } from 'vitest';

import {
  calculateDistanceMeters,
  validateObjectiveGpsRadius,
} from '@/services/objectiveLocationValidation';

vi.mock('expo-location', () => ({
  Accuracy: {
    Balanced: 'balanced',
  },
  PermissionStatus: {
    DENIED: 'denied',
    GRANTED: 'granted',
    UNDETERMINED: 'undetermined',
  },
  getCurrentPositionAsync: vi.fn(),
  requestForegroundPermissionsAsync: vi.fn(),
}));

import * as Location from 'expo-location';

describe('objectiveLocationValidation', () => {
  it('returns zero distance for matching coordinates', () => {
    expect(
      calculateDistanceMeters(
        { latitude: 37.779, longitude: -3.785 },
        { latitude: 37.779, longitude: -3.785 },
      ),
    ).toBe(0);
  });

  it('returns radius unavailable when the objective has no GPS radius', async () => {
    await expect(
      validateObjectiveGpsRadius({ latitude: 37.779, longitude: -3.785 }, null),
    ).resolves.toEqual({
      status: 'radius_unavailable',
    });
  });

  it('throws when location permission is denied', async () => {
    vi.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      canAskAgain: true,
      expires: 'never',
      granted: false,
      status: Location.PermissionStatus.DENIED,
    });

    await expect(
      validateObjectiveGpsRadius({ latitude: 37.779, longitude: -3.785 }, 20),
    ).rejects.toThrow(
      'Location permission is required to check whether you are within the objective radius.',
    );
  });

  it('returns within_radius when the user is inside the configured radius', async () => {
    vi.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      canAskAgain: true,
      expires: 'never',
      granted: true,
      status: Location.PermissionStatus.GRANTED,
    });
    vi.mocked(Location.getCurrentPositionAsync).mockResolvedValue({
      coords: {
        accuracy: 4,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 37.779,
        longitude: -3.785,
        speed: null,
      },
      mocked: false,
      timestamp: 1,
    });

    await expect(
      validateObjectiveGpsRadius({ latitude: 37.77901, longitude: -3.78501 }, 20),
    ).resolves.toMatchObject({
      radiusMeters: 20,
      status: 'within_radius',
    });
  });

  it('returns accuracy_too_low when the location fix leaves the result ambiguous near the radius boundary', async () => {
    vi.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      canAskAgain: true,
      expires: 'never',
      granted: true,
      status: Location.PermissionStatus.GRANTED,
    });
    vi.mocked(Location.getCurrentPositionAsync).mockResolvedValue({
      coords: {
        accuracy: 75,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 37.779,
        longitude: -3.785,
        speed: null,
      },
      mocked: false,
      timestamp: 1,
    });

    await expect(
      validateObjectiveGpsRadius({ latitude: 37.77918, longitude: -3.78518 }, 20),
    ).resolves.toMatchObject({
      radiusMeters: 20,
      status: 'accuracy_too_low',
    });
  });

  it('returns outside_radius when the user is clearly too far away even with low GPS precision', async () => {
    vi.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      canAskAgain: true,
      expires: 'never',
      granted: true,
      status: Location.PermissionStatus.GRANTED,
    });
    vi.mocked(Location.getCurrentPositionAsync).mockResolvedValue({
      coords: {
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 37.779,
        longitude: -3.785,
        speed: null,
      },
      mocked: false,
      timestamp: 1,
    });

    await expect(
      validateObjectiveGpsRadius({ latitude: 37.7905, longitude: -3.79 }, 20),
    ).resolves.toMatchObject({
      radiusMeters: 20,
      status: 'outside_radius',
    });
  });

  it('returns outside_radius when the user is too far away', async () => {
    vi.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      canAskAgain: true,
      expires: 'never',
      granted: true,
      status: Location.PermissionStatus.GRANTED,
    });
    vi.mocked(Location.getCurrentPositionAsync).mockResolvedValue({
      coords: {
        accuracy: 6,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 37.779,
        longitude: -3.785,
        speed: null,
      },
      mocked: false,
      timestamp: 1,
    });

    await expect(
      validateObjectiveGpsRadius({ latitude: 37.7905, longitude: -3.79 }, 20),
    ).resolves.toMatchObject({
      radiusMeters: 20,
      status: 'outside_radius',
    });
  });
});
