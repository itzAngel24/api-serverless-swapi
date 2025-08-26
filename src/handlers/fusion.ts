import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LambdaHandler } from '../utils/types/api.types';
import { FusionController } from '@/controllers/FusionController';

const controller = new FusionController();

export const getFusions: LambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await controller.getFusions(event);
};

export const createFusion: LambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await controller.createFusion(event);
};

export const getHistoryFusions: LambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await controller.getHistoryFusions(event);
};