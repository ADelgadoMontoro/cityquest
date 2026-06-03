-- Enforce deterministic sibling ordering inside the core content hierarchy.
-- 0001 created the base content tables; this follow-up migration tightens
-- ordering guarantees without rewriting an already-applied migration.

CREATE UNIQUE INDEX IF NOT EXISTS idx_routes_destination_display_order_unique
  ON routes (destination_id, display_order);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pois_route_display_order_unique
  ON pois (route_id, display_order);

CREATE UNIQUE INDEX IF NOT EXISTS idx_visual_objectives_poi_display_order_unique
  ON visual_objectives (poi_id, display_order);
