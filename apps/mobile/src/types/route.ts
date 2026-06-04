export type MobileObjectiveSummary = {
  slug: string;
  title: string;
  description: string;
  targetType: string;
  difficulty: string;
  gpsRadiusMeters: number | null;
  indoorMode: boolean;
  displayOrder: number;
};

export type MobilePoiDetail = {
  slug: string;
  name: string;
  description: string;
  indoorMode: boolean;
  displayOrder: number;
  objectives: MobileObjectiveSummary[];
};

export type MobileRouteDetail = {
  destination: {
    name: string;
    slug: string;
  };
  pois: MobilePoiDetail[];
  route: {
    description: string;
    difficulty: string;
    estimatedDurationMinutes: number;
    slug: string;
    title: string;
  };
};

export type MobileCurrentObjectiveSnapshot = {
  destinationName: string;
  objective: MobileObjectiveSummary;
  poiName: string;
  routeSlug: string;
  routeTitle: string;
};
