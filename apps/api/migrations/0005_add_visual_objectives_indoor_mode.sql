-- Distinguish interior and exterior objectives inside the same POI.

ALTER TABLE visual_objectives
ADD COLUMN indoor_mode INTEGER NOT NULL DEFAULT 0 CHECK (indoor_mode IN (0, 1));
