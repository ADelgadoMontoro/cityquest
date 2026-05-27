import { loadApiRuntimeConfig } from '../config/apiConfig';
import { createHealthcheckSnapshotHandler } from './internal/createHealthcheckSnapshotHandler';
import type { LambdaHttpHandler } from '../types/lambda';

const runtimeConfig = loadApiRuntimeConfig();

export const healthHandler: LambdaHttpHandler = createHealthcheckSnapshotHandler({
  config: runtimeConfig,
});
