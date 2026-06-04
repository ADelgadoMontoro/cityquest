import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDirectoryPath = resolve(__dirname, '../../migrations');
const initialSchemaMigrationFilePath = resolve(
  migrationsDirectoryPath,
  '0001_initial_content_schema.sql',
);
const orderingMigrationFilePath = resolve(
  migrationsDirectoryPath,
  '0002_enforce_content_sibling_ordering.sql',
);
const jaenSeedMigrationFilePath = resolve(
  migrationsDirectoryPath,
  '0003_seed_jaen_and_route.sql',
);
const clearJaenCoverImageMigrationFilePath = resolve(
  migrationsDirectoryPath,
  '0004_clear_external_jaen_cover_image.sql',
);
const addVisualObjectivesIndoorModeMigrationFilePath = resolve(
  migrationsDirectoryPath,
  '0005_add_visual_objectives_indoor_mode.sql',
);
const catedralSeedMigrationFilePath = resolve(
  migrationsDirectoryPath,
  '0006_seed_catedral_de_jaen_poi_and_objectives.sql',
);

function readMigrationFile(filePath: string) {
  return readFileSync(filePath, 'utf-8');
}

function listMigrationFilePaths() {
  return readdirSync(migrationsDirectoryPath)
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort()
    .map((fileName) => resolve(migrationsDirectoryPath, fileName));
}

function createSchemaSnapshot() {
  const database = new DatabaseSync(':memory:');

  for (const migrationFilePath of listMigrationFilePaths()) {
    database.exec(readMigrationFile(migrationFilePath));
  }

  return database;
}

