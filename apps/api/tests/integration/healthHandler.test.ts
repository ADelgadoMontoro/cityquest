import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { describe, expect, it } from 'vitest';

import { createHealthcheckSnapshotHandler } from '../../src/handlers/internal/createHealthcheckSnapshotHandler';

function createTestEvent(): APIGatewayProxyEventV2 {
  return {} as APIGatewayProxyEventV2;
}

function createTestContext(): Context {
  return {
    awsRequestId: 'integration-test-request',
    callbackWaitsForEmptyEventLoop: false,
    done: () => undefined,
    fail: () => undefined,
    functionName: 'cityquest-test-health-handler',
    functionVersion: '$LATEST',
    getRemainingTimeInMillis: () => 30000,
    invokedFunctionArn: 'arn:aws:lambda:test:0:function:cityquest-test-health-handler',
    logGroupName: '/aws/lambda/cityquest-test-health-handler',
    logStreamName: 'test/healthcheck',
    memoryLimitInMB: '256',
    succeed: () => undefined,
  };
}

describe('healthHandler integration', () => {
  it('maps the health snapshot into a JSON HTTP response', async () => {
    const handler = createHealthcheckSnapshotHandler({
      config: {
        appEnv: 'test',
        appName: 'CityQuest API',
        logLevel: 'debug',
      },
    });

    const response = await handler(createTestEvent(), createTestContext());

    expect(response?.statusCode).toBe(200);
    expect(response?.headers?.['content-type']).toBe('application/json; charset=utf-8');

    expect(JSON.parse(response?.body ?? '{}')).toMatchObject({
      app: 'CityQuest API',
      environment: 'test',
      requestId: 'integration-test-request',
      status: 'ok',
    });
  });
});
