import type { App } from 'aws-cdk-lib';

export type InfraEnvironmentConfig = {
  apiName: string;
  environmentName: 'dev';
  region: string;
  stackName: string;
};

export function createInfraEnvironmentConfig(app: App): InfraEnvironmentConfig {
  const environmentName = 'dev' as const;
  const region =
    app.node.tryGetContext('region') ??
    process.env.CITYQUEST_AWS_REGION ??
    process.env.CDK_DEFAULT_REGION ??
    'eu-west-1';

  return {
    apiName: `cityquest-${environmentName}-api`,
    environmentName,
    region,
    stackName: 'CityQuestDevApiFoundationStack',
  };
}
