import { describe, expect, it } from 'vitest';

import { createHealthSnapshotService } from '../../src/services/createHealthSnapshotService';

describe('createHealthSnapshotService', () => {
  it('returns a stable health snapshot using runtime config and the current timestamp', () => {
    const service = createHealthSnapshotService({
      config: {
        appEnv: 'test',
        appName: 'cityquest-api-test',
        logLevel: 'debug',
      },
      now: () => new Date('2026-06-03T12:00:00.000Z'),
    });

    expect(service.execute()).toEqual({
      environment: 'test',
      service: 'cityquest-api-test',
      status: 'ok',
      timestamp: '2026-06-03T12:00:00.000Z',
    });
  });
});
