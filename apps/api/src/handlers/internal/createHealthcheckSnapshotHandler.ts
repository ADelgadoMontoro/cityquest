import type { ApiRuntimeConfig } from '../../config/apiConfig';
import { createHealthcheckService } from '../../services/createHealthcheckService';
import { createJsonResponse } from '../../utils/createJsonResponse';
import type { LambdaHttpHandler } from '../../types/lambda';

type CreateHealthcheckSnapshotHandlerDependencies = {
  config: ApiRuntimeConfig;
};

export function createHealthcheckSnapshotHandler({
  config,
}: CreateHealthcheckSnapshotHandlerDependencies): LambdaHttpHandler {
  const healthcheckService = createHealthcheckService({ config });

  return async (_event, context) => {
    const snapshot = healthcheckService.execute({
      requestId: context.awsRequestId,
    });

    return createJsonResponse(200, snapshot);
  };
}
