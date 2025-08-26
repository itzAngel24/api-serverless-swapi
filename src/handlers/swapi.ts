import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SWAPIService } from '../services/SWAPIService';
import { SWAPIController } from '../controllers/SWAPIController';
import { LambdaHandler } from '@/utils/types/api.types';

// Instancias globales para reutilizar entre invocaciones
const swapiService = new SWAPIService();
const swapiController = new SWAPIController(swapiService);

export const getPeople: LambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await swapiController.getPeople(event);
};
