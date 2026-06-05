-- Seed the first progressive hints for the MVP objective slice.
-- These hints belong to the Statue of Saint Ferdinand objective in Jaen Cathedral.

INSERT INTO hints (
  id,
  objective_id,
  level,
  text,
  penalizes_perfect_completion,
  created_at,
  updated_at
) VALUES
(
  'hint-estatua-san-fernando-level-1',
  'objective-catedral-de-jaen-estatua-san-fernando',
  1,
  'Despite being called “the Saint”, he is the only one who does not belong to the Church.',
  0,
  '2026-06-05T00:00:00.000Z',
  '2026-06-05T00:00:00.000Z'
),
(
  'hint-estatua-san-fernando-level-2',
  'objective-catedral-de-jaen-estatua-san-fernando',
  2,
  'He is Ferdinand III, but he could also be called Ferdinand V.',
  1,
  '2026-06-05T00:00:00.000Z',
  '2026-06-05T00:00:00.000Z'
),
(
  'hint-estatua-san-fernando-level-3',
  'objective-catedral-de-jaen-estatua-san-fernando',
  3,
  'He stands in the centre, surrounded by 8 other statues.',
  1,
  '2026-06-05T00:00:00.000Z',
  '2026-06-05T00:00:00.000Z'
);
