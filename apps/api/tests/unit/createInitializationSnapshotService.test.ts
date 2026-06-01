import { describe, expect, it } from 'vitest';

import { createInitializationSnapshotService } from '../../src/services/createInitializationSnapshotService';

describe('createInitializationSnapshotService', () => {
  it('returns a stable initialization snapshot from runtime config', () => {
    const service = createInitializationSnapshotService({
      config: {
        appEnv: 'test',
        appName: 'cityquest-api-test',
        logLevel: 'debug',
      },
    });

    expect(service.execute()).toEqual({
      environment: 'test',
      service: 'cityquest-api-test',
      status: 'initialized',
    });
  });
});
