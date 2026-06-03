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

  it('rejects duplicate sibling display orders inside the same parent', () => {
    const database = createSchemaSnapshot();

    database.exec(`
      INSERT INTO destinations (
        id, slug, name, status, display_order, created_at, updated_at
      ) VALUES (
        'destination-jaen', 'jaen', 'Jaen', 'published', 0, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
      );

      INSERT INTO routes (
        id, destination_id, slug, title, status, display_order, created_at, updated_at
      ) VALUES (
        'route-ecos-de-piedra', 'destination-jaen', 'ecos-de-piedra', 'Ecos de Piedra', 'published', 0, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
      );

      INSERT INTO pois (
        id, route_id, slug, name, status, latitude, longitude, indoor_mode, display_order, created_at, updated_at
      ) VALUES (
        'poi-catedral', 'route-ecos-de-piedra', 'catedral', 'Catedral de Jaen', 'published', 37.7796, -3.7849, 0, 0, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
      );

      INSERT INTO visual_objectives (
        id, poi_id, slug, title, status, target_type, gps_radius_meters, display_order, created_at, updated_at
      ) VALUES (
        'objective-facade', 'poi-catedral', 'facade', 'Find the facade detail', 'published', 'visual_landmark', 25, 0, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
      );
    `);

    expect(() =>
      database.exec(`
        INSERT INTO routes (
          id, destination_id, slug, title, status, display_order, created_at, updated_at
        ) VALUES (
          'route-duplicate-order', 'destination-jaen', 'duplicate-order', 'Duplicate Route Order', 'draft', 0, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
        );
      `),
    ).toThrow();

    expect(() =>
      database.exec(`
        INSERT INTO pois (
          id, route_id, slug, name, status, latitude, longitude, indoor_mode, display_order, created_at, updated_at
        ) VALUES (
          'poi-duplicate-order', 'route-ecos-de-piedra', 'duplicate-order', 'Duplicate POI Order', 'draft', 37.7800, -3.7850, 0, 0, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
        );
      `),
    ).toThrow();

    expect(() =>
      database.exec(`
        INSERT INTO visual_objectives (
          id, poi_id, slug, title, status, target_type, gps_radius_meters, display_order, created_at, updated_at
        ) VALUES (
          'objective-duplicate-order', 'poi-catedral', 'duplicate-order', 'Duplicate Objective Order', 'draft', 'visual_landmark', 25, 0, '2026-06-03T00:00:00.000Z', '2026-06-03T00:00:00.000Z'
        );
      `),
    ).toThrow();

    database.close();
  });
});
