import { CfnOutput, Stack, type StackProps } from 'aws-cdk-lib';
import { HttpStage } from 'aws-cdk-lib/aws-apigatewayv2';
import type { Construct } from 'constructs';

import type { InfraEnvironmentConfig } from '../config/createInfraEnvironmentConfig';
import { CityQuestHttpApiFoundation } from '../constructs/CityQuestHttpApiFoundation';

type CityQuestApiFoundationStackProps = StackProps & {
  environmentConfig: InfraEnvironmentConfig;
};

export class CityQuestApiFoundationStack extends Stack {
  constructor(scope: Construct, id: string, props: CityQuestApiFoundationStackProps) {
    super(scope, id, props);

    const httpApi = new CityQuestHttpApiFoundation(this, 'CityQuestHttpApiFoundation', {
      environmentConfig: props.environmentConfig,
    });

    new HttpStage(this, 'CityQuestDevHttpStage', {
      autoDeploy: true,
      httpApi,
      stageName: props.environmentConfig.environmentName,
    });

    new CfnOutput(this, 'CityQuestApiUrl', {
      description: 'Base URL for the CityQuest development HTTP API.',
      value: `${httpApi.apiEndpoint}/`,
    });
  }
}
