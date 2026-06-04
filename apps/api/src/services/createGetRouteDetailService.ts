import type { D1Database } from '../types/cloudflare';
import type { RouteDetailObjectiveItem, RouteDetailPoiItem, RouteDetailSnapshot } from '../models/route';
import {
  mapObjectiveRowToRouteDetailObjectiveItem,
  mapPoiRowToRouteDetailPoiItem,
  mapRouteRowToRouteDetailItem,
  type ObjectiveRow,
  type PoiRow,
  type RouteRow,
} from './mapRouteDetailRowToItem';

const GET_PUBLISHED_ROUTE_DETAIL_QUERY = `
  SELECT
    routes.id,
    routes.slug,
    routes.title,
    routes.description,
    routes.status,
    routes.difficulty,
    routes.estimated_duration_minutes,
    routes.display_order,
    destinations.id AS destination_id,
    destinations.slug AS destination_slug,
    destinations.name AS destination_name
  FROM routes
  INNER JOIN destinations ON destinations.id = routes.destination_id
  WHERE routes.slug = ?
    AND routes.status = ?
    AND destinations.status = ?
  LIMIT 1
`;

const LIST_PUBLISHED_ROUTE_POIS_QUERY = `
  SELECT
    id,
    route_id,
    slug,
    name,
    description,
    status,
    latitude,
    longitude,
    access_notes,
    indoor_mode,
    display_order
  FROM pois
  WHERE route_id = ?
    AND status = ?
  ORDER BY display_order, name
`;

const LIST_PUBLISHED_ROUTE_OBJECTIVES_QUERY = `
  SELECT
    visual_objectives.id,
    visual_objectives.poi_id,
    visual_objectives.slug,
    visual_objectives.title,
    visual_objectives.description,
    visual_objectives.status,
    visual_objectives.target_type,
    visual_objectives.gps_radius_meters,
    visual_objectives.difficulty,
    visual_objectives.indoor_mode,
    visual_objectives.display_order
  FROM visual_objectives
  INNER JOIN pois ON pois.id = visual_objectives.poi_id
  WHERE pois.route_id = ?
    AND visual_objectives.status = ?
  ORDER BY pois.display_order, visual_objectives.display_order, visual_objectives.title
`;

export type GetRouteDetailService = {
  execute: (database: D1Database, routeSlug: string) => Promise<RouteDetailSnapshot | null>;
};

export function createGetRouteDetailService(): GetRouteDetailService {
  return {
    async execute(database, routeSlug) {
      const routeResult = await database
        .prepare(GET_PUBLISHED_ROUTE_DETAIL_QUERY)
        .bind(routeSlug, 'published', 'published')
        .all<RouteRow>();

      const routeRow = routeResult.results?.[0] ?? null;

      if (!routeRow) {
        return null;
      }

      const poiResult = await database
        .prepare(LIST_PUBLISHED_ROUTE_POIS_QUERY)
        .bind(routeRow.id, 'published')
        .all<PoiRow>();

      const objectiveResult = await database
        .prepare(LIST_PUBLISHED_ROUTE_OBJECTIVES_QUERY)
        .bind(routeRow.id, 'published')
        .all<ObjectiveRow>();

      const objectivesByPoiId = new Map<string, RouteDetailObjectiveItem[]>();

      for (const objectiveRow of objectiveResult.results ?? []) {
        const currentObjectives = objectivesByPoiId.get(objectiveRow.poi_id) ?? [];

        currentObjectives.push(mapObjectiveRowToRouteDetailObjectiveItem(objectiveRow));
        objectivesByPoiId.set(objectiveRow.poi_id, currentObjectives);
      }

      const pois: RouteDetailPoiItem[] = (poiResult.results ?? []).map((poiRow) =>
        mapPoiRowToRouteDetailPoiItem(poiRow, objectivesByPoiId.get(poiRow.id) ?? []),
      );

      return {
        route: mapRouteRowToRouteDetailItem(routeRow, pois),
      };
    },
  };
}
