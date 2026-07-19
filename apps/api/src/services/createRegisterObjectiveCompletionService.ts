import type { ObjectiveCompletionSnapshot } from '../models/completion';
import type { D1Database } from '../types/cloudflare';
import {
  mapObjectiveCompletionRowToItem,
  type ObjectiveCompletionRow,
} from './mapObjectiveCompletionRowToItem';

type ObjectiveRouteLookupRow = {
  objective_id: string;
  route_id: string;
};

export type RegisterObjectiveCompletionInput = {
  actorId: string;
  gpsStatus: 'radius_unavailable' | 'within_radius';
  objectiveSlug: string;
  routeSlug: string;
  validationMode: 'mock_visual';
  visualStatus: 'passed';
};

const GET_PUBLISHED_OBJECTIVE_FOR_ROUTE_QUERY = `
  SELECT
    visual_objectives.id AS objective_id,
    routes.id AS route_id
  FROM visual_objectives
  INNER JOIN pois ON pois.id = visual_objectives.poi_id
  INNER JOIN routes ON routes.id = pois.route_id
  WHERE visual_objectives.slug = ?
    AND visual_objectives.status = ?
    AND routes.slug = ?
    AND routes.status = ?
  LIMIT 1
`;

const INSERT_OBJECTIVE_COMPLETION_QUERY = `
  INSERT OR IGNORE INTO objective_completions (
    id,
    actor_id,
    route_id,
    objective_id,
    validation_mode,
    gps_status,
    visual_status,
    completed_at,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const GET_OBJECTIVE_COMPLETION_QUERY = `
  SELECT
    objective_completions.id,
    objective_completions.actor_id,
    objective_completions.validation_mode,
    objective_completions.gps_status,
    objective_completions.visual_status,
    objective_completions.completed_at,
    routes.slug AS route_slug,
    visual_objectives.slug AS objective_slug
  FROM objective_completions
  INNER JOIN routes ON routes.id = objective_completions.route_id
  INNER JOIN visual_objectives ON visual_objectives.id = objective_completions.objective_id
  WHERE objective_completions.actor_id = ?
    AND objective_completions.objective_id = ?
  LIMIT 1
`;

export type RegisterObjectiveCompletionService = {
  execute: (
    database: D1Database,
    input: RegisterObjectiveCompletionInput,
  ) => Promise<ObjectiveCompletionSnapshot | null>;
};

function createStableCompletionId(actorId: string, objectiveSlug: string): string {
  const hashInput = `${actorId}:${objectiveSlug}`;
  let hash = 2166136261;

  for (let index = 0; index < hashInput.length; index += 1) {
    hash ^= hashInput.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `completion-${objectiveSlug}-${(hash >>> 0).toString(16)}`;
}

export function createRegisterObjectiveCompletionService(): RegisterObjectiveCompletionService {
  return {
    async execute(database, input) {
      const lookupResult = await database
        .prepare(GET_PUBLISHED_OBJECTIVE_FOR_ROUTE_QUERY)
        .bind(input.objectiveSlug, 'published', input.routeSlug, 'published')
        .all<ObjectiveRouteLookupRow>();

      const lookupRow = lookupResult.results?.[0] ?? null;

      if (!lookupRow) {
        return null;
      }

      const timestamp = new Date().toISOString();
      const completionId = createStableCompletionId(input.actorId, input.objectiveSlug);

      await database
        .prepare(INSERT_OBJECTIVE_COMPLETION_QUERY)
        .bind(
          completionId,
          input.actorId,
          lookupRow.route_id,
          lookupRow.objective_id,
          input.validationMode,
          input.gpsStatus,
          input.visualStatus,
          timestamp,
          timestamp,
          timestamp,
        )
        .run();

      const completionResult = await database
        .prepare(GET_OBJECTIVE_COMPLETION_QUERY)
        .bind(input.actorId, lookupRow.objective_id)
        .all<ObjectiveCompletionRow>();

      const completionRow = completionResult.results?.[0] ?? null;

      if (!completionRow) {
        return null;
      }

      return {
        completion: mapObjectiveCompletionRowToItem(completionRow),
      };
    },
  };
}
