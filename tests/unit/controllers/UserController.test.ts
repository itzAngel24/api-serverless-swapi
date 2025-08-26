import { UserController } from "../../../src/controllers/UserController";
import { UserService } from "../../../src/services/UserService";
import { testUsers } from "../../mocks/data/testUsers";
import { APIGatewayProxyEvent } from 'aws-lambda';

// Mock del UserService con tipado explícito
const mockUserService = {
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  userRepository: {
      create: jest.fn(),
      findAll: jest.fn(),
    } as any,
} as unknown as jest.Mocked<UserService>;

// Mock del módulo
jest.mock('../../../src/services/UserService', () => {
  return {
    UserService: jest.fn().mockImplementation(() => mockUserService)
  };
});

describe('UserController', () => {
  let userController: UserController;

  beforeEach(() => {
    jest.clearAllMocks();
    userController = new UserController(mockUserService);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const mockUser = { id: '123', ...testUsers.validUser };
      mockUserService.createUser.mockResolvedValue(mockUser);

      // Casting simple para el evento
      const event = {
        body: JSON.stringify(testUsers.validUser)
      } as APIGatewayProxyEvent;

      const result = await userController.createUser(event);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body).success).toBe(true);
      expect(JSON.parse(result.body).data).toEqual(mockUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(testUsers.validUser);
    });

    it('should return 400 for invalid JSON', async () => {
      const event = {
        body: 'invalid json'
      } as APIGatewayProxyEvent;

      const result = await userController.createUser(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).success).toBe(false);
      expect(JSON.parse(result.body).error).toBe('Invalid JSON in request body');
    });

    it('should return 400 for validation errors', async () => {
      mockUserService.createUser.mockRejectedValue(new Error('Validation failed: Name is required'));

      const event = {
        body: JSON.stringify(testUsers.invalidUserNoName)
      } as APIGatewayProxyEvent;

      const result = await userController.createUser(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).success).toBe(false);
      expect(JSON.parse(result.body).error).toBe('Validation failed: Name is required');
    });

    it('should return 500 for unexpected errors', async () => {
      mockUserService.createUser.mockRejectedValue(new Error('Database connection failed'));

      const event = {
        body: JSON.stringify(testUsers.validUser)
      } as APIGatewayProxyEvent;

      const result = await userController.createUser(event);

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).success).toBe(false);
      expect(JSON.parse(result.body).error).toBe('Internal server error');
    });
  });
});