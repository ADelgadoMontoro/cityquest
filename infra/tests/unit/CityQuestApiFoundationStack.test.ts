import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { describe, expect, it } from 'vitest';

import type { InfraEnvironmentConfig } from '../../src/config/createInfraEnvironmentConfig';
import { CityQuestApiFoundationStack } from '../../src/stacks/CityQuestApiFoundationStack';

function createTestEnvironmentConfig(): InfraEnvironmentConfig {
  return {
    apiName: 'cityquest-dev-api',
    environmentName: 'dev',
    region: 'eu-west-1',
    stackName: 'CityQuestDevApiFoundationStack',
  };
}

describe('CityQuestApiFoundationStack', () => {
  it('creates an HTTP API foundation with development CORS and a URL output', () => {
    const app = new App();
    const stack = new CityQuestApiFoundationStack(app, 'CityQuestDevApiFoundationStack', {
      environmentConfig: createTestEnvironmentConfig(),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      Name: 'cityquest-dev-api',
      ProtocolType: 'HTTP',
      CorsConfiguration: {
        AllowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        AllowOrigins: [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3001',
          'http://localhost:5173',
          'http://127.0.0.1:5173',
        ],
      },
    });

    template.hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      StageName: 'dev',
      AutoDeploy: true,
    });

    template.hasOutput('CityQuestApiUrl', {
      Value: Match.objectLike({
        'Fn::Join': Match.arrayWith([
          '',
          Match.arrayWith([
            Match.objectLike({
              'Fn::GetAtt': Match.arrayWith([
                Match.stringLikeRegexp('CityQuestHttpApiFoundation'),
                'ApiEndpoint',
              ]),
            }),
            '/',
          ]),
        ]),
      }),
    });

    expect(template.findResources('AWS::ApiGatewayV2::Route')).toEqual({});
  });
});
