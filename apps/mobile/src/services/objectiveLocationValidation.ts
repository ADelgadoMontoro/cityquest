import * as Location from 'expo-location';

import type { MobileObjectiveGpsValidationResult } from '@/types/objectiveLocation';

const EARTH_RADIUS_METERS = 6_371_000;
const LOCATION_SAMPLE_COUNT = 3;
const MIN_ACCEPTABLE_ACCURACY_METERS = 75;
const MAX_ACCEPTABLE_ACCURACY_METERS = 150;
const ACCEPTABLE_ACCURACY_RADIUS_RATIO = 0.5;

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

function getRequiredAccuracyMeters(radiusMeters: number): number {
  return Math.min(
    MAX_ACCEPTABLE_ACCURACY_METERS,
    Math.max(MIN_ACCEPTABLE_ACCURACY_METERS, radiusMeters * ACCEPTABLE_ACCURACY_RADIUS_RATIO),
  );
}

async function getBestCurrentPositionAsync() {
  const positions: Location.LocationObject[] = [];

  for (let sampleIndex = 0; sampleIndex < LOCATION_SAMPLE_COUNT; sampleIndex += 1) {
    positions.push(
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 0,
        mayShowUserSettingsDialog: true,
        timeInterval: 1_000,
      }),
    );
  }

  return positions.sort(
    (left, right) =>
      (left.coords.accuracy ?? Number.POSITIVE_INFINITY) -
      (right.coords.accuracy ?? Number.POSITIVE_INFINITY),
  )[0]!;
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

  const position = await getBestCurrentPositionAsync();

  const coordinates = {
    accuracyMeters: position.coords.accuracy ?? null,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  const distanceMeters = calculateDistanceMeters(coordinates, target);
  const requiredAccuracyMeters = getRequiredAccuracyMeters(radiusMeters);

  if (coordinates.accuracyMeters === null) {
    return {
      coordinates,
      distanceMeters,
      radiusMeters,
      requiredAccuracyMeters,
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

  if (distanceMeters <= radiusMeters && coordinates.accuracyMeters <= requiredAccuracyMeters) {
    return {
      coordinates,
      distanceMeters,
      radiusMeters,
      status: 'within_radius',
    };
  }

  return {
    coordinates,
    distanceMeters,
    radiusMeters,
    requiredAccuracyMeters,
    status: 'accuracy_too_low',
  };
}
