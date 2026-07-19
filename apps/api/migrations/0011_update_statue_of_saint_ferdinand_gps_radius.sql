-- Temporarily relax the first outdoor objective radius for device testing.
-- This keeps the existing seed immutable for already-applied D1 databases.

UPDATE visual_objectives
SET
  gps_radius_meters = 700,
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'objective-catedral-de-jaen-estatua-san-fernando';
