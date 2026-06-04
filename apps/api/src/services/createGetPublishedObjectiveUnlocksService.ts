import type { D1Database } from '../types/cloudflare';
import type { ObjectiveUnlocksSnapshot } from '../models/unlock';
import {
  mapObjectiveUnlockRowToSummary,
  mapUnlockableContentRowToItem,
  type ObjectiveUnlockRow,
  type UnlockableContentRow,
} from './mapObjectiveUnlockRowToItem';

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

const LIST_PUBLISHED_UNLOCKABLE_CONTENT_QUERY = `
  SELECT
    id,
    objective_id,
    title,
    short_text,
    long_text,
    content_type,
    image_url,
    audio_url,
    display_order
  FROM unlockable_contents
  WHERE objective_id = ?
    AND status = ?
  ORDER BY display_order, title
`;

export type GetPublishedObjectiveUnlocksService = {
  execute: (database: D1Database, objectiveSlug: string) => Promise<ObjectiveUnlocksSnapshot | null>;
};

export function createGetPublishedObjectiveUnlocksService(): GetPublishedObjectiveUnlocksService {
  return {
    async execute(database, objectiveSlug) {
      const objectiveResult = await database
        .prepare(GET_PUBLISHED_OBJECTIVE_QUERY)
        .bind(objectiveSlug, 'published')
        .all<ObjectiveUnlockRow>();

      const objectiveRow = objectiveResult.results?.[0] ?? null;

      if (!objectiveRow) {
        return null;
      }

      const unlockableContentResult = await database
        .prepare(LIST_PUBLISHED_UNLOCKABLE_CONTENT_QUERY)
        .bind(objectiveRow.id, 'published')
        .all<UnlockableContentRow>();

      const unlockableContents = (unlockableContentResult.results ?? []).map(
        mapUnlockableContentRowToItem,
      );

      if (unlockableContents.length === 0) {
        return null;
      }

      return {
        objective: mapObjectiveUnlockRowToSummary(objectiveRow),
        unlockableContents,
      };
    },
  };
}
