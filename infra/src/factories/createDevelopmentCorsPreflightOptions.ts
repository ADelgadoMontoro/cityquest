import { CorsHttpMethod, type CorsPreflightOptions } from 'aws-cdk-lib/aws-apigatewayv2';

export function createDevelopmentCorsPreflightOptions(): CorsPreflightOptions {
  return {
    allowCredentials: false,
    allowHeaders: ['authorization', 'content-type', 'x-requested-with'],
    allowMethods: [
      CorsHttpMethod.GET,
      CorsHttpMethod.POST,
      CorsHttpMethod.PUT,
      CorsHttpMethod.PATCH,
      CorsHttpMethod.DELETE,
      CorsHttpMethod.OPTIONS,
    ],
    allowOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
  };
}
