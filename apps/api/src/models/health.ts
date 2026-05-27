export type HealthcheckStatus = 'ok';

export type HealthcheckSnapshot = {
  app: string;
  environment: string;
  requestId: string;
  status: HealthcheckStatus;
  timestamp: string;
};

export type HealthcheckRequest = {
  requestId: string;
};
