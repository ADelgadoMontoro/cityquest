import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';

import { healthHandler } from '../handlers/healthHandler';

function createMockEvent(): APIGatewayProxyEventV2 {
  return {} as APIGatewayProxyEventV2;
}

function createMockContext(): Context {
  return {
    awsRequestId: 'local-healthcheck-request',
    callbackWaitsForEmptyEventLoop: false,
    done: () => undefined,
    fail: () => undefined,
    functionName: 'cityquest-local-health-handler',
    functionVersion: '$LATEST',
    getRemainingTimeInMillis: () => 30000,
    invokedFunctionArn: 'arn:aws:lambda:local:0:function:cityquest-local-health-handler',
    logGroupName: '/aws/lambda/cityquest-local-health-handler',
    logStreamName: 'local/healthcheck',
    memoryLimitInMB: '256',
    succeed: () => undefined,
  };
}

async function invokeHealthHandler(): Promise<void> {
  const response = await healthHandler(createMockEvent(), createMockContext());

  console.log('Local API handler response');
  console.log(JSON.stringify(response, null, 2));
}

void invokeHealthHandler();
