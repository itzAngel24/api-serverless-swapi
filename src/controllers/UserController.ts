import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserService } from '../services/UserService';
import { ResponseUtil } from '../utils/response';
import { CreateUserData, IUser } from '../utils/types/user.types';
import { QueryParams } from '../utils/types/api.types';

export class UserController {
  private readonly userService: UserService;

  constructor(userService?: UserService) {
    this.userService = userService || new UserService();
  }

  public async createUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      let requestBody: CreateUserData;
      
      try {
        requestBody = JSON.parse(event.body || '{}') as CreateUserData;
      } catch (parseError) {
        return ResponseUtil.error(400, 'Invalid JSON in request body');
      }

      const user: IUser = await this.userService.createUser(requestBody);
      return ResponseUtil.success(201, user, 'User created successfully');

    } catch (error: any) {
      if (error.message.includes('Validation failed') || 
          error.message.includes('Email already exists') ||
          error.message.includes('Invalid user data')) {
        return ResponseUtil.error(400, error.message);
      }
      
      return ResponseUtil.error(500, 'Internal server error');
    }
  }
  public async getAllUsers(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const queryParams: QueryParams = (event.queryStringParameters as QueryParams) || {};
      
      const result = await this.userService.getAllUsers(queryParams);
      return ResponseUtil.success(200, result, `Retrieved ${result.users.length} users successfully`);

    } catch (error: any) {
      if (error.message.includes('Limit must be')) {
        return ResponseUtil.error(400, error.message);
      }
      
      return ResponseUtil.error(500, 'Internal server error');
    }
  }
}