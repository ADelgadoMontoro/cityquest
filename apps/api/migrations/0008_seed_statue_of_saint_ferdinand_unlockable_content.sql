-- Seed the first unlockable narrative content for the MVP route.
-- This establishes the backend-owned reward payload for the Statue of Saint Ferdinand objective.

INSERT INTO unlockable_contents (
  id,
  objective_id,
  title,
  short_text,
  long_text,
  content_type,
  status,
  audio_url,
  image_url,
  display_order,
  created_at,
  updated_at
) VALUES (
  'unlockable-estatua-san-fernando-king-who-changed-jaen',
  'objective-catedral-de-jaen-estatua-san-fernando',
  'The King Who Changed Jaén',
  'This statue represents Ferdinand III of Castile, the Christian king whose conquest of Jaén in 1246 marked a turning point in the city’s medieval history.',
  'Ferdinand III, later known as Saint Ferdinand, is one of the key figures in the medieval history of Jaén. In 1246, after a long period of conflict and siege, the city came under Christian control, becoming an important frontier stronghold between Castile and the Nasrid Kingdom of Granada. His presence in the city’s memory is not just political or military: it also connects Jaén with the transformation of its religious, urban and cultural landscape. Finding this statue is the first step in understanding how Jaén became a city shaped by layers of conquest, faith, defence and memory.',
  'text',
  'published',
  NULL,
  NULL,
  0,
  '2026-06-04T00:00:00.000Z',
  '2026-06-04T00:00:00.000Z'
);
