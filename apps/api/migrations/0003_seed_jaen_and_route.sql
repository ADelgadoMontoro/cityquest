-- Seed the first destination and route baseline for the CityQuest MVP.
-- This migration intentionally inserts only the top-level content layer.

INSERT INTO destinations (
  id,
  slug,
  name,
  description,
  status,
  cover_image_url,
  display_order,
  created_at,
  updated_at
) VALUES (
  'destination-jaen',
  'jaen',
  'Jaén',
  'Jaén is a historic Andalusian city where castles, cathedrals, Arab baths and local legends reveal centuries of cultural heritage.',
  'published',
  'https://andalusiaviaggioitaliano.com/wp-content/uploads/2022/04/cosa_vedere_jaen_portada.jpg',
  0,
  '2026-06-04T00:00:00.000Z',
  '2026-06-04T00:00:00.000Z'
);

INSERT INTO routes (
  id,
  destination_id,
  slug,
  title,
  description,
  status,
  difficulty,
  estimated_duration_minutes,
  display_order,
  created_at,
  updated_at
) VALUES (
  'route-jaen-echoes-of-stone',
  'destination-jaen',
  'jaen-echoes-of-stone',
  'Jaén: Echoes of Stone',
  'Jaén: Echoes of Stone turns the city into a visual investigation, guiding visitors through real heritage details in the Cathedral of Jaén and the Arab Baths to unlock hidden stories.',
  'published',
  'easy',
  300,
  0,
  '2026-06-04T00:00:00.000Z',
  '2026-06-04T00:00:00.000Z'
);
