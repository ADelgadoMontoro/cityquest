import 'source-map-support/register';

import { App } from 'aws-cdk-lib';

import { createInfraEnvironmentConfig } from '../src/config/createInfraEnvironmentConfig';
import { CityQuestApiFoundationStack } from '../src/stacks/CityQuestApiFoundationStack';

const app = new App();
const environmentConfig = createInfraEnvironmentConfig(app);

new CityQuestApiFoundationStack(app, environmentConfig.stackName, {
  environmentConfig,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: environmentConfig.region,
  },
});
