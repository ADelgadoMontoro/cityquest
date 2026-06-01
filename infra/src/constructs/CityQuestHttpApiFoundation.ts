import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import type { Construct } from 'constructs';

import type { InfraEnvironmentConfig } from '../config/createInfraEnvironmentConfig';
import { createDevelopmentCorsPreflightOptions } from '../factories/createDevelopmentCorsPreflightOptions';

type CityQuestHttpApiFoundationProps = {
  environmentConfig: InfraEnvironmentConfig;
};

export class CityQuestHttpApiFoundation extends HttpApi {
  constructor(scope: Construct, id: string, props: CityQuestHttpApiFoundationProps) {
    super(scope, id, {
      apiName: props.environmentConfig.apiName,
      corsPreflight: createDevelopmentCorsPreflightOptions(),
      createDefaultStage: false,
      description: 'Public API gateway foundation for the CityQuest serverless backend.',
    });
  }
}
