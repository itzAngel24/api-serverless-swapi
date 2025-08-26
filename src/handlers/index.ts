import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserController } from '../controllers/UserController';
import { LambdaHandler } from '../utils/types/api.types';

const userController = new UserController();

export const createUser: LambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await userController.createUser(event);
};

export const getAllUsers: LambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await userController.getAllUsers(event);
};