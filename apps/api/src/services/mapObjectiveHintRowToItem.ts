import type { ObjectiveHintItem, ObjectiveHintSummary } from '../models/hint';

export type ObjectiveHintRow = {
  id: string;
  slug: string;
  title: string;
};

export type HintRow = {
  id: string;
  level: number;
  objective_id: string;
  penalizes_perfect_completion: number;
  text: string;
};

export function mapObjectiveHintRowToSummary(row: ObjectiveHintRow): ObjectiveHintSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
  };
}

export function mapHintRowToItem(row: HintRow): ObjectiveHintItem {
  return {
    id: row.id,
    level: row.level,
    penalizesPerfectCompletion: row.penalizes_perfect_completion,
    text: row.text,
  };
}
