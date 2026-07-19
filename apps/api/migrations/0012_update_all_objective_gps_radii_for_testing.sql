-- Temporarily relax all published objective radii for real-device testing.
-- This is intentionally broad and should be replaced by calibrated per-objective radii later.

UPDATE visual_objectives
SET
  gps_radius_meters = 700,
  updated_at = CURRENT_TIMESTAMP
WHERE status = 'published'
  AND gps_radius_meters IS NOT NULL;
