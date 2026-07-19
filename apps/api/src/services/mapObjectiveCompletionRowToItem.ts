import type { ObjectiveCompletion } from '../models/completion';

export type ObjectiveCompletionRow = {
  actor_id: string;
  completed_at: string;
  gps_status: 'radius_unavailable' | 'within_radius';
  id: string;
  objective_slug: string;
  route_slug: string;
  validation_mode: 'mock_visual';
  visual_status: 'passed';
};

export function mapObjectiveCompletionRowToItem(
  row: ObjectiveCompletionRow,
): ObjectiveCompletion {
  return {
    actorId: row.actor_id,
    completedAt: row.completed_at,
    gpsStatus: row.gps_status,
    id: row.id,
    objectiveSlug: row.objective_slug,
    routeSlug: row.route_slug,
    validationMode: row.validation_mode,
    visualStatus: row.visual_status,
  };
}
