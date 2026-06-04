-- Remove the third-party placeholder cover image until the project owns the asset.

UPDATE destinations
SET
  cover_image_url = NULL,
  updated_at = '2026-06-04T00:00:00.000Z'
WHERE id = 'destination-jaen';
