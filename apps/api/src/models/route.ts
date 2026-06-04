export type RouteDetailObjectiveItem = {
  description: string | null;
  difficulty: string | null;
  displayOrder: number;
  gpsRadiusMeters: number | null;
  id: string;
  indoorMode: number;
  slug: string;
  status: string;
  targetType: string;
  title: string;
};

export type RouteDetailPoiItem = {
  accessNotes: string | null;
  description: string | null;
  displayOrder: number;
  id: string;
  indoorMode: number;
  latitude: number;
  longitude: number;
  name: string;
  objectives: RouteDetailObjectiveItem[];
  slug: string;
  status: string;
};

export type RouteDetailDestinationSummary = {
  id: string;
  name: string;
  slug: string;
};

export type RouteDetailItem = {
  description: string | null;
  destination: RouteDetailDestinationSummary;
  difficulty: string | null;
  displayOrder: number;
  estimatedDurationMinutes: number | null;
  id: string;
  pois: RouteDetailPoiItem[];
  slug: string;
  status: string;
  title: string;
};

export type RouteDetailSnapshot = {
  route: RouteDetailItem;
};
