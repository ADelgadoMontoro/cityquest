import type { ObjectiveHintsSnapshot } from '../models/hint';
import type { D1Database } from '../types/cloudflare';
import {
  mapHintRowToItem,
  mapObjectiveHintRowToSummary,
  type HintRow,
  type ObjectiveHintRow,
} from './mapObjectiveHintRowToItem';

const GET_PUBLISHED_OBJECTIVE_QUERY = `
  SELECT
    id,
    slug,
    title
  FROM visual_objectives
  WHERE slug = ?
    AND status = ?
  LIMIT 1
`;

const LIST_PUBLISHED_OBJECTIVE_HINTS_QUERY = `
  SELECT
    id,
    objective_id,
    level,
    text,
    penalizes_perfect_completion
  FROM hints
  WHERE objective_id = ?
  ORDER BY level
`;

export type GetPublishedObjectiveHintsService = {
  execute: (database: D1Database, objectiveSlug: string) => Promise<ObjectiveHintsSnapshot | null>;
};

export function createGetPublishedObjectiveHintsService(): GetPublishedObjectiveHintsService {
  return {
    async execute(database, objectiveSlug) {
      const objectiveResult = await database
        .prepare(GET_PUBLISHED_OBJECTIVE_QUERY)
        .bind(objectiveSlug, 'published')
        .all<ObjectiveHintRow>();

      const objectiveRow = objectiveResult.results?.[0] ?? null;

      if (!objectiveRow) {
        return null;
      }

      const hintsResult = await database
        .prepare(LIST_PUBLISHED_OBJECTIVE_HINTS_QUERY)
        .bind(objectiveRow.id)
        .all<HintRow>();

      const hints = (hintsResult.results ?? []).map(mapHintRowToItem);

      if (hints.length === 0) {
        return null;
      }

      return {
        hints,
        objective: mapObjectiveHintRowToSummary(objectiveRow),
      };
    },
  };
}
