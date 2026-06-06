import * as Location from 'expo-location';

import type { MobileObjectiveGpsValidationResult } from '@/types/objectiveLocation';

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function calculateDistanceMeters(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
): number {
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(deltaLongitude / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export async function validateObjectiveGpsRadius(
  target: { latitude: number; longitude: number },
  radiusMeters: number | null,
): Promise<MobileObjectiveGpsValidationResult> {
  if (radiusMeters === null) {
    return {
      status: 'radius_unavailable',
    };
  }

  const permission = await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Location permission is required to check whether you are within the objective radius.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const coordinates = {
    accuracyMeters: position.coords.accuracy ?? null,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  const distanceMeters = calculateDistanceMeters(coordinates, target);

  if (coordinates.accuracyMeters === null) {
    return {
      coordinates,
      radiusMeters,
      status: 'accuracy_too_low',
    };
  }

  if (distanceMeters - coordinates.accuracyMeters > radiusMeters) {
    return {
      coordinates,
      distanceMeters,
      radiusMeters,
      status: 'outside_radius',
    };
  }

  if (distanceMeters + coordinates.accuracyMeters <= radiusMeters) {
    return {
      coordinates,
      distanceMeters,
      radiusMeters,
      status: 'within_radius',
    };
  }

  return {
    coordinates,
    radiusMeters,
    status: 'accuracy_too_low',
  };
}
