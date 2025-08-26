// src/swagger.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as swaggerDoc from '../../swagger.json';

const getBaseUrl = (event: APIGatewayProxyEvent) => {
  const isOffline = process.env.IS_OFFLINE === 'true';
  
  if (isOffline) {
    const port = process.env.SERVERLESS_OFFLINE_PORT || '3000';
    const { stage } = event.requestContext;
    return `http://localhost:${port}/${stage}`;
  }
  
  const { domainName, stage } = event.requestContext;
  return `https://${domainName}/${stage}`;
};

export const swaggerJson = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const baseUrl = getBaseUrl(event);
  
  // Clonar el objeto para no mutar el original
  const swagger = JSON.parse(JSON.stringify(swaggerDoc));
  
  // Actualizar la URL base dinámicamente
  swagger.servers[0].variables.baseUrl.default = baseUrl;
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
    body: JSON.stringify(swagger),
  };
};

export const swaggerUI = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const baseUrl = getBaseUrl(event);
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui.css" />
        <style>
          body { margin: 0; background: #fafafa; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            url: '${baseUrl}/swagger.json',
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.presets.standalone
            ],
            deepLinking: true,
            showExtensions: true,
            showCommonExtensions: true
          });
        </script>
      </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600',
    },
    body: html,
  };
};