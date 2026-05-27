import { describe, expect, it } from 'vitest';

import { createHealthcheckService } from '../../src/services/createHealthcheckService';

describe('createHealthcheckService', () => {
  it('returns a stable health snapshot from runtime config', () => {
    const service = createHealthcheckService({
      config: {
        appEnv: 'test',
        appName: 'CityQuest API',
        logLevel: 'debug',
      },
      now: () => new Date('2026-05-28T10:00:00.000Z'),
    });

    expect(
      service.execute({
        requestId: 'unit-test-request',
      }),
    ).toEqual({
      app: 'CityQuest API',
      environment: 'test',
      requestId: 'unit-test-request',
      status: 'ok',
      timestamp: '2026-05-28T10:00:00.000Z',
    });
  });
});
