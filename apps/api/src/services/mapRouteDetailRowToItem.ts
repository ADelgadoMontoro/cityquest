import type {
  RouteDetailDestinationSummary,
  RouteDetailItem,
  RouteDetailObjectiveItem,
  RouteDetailPoiItem,
} from '../models/route';

export type RouteRow = {
  description: string | null;
  destination_id: string;
  destination_name: string;
  destination_slug: string;
  difficulty: string | null;
  display_order: number;
  estimated_duration_minutes: number | null;
  id: string;
  slug: string;
  status: string;
  title: string;
};

export type PoiRow = {
  access_notes: string | null;
  description: string | null;
  display_order: number;
  id: string;
  indoor_mode: number;
  latitude: number;
  longitude: number;
  name: string;
  route_id: string;
  slug: string;
  status: string;
};

export type ObjectiveRow = {
  description: string | null;
  difficulty: string | null;
  display_order: number;
  gps_radius_meters: number | null;
  id: string;
  indoor_mode: number;
  poi_id: string;
  slug: string;
  status: string;
  target_type: string;
  title: string;
};

export function mapRouteRowToRouteDetailDestinationSummary(
  row: RouteRow,
): RouteDetailDestinationSummary {
  return {
    id: row.destination_id,
    name: row.destination_name,
    slug: row.destination_slug,
  };
}

export function mapObjectiveRowToRouteDetailObjectiveItem(
  row: ObjectiveRow,
): RouteDetailObjectiveItem {
  return {
    description: row.description,
    difficulty: row.difficulty,
    displayOrder: row.display_order,
    gpsRadiusMeters: row.gps_radius_meters,
    id: row.id,
    indoorMode: row.indoor_mode,
    slug: row.slug,
    status: row.status,
    targetType: row.target_type,
    title: row.title,
  };
}

export function mapPoiRowToRouteDetailPoiItem(
  row: PoiRow,
  objectives: RouteDetailObjectiveItem[],
): RouteDetailPoiItem {
  return {
    accessNotes: row.access_notes,
    description: row.description,
    displayOrder: row.display_order,
    id: row.id,
    indoorMode: row.indoor_mode,
    latitude: row.latitude,
    longitude: row.longitude,
    name: row.name,
    objectives,
    slug: row.slug,
    status: row.status,
  };
}

export function mapRouteRowToRouteDetailItem(
  row: RouteRow,
  pois: RouteDetailPoiItem[],
): RouteDetailItem {
  return {
    description: row.description,
    destination: mapRouteRowToRouteDetailDestinationSummary(row),
    difficulty: row.difficulty,
    displayOrder: row.display_order,
    estimatedDurationMinutes: row.estimated_duration_minutes,
    id: row.id,
    pois,
    slug: row.slug,
    status: row.status,
    title: row.title,
  };
}
