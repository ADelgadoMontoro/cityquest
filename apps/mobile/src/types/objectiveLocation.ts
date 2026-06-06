export type MobileObjectiveLocationCoordinates = {
  accuracyMeters: number | null;
  latitude: number;
  longitude: number;
};

export type MobileObjectiveGpsValidationResult =
  | {
      status: 'within_radius';
      coordinates: MobileObjectiveLocationCoordinates;
      distanceMeters: number;
      radiusMeters: number;
    }
  | {
      status: 'outside_radius';
      coordinates: MobileObjectiveLocationCoordinates;
      distanceMeters: number;
      radiusMeters: number;
    }
  | {
      status: 'accuracy_too_low';
      coordinates: MobileObjectiveLocationCoordinates;
      radiusMeters: number;
    }
  | {
      status: 'radius_unavailable';
    };
