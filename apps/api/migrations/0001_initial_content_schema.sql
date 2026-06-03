-- CityQuest initial MVP content schema.
-- This migration defines the first relational backbone for destination, route,
-- POI, objective, hint, and unlockable content retrieval.

CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  cover_image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS routes (
  id TEXT PRIMARY KEY,
  destination_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  difficulty TEXT,
  estimated_duration_minutes INTEGER CHECK (
    estimated_duration_minutes IS NULL OR estimated_duration_minutes > 0
  ),
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
  UNIQUE (destination_id, slug)
);

CREATE TABLE IF NOT EXISTS pois (
  id TEXT PRIMARY KEY,
  route_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  latitude REAL NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude REAL NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  access_notes TEXT,
  indoor_mode INTEGER NOT NULL DEFAULT 0 CHECK (indoor_mode IN (0, 1)),
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  UNIQUE (route_id, slug)
);

CREATE TABLE IF NOT EXISTS visual_objectives (
  id TEXT PRIMARY KEY,
  poi_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  target_type TEXT NOT NULL,
  gps_radius_meters INTEGER CHECK (gps_radius_meters IS NULL OR gps_radius_meters >= 0),
  difficulty TEXT,
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  UNIQUE (poi_id, slug)
);

CREATE TABLE IF NOT EXISTS hints (
  id TEXT PRIMARY KEY,
  objective_id TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level > 0),
  text TEXT NOT NULL,
  penalizes_perfect_completion INTEGER NOT NULL DEFAULT 0 CHECK (
    penalizes_perfect_completion IN (0, 1)
  ),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (objective_id) REFERENCES visual_objectives(id) ON DELETE CASCADE,
  UNIQUE (objective_id, level)
);

CREATE TABLE IF NOT EXISTS unlockable_contents (
  id TEXT PRIMARY KEY,
  objective_id TEXT NOT NULL,
  title TEXT NOT NULL,
  short_text TEXT,
  long_text TEXT,
  content_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  audio_url TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (objective_id) REFERENCES visual_objectives(id) ON DELETE CASCADE,
  UNIQUE (objective_id, display_order)
);

CREATE INDEX IF NOT EXISTS idx_destinations_status_display_order
  ON destinations (status, display_order);

CREATE INDEX IF NOT EXISTS idx_routes_destination_status_order
  ON routes (destination_id, status, display_order);

CREATE INDEX IF NOT EXISTS idx_pois_route_display_order
  ON pois (route_id, display_order);

CREATE INDEX IF NOT EXISTS idx_visual_objectives_poi_order
  ON visual_objectives (poi_id, display_order);

CREATE INDEX IF NOT EXISTS idx_hints_objective_level
  ON hints (objective_id, level);

CREATE INDEX IF NOT EXISTS idx_unlockable_contents_objective_order
  ON unlockable_contents (objective_id, display_order);
