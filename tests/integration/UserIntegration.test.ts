import { MockUserRepository } from "../../tests/mocks/repositories/MockUserRepository";
import { UserController } from "../../src/controllers/UserController";
import { UserService } from "../../src/services/UserService";
import { testUsers } from "../mocks/data/testUsers";
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Users Integration Tests', () => {
  let userController: UserController;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    const userService = new UserService(mockRepository);
    userController = new UserController(userService);
  });

  afterEach(() => {
    mockRepository.clear();
  });

  it('should handle complete user creation flow', async () => {
    const event = {
    body: JSON.stringify(testUsers.validUser)
    } as APIGatewayProxyEvent;

    const result = await userController.createUser(event);
    
    expect(result.statusCode).toBe(201);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.id).toBeDefined();
    expect(responseBody.data.name).toBe(testUsers.validUser.name);
    expect(responseBody.data.email).toBe(testUsers.validUser.email);
  });

  it('should handle complete get all users flow', async () => {
    // Create multiple users
    await userController.createUser({
      body: JSON.stringify(testUsers.validUser)
    } as APIGatewayProxyEvent );

    await userController.createUser({
      body: JSON.stringify(testUsers.anotherValidUser)
    } as APIGatewayProxyEvent);

    // Get all users
    const event = {
      queryStringParameters: { limit: '10' }
    } as unknown as APIGatewayProxyEvent;
    const result = await userController.getAllUsers(event);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.users).toHaveLength(2);
    expect(responseBody.data.pagination.count).toBe(2);
  });
});