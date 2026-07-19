-- Persist the first MVP objective completion records for temporary actors.
-- This intentionally stops short of full users, route progress, achievements, or analytics.

CREATE TABLE IF NOT EXISTS objective_completions (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  objective_id TEXT NOT NULL,
  validation_mode TEXT NOT NULL CHECK (validation_mode IN ('mock_visual')),
  gps_status TEXT NOT NULL CHECK (gps_status IN ('within_radius', 'radius_unavailable')),
  visual_status TEXT NOT NULL CHECK (visual_status IN ('passed')),
  completed_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (objective_id) REFERENCES visual_objectives(id) ON DELETE CASCADE,
  UNIQUE (actor_id, objective_id)
);

CREATE INDEX IF NOT EXISTS idx_objective_completions_actor_completed_at
  ON objective_completions (actor_id, completed_at);

CREATE INDEX IF NOT EXISTS idx_objective_completions_route_actor
  ON objective_completions (route_id, actor_id);

CREATE INDEX IF NOT EXISTS idx_objective_completions_objective
  ON objective_completions (objective_id);
