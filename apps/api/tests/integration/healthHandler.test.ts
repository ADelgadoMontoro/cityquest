import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { describe, expect, it } from 'vitest';

import { healthHandler } from '../../src/handlers/healthHandler';

function createTestEvent(): APIGatewayProxyEventV2 {
  return {
    version: '2.0',
    routeKey: 'GET /health',
    rawPath: '/health',
    rawQueryString: '',
    cookies: [],
    headers: {
      host: 'localhost',
    },
    queryStringParameters: undefined,
    requestContext: {
      accountId: '123456789012',
      apiId: 'local-api',
      domainName: 'localhost',
      domainPrefix: 'localhost',
      http: {
        method: 'GET',
        path: '/health',
        protocol: 'HTTP/1.1',
        sourceIp: '127.0.0.1',
        userAgent: 'vitest',
      },
      requestId: 'gateway-request-id',
      routeKey: 'GET /health',
      stage: '$default',
      time: '28/May/2026:09:00:00 +0000',
      timeEpoch: 1_748_423_200_000,
    },
    isBase64Encoded: false,
    stageVariables: undefined,
    body: undefined,
    pathParameters: undefined,
  };
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
    const response = await healthHandler(createTestEvent(), createTestContext());

    expect(response?.statusCode).toBe(200);
    expect(response?.headers?.['content-type']).toBe('application/json; charset=utf-8');

    expect(JSON.parse(response?.body ?? '{}')).toMatchObject({
      app: 'CityQuest API',
      environment: 'development',
      requestId: 'integration-test-request',
      status: 'ok',
    });
  });
});
