import type {
  RouteObjectiveProgressItem,
  RouteObjectiveProgressSnapshot,
} from '../models/objectiveProgress';
import type { D1Database } from '../types/cloudflare';

type RouteProgressRouteRow = {
  id: string;
  slug: string;
  title: string;
};

type RouteProgressObjectiveRow = {
  completed_at: string | null;
  objective_slug: string;
  poi_slug: string;
};

const GET_PUBLISHED_ROUTE_QUERY = `
  SELECT
    routes.id,
    routes.slug,
    routes.title
  FROM routes
  INNER JOIN destinations ON destinations.id = routes.destination_id
  WHERE routes.slug = ?
    AND routes.status = ?
    AND destinations.status = ?
  LIMIT 1
`;

const LIST_ROUTE_OBJECTIVE_PROGRESS_QUERY = `
  SELECT
    visual_objectives.slug AS objective_slug,
    pois.slug AS poi_slug,
    objective_completions.completed_at
  FROM visual_objectives
  INNER JOIN pois ON pois.id = visual_objectives.poi_id
  LEFT JOIN objective_completions
    ON objective_completions.objective_id = visual_objectives.id
    AND objective_completions.actor_id = ?
  WHERE pois.route_id = ?
    AND pois.status = ?
    AND visual_objectives.status = ?
  ORDER BY pois.display_order, visual_objectives.display_order, visual_objectives.title
`;

export type GetRouteObjectiveProgressService = {
  execute: (
    database: D1Database,
    routeSlug: string,
    actorId: string,
  ) => Promise<RouteObjectiveProgressSnapshot | null>;
};

function mapObjectiveProgressRows(
  rows: RouteProgressObjectiveRow[],
): RouteObjectiveProgressItem[] {
  const poiSlugsWithCurrentObjective = new Set<string>();

  return rows.map((row) => {
    if (row.completed_at) {
      return {
        completedAt: row.completed_at,
        objectiveSlug: row.objective_slug,
        poiSlug: row.poi_slug,
        status: 'completed',
      };
    }

    if (!poiSlugsWithCurrentObjective.has(row.poi_slug)) {
      poiSlugsWithCurrentObjective.add(row.poi_slug);

      return {
        completedAt: null,
        objectiveSlug: row.objective_slug,
        poiSlug: row.poi_slug,
        status: 'current',
      };
    }

    return {
      completedAt: null,
      objectiveSlug: row.objective_slug,
      poiSlug: row.poi_slug,
      status: 'locked',
    };
  });
}

export function createGetRouteObjectiveProgressService(): GetRouteObjectiveProgressService {
  return {
    async execute(database, routeSlug, actorId) {
      const routeResult = await database
        .prepare(GET_PUBLISHED_ROUTE_QUERY)
        .bind(routeSlug, 'published', 'published')
        .all<RouteProgressRouteRow>();

      const routeRow = routeResult.results?.[0] ?? null;

      if (!routeRow) {
        return null;
      }

      const objectiveResult = await database
        .prepare(LIST_ROUTE_OBJECTIVE_PROGRESS_QUERY)
        .bind(actorId, routeRow.id, 'published', 'published')
        .all<RouteProgressObjectiveRow>();

      return {
        actorId,
        objectives: mapObjectiveProgressRows(objectiveResult.results ?? []),
        route: {
          slug: routeRow.slug,
          title: routeRow.title,
        },
      };
    },
  };
}
