import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LambdaHandler } from '@/utils/types/api.types';
import { QuoteAPIController } from '@/controllers/QuoteAPIController';
import { QuotesService } from '@/services/QuotesService';

// Instancias globales para reutilizar entre invocaciones
const service = new QuotesService();
const controller = new QuoteAPIController(service);

export const getQuotes: LambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await controller.getQuotes(event);
};