describe('initial content schema migration', () => {
  it('stores the expected content migrations in the D1 migrations folder', () => {
    expect(existsSync(initialSchemaMigrationFilePath)).toBe(true);
    expect(existsSync(orderingMigrationFilePath)).toBe(true);
    expect(existsSync(jaenSeedMigrationFilePath)).toBe(true);
    expect(existsSync(clearJaenCoverImageMigrationFilePath)).toBe(true);
    expect(existsSync(addVisualObjectivesIndoorModeMigrationFilePath)).toBe(true);
    expect(existsSync(catedralSeedMigrationFilePath)).toBe(true);
  });

  it('defines the core MVP content tables', () => {
    const migration = readMigrationFile(initialSchemaMigrationFilePath);

    expect(migration).toContain('CREATE TABLE IF NOT EXISTS destinations');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS routes');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS pois');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS visual_objectives');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS hints');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS unlockable_contents');
  });

  it('models the content hierarchy with foreign keys', () => {
    const migration = readMigrationFile(initialSchemaMigrationFilePath);

    expect(migration).toContain(
      'FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE',
    );
    expect(migration).toContain('FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE');
    expect(migration).toContain(
      'FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE',
    );
    expect(migration).toContain(
      'FOREIGN KEY (objective_id) REFERENCES visual_objectives(id) ON DELETE CASCADE',
    );
  });

  it('adds the expected indexes for content lookups', () => {
    const migration = readMigrationFile(initialSchemaMigrationFilePath);

    expect(migration).toContain('CREATE INDEX IF NOT EXISTS idx_destinations_status_display_order');
    expect(migration).toContain('CREATE INDEX IF NOT EXISTS idx_routes_destination_status_order');
    expect(migration).toContain('CREATE INDEX IF NOT EXISTS idx_pois_route_display_order');
    expect(migration).toContain('CREATE INDEX IF NOT EXISTS idx_visual_objectives_poi_order');
    expect(migration).toContain('CREATE INDEX IF NOT EXISTS idx_hints_objective_level');
    expect(migration).toContain(
      'CREATE INDEX IF NOT EXISTS idx_unlockable_contents_objective_order',
    );
  });

  it('enforces deterministic sibling ordering inside routes, pois, and objectives', () => {
    const migration = readMigrationFile(orderingMigrationFilePath);

    expect(migration).toContain('CREATE UNIQUE INDEX IF NOT EXISTS idx_routes_destination_display_order_unique');
    expect(migration).toContain('CREATE UNIQUE INDEX IF NOT EXISTS idx_pois_route_display_order_unique');
    expect(migration).toContain(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_visual_objectives_poi_display_order_unique',
    );
  });

  it('does not widen the first migration with deferred concerns or seed data', () => {
    const migration = readMigrationFile(initialSchemaMigrationFilePath);

    expect(migration).not.toContain('CREATE TABLE IF NOT EXISTS users');
    expect(migration).not.toContain('CREATE TABLE IF NOT EXISTS user_progress');
    expect(migration).not.toContain('CREATE TABLE IF NOT EXISTS achievements');
    expect(migration).not.toContain('CREATE TABLE IF NOT EXISTS analytics_events');
    expect(migration).not.toContain('CREATE TABLE IF NOT EXISTS demo_assets');
    expect(migration).not.toContain('INSERT INTO');
  });

  it('defines a dedicated Jaen destination and route seed migration', () => {
    const migration = readMigrationFile(jaenSeedMigrationFilePath);

    expect(migration).toContain('INSERT INTO destinations');
    expect(migration).toContain("'destination-jaen'");
    expect(migration).toContain("'jaen'");
    expect(migration).toContain("'Jaén'");
    expect(migration).toContain('INSERT INTO routes');
    expect(migration).toContain("'route-jaen-echoes-of-stone'");
    expect(migration).toContain("'jaen-echoes-of-stone'");
    expect(migration).toContain("'Jaén: Echoes of Stone'");
  });

  it('clears the external Jaen cover image in a follow-up migration', () => {
    const migration = readMigrationFile(clearJaenCoverImageMigrationFilePath);

    expect(migration).toContain('UPDATE destinations');
    expect(migration).toContain('cover_image_url = NULL');
    expect(migration).toContain("WHERE id = 'destination-jaen'");
  });

  it('adds indoor mode to visual objectives in a follow-up schema migration', () => {
    const migration = readMigrationFile(addVisualObjectivesIndoorModeMigrationFilePath);

    expect(migration).toContain('ALTER TABLE visual_objectives');
    expect(migration).toContain('ADD COLUMN indoor_mode');
    expect(migration).toContain("DEFAULT 0");
  });

  it('defines a dedicated Catedral de Jaen POI and objectives seed migration', () => {
    const migration = readMigrationFile(catedralSeedMigrationFilePath);

    expect(migration).toContain('INSERT INTO pois');
    expect(migration).toContain("'poi-catedral-de-jaen'");
    expect(migration).toContain("'catedral-de-jaen'");
    expect(migration).toContain("'Cathedral of Jaén'");
    expect(migration).toContain('INSERT INTO visual_objectives');
    expect(migration).toContain("'estatua-san-fernando'");
    expect(migration).toContain("'mona-catedral-jaen'");
    expect(migration).toContain("'placa-santa-catalina-coro'");
    expect(migration).toContain("'organo-catedral-jaen'");
    expect(migration).toContain("'tumba-don-alonso-suarez'");
  });

  it('executes the migration set successfully in SQLite', () => {
    const database = createSchemaSnapshot();

    const tables = database
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
      .all() as Array<{ name: string }>;

    const indexes = database
      .prepare("SELECT name FROM sqlite_master WHERE type = 'index' ORDER BY name")
      .all() as Array<{ name: string }>;

    expect(tables.map((table) => table.name)).toEqual([
      'destinations',
      'hints',
      'pois',
      'routes',
      'unlockable_contents',
      'visual_objectives',
    ]);

    expect(indexes.map((index) => index.name)).toEqual(
      expect.arrayContaining([
        'idx_destinations_status_display_order',
        'idx_hints_objective_level',
        'idx_pois_route_display_order',
        'idx_pois_route_display_order_unique',
        'idx_routes_destination_display_order_unique',
        'idx_routes_destination_status_order',
        'idx_unlockable_contents_objective_order',
        'idx_visual_objectives_poi_display_order_unique',
        'idx_visual_objectives_poi_order',
      ]),
    );

    database.close();
  });

  it('seeds Jaen, the MVP route, and the first Catedral slice', () => {
    const database = createSchemaSnapshot();

    const destinations = database
      .prepare(
        `
          SELECT id, slug, name, description, status, cover_image_url, display_order
          FROM destinations
          ORDER BY display_order, name
        `,
      )
      .all() as Array<{
      cover_image_url: string | null;
      description: string;
      display_order: number;
      id: string;
      name: string;
      slug: string;
      status: string;
    }>;

    const routes = database
      .prepare(
        `
          SELECT id, destination_id, slug, title, description, status, difficulty,
                 estimated_duration_minutes, display_order
          FROM routes
          ORDER BY display_order, title
        `,
      )
      .all() as Array<{
      description: string;
      destination_id: string;
      difficulty: string;
      display_order: number;
      estimated_duration_minutes: number;
      id: string;
      slug: string;
      status: string;
      title: string;
    }>;

    const pois = database
      .prepare(
        `
          SELECT id, route_id, slug, name, description, status, latitude, longitude,
                 access_notes, indoor_mode, display_order
          FROM pois
          ORDER BY display_order, name
        `,
      )
      .all() as Array<{
      access_notes: string | null;
      description: string | null;
      display_order: number;
      id: string;
      indoor_mode: number;
      latitude: number;
      longitude: number;
      name: string;
      route_id: string;
      slug: string;
      status: string;
    }>;

    const visualObjectives = database
      .prepare(
        `
          SELECT id, poi_id, slug, title, description, status, target_type,
                 gps_radius_meters, difficulty, indoor_mode, display_order
          FROM visual_objectives
          ORDER BY display_order, title
        `,
      )
      .all() as Array<{
      description: string | null;
      difficulty: string | null;
      display_order: number;
      gps_radius_meters: number | null;
      id: string;
      indoor_mode: number;
      poi_id: string;
      slug: string;
      status: string;
      target_type: string;
      title: string;
    }>;

    const hintCount = database
      .prepare('SELECT COUNT(*) AS count FROM hints')
      .get() as { count: number };

    const unlockableContentCount = database
      .prepare('SELECT COUNT(*) AS count FROM unlockable_contents')
      .get() as { count: number };

    expect(destinations).toEqual([
      {
        cover_image_url: null,
        description:
          'Jaén is a historic Andalusian city where castles, cathedrals, Arab baths and local legends reveal centuries of cultural heritage.',
        display_order: 0,
        id: 'destination-jaen',
        name: 'Jaén',
        slug: 'jaen',
        status: 'published',
      },
    ]);

    expect(routes).toEqual([
      {
        description:
          'Jaén: Echoes of Stone turns the city into a visual investigation, guiding visitors through real heritage details in the Cathedral of Jaén and the Arab Baths to unlock hidden stories.',
        destination_id: 'destination-jaen',
        difficulty: 'easy',
        display_order: 0,
        estimated_duration_minutes: 300,
        id: 'route-jaen-echoes-of-stone',
        slug: 'jaen-echoes-of-stone',
        status: 'published',
        title: 'Jaén: Echoes of Stone',
      },
    ]);

    expect(pois).toEqual([
      {
        access_notes:
          'Located in Plaza de Santa María. Some objectives may require access to the cathedral interior, so opening hours and ticket availability should be checked before visiting.',
        description:
          'A monumental Renaissance cathedral in the heart of Jaén, where sacred architecture, hidden stone details and local legends make the city’s history feel alive.',
        display_order: 0,
        id: 'poi-catedral-de-jaen',
        indoor_mode: 1,
        latitude: 37.765738,
        longitude: -3.789518,
        name: 'Cathedral of Jaén',
        route_id: 'route-jaen-echoes-of-stone',
        slug: 'catedral-de-jaen',
        status: 'published',
      },
    ]);

    expect(visualObjectives).toEqual([
      {
        description:
          'Find the statue of Saint Ferdinand, the Christian king linked to the conquest of Jaén and one of the key historical figures behind the city’s medieval memory.',
        difficulty: 'easy',
        display_order: 0,
        gps_radius_meters: 20,
        id: 'objective-catedral-de-jaen-estatua-san-fernando',
        indoor_mode: 0,
        poi_id: 'poi-catedral-de-jaen',
        slug: 'estatua-san-fernando',
        status: 'published',
        target_type: 'statue',
        title: 'Statue of Saint Ferdinand',
      },
      {
        description:
          'Find the small monkey sculpture wearing a turban on the exterior of Jaén Cathedral, one of the building’s strangest and most memorable hidden details.',
        difficulty: 'hard',
        display_order: 1,
        gps_radius_meters: 3,
        id: 'objective-catedral-de-jaen-mona-catedral-jaen',
        indoor_mode: 0,
        poi_id: 'poi-catedral-de-jaen',
        slug: 'mona-catedral-jaen',
        status: 'published',
        target_type: 'architectural_detail',
        title: 'Cathedral Monkey',
      },
      {
        description:
          'Find the wooden panel inside the choir stalls depicting Saint Catherine, a small decorative detail hidden among the carved seats of Jaén Cathedral.',
        difficulty: 'medium',
        display_order: 2,
        gps_radius_meters: 5,
        id: 'objective-catedral-de-jaen-placa-santa-catalina-coro',
        indoor_mode: 1,
        poi_id: 'poi-catedral-de-jaen',
        slug: 'placa-santa-catalina-coro',
        status: 'published',
        target_type: 'decorative_panel',
        title: 'Saint Catherine Choir Panel',
      },
      {
        description:
          'Find the cathedral organ, one of the most recognisable interior features of Jaén Cathedral, standing out through its pipes, scale and decorative presence.',
        difficulty: 'easy',
        display_order: 3,
        gps_radius_meters: 12,
        id: 'objective-catedral-de-jaen-organo-catedral-jaen',
        indoor_mode: 1,
        poi_id: 'poi-catedral-de-jaen',
        slug: 'organo-catedral-jaen',
        status: 'published',
        target_type: 'architectural_detail',
        title: 'Cathedral Organ',
      },
      {
        description:
          'Find the tomb of Don Alonso Suárez de la Fuente del Sauce, known as El Insepulto, one of the most intriguing funerary details inside Jaén Cathedral.',
        difficulty: 'hard',
        display_order: 4,
        gps_radius_meters: 3,
        id: 'objective-catedral-de-jaen-tumba-don-alonso-suarez',
        indoor_mode: 1,
        poi_id: 'poi-catedral-de-jaen',
        slug: 'tumba-don-alonso-suarez',
        status: 'published',
        target_type: 'tomb',
        title: 'Tomb of Don Alonso Suárez',
      },
    ]);

    expect(hintCount.count).toBe(0);
    expect(unlockableContentCount.count).toBe(0);

    database.close();
  });

  it('rejects duplicate sibling display orders inside the same parent', () => {
    const database = createSchemaSnapshot();

    database.exec(`
      INSERT INTO destinations (
        id, slug, name, status, display_order, created_at, updated_at
      ) VALUES (
        'destination-test', 'test-destination', 'Test Destination', 'published', 1, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
      );

      INSERT INTO routes (
        id, destination_id, slug, title, status, display_order, created_at, updated_at
      ) VALUES (
        'route-test', 'destination-test', 'test-route', 'Test Route', 'published', 1, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
      );

      INSERT INTO pois (
        id, route_id, slug, name, status, latitude, longitude, indoor_mode, display_order, created_at, updated_at
      ) VALUES (
        'poi-test', 'route-test', 'test-poi', 'Test POI', 'published', 37.7796, -3.7849, 0, 1, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
      );

      INSERT INTO visual_objectives (
        id, poi_id, slug, title, status, target_type, gps_radius_meters, indoor_mode, display_order, created_at, updated_at
      ) VALUES (
        'objective-test', 'poi-test', 'test-objective', 'Test Objective', 'published', 'visual_landmark', 25, 0, 1, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
      );
    `);

    expect(() =>
      database.exec(`
        INSERT INTO routes (
          id, destination_id, slug, title, status, display_order, created_at, updated_at
        ) VALUES (
          'route-duplicate-order', 'destination-test', 'duplicate-order', 'Duplicate Route Order', 'draft', 1, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
        );
      `),
    ).toThrow();

    expect(() =>
      database.exec(`
        INSERT INTO pois (
          id, route_id, slug, name, status, latitude, longitude, indoor_mode, display_order, created_at, updated_at
        ) VALUES (
          'poi-duplicate-order', 'route-test', 'duplicate-order', 'Duplicate POI Order', 'draft', 37.7800, -3.7850, 0, 1, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
        );
      `),
    ).toThrow();

    expect(() =>
      database.exec(`
        INSERT INTO visual_objectives (
          id, poi_id, slug, title, status, target_type, gps_radius_meters, indoor_mode, display_order, created_at, updated_at
        ) VALUES (
          'objective-duplicate-order', 'poi-test', 'duplicate-order', 'Duplicate Objective Order', 'draft', 'visual_landmark', 25, 0, 1, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
        );
      `),
    ).toThrow();

    database.close();
  });
});
