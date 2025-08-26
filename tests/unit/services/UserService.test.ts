import { MockUserRepository } from "../../mocks/repositories/MockUserRepository";
import { UserService } from "../../../src/services/UserService";
import { testUsers } from "../../mocks/data/testUsers";

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    userService = new UserService(mockRepository);
  });

  afterEach(() => {
    mockRepository.clear();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const result = await userService.createUser(testUsers.validUser);
      
      expect(result).toBeDefined();
      expect(result.name).toBe(testUsers.validUser.name);
      expect(result.email).toBe(testUsers.validUser.email);
      expect(result.id).toBeDefined();
      expect(mockRepository.size()).toBe(1);
    });

    it('should throw error for invalid user data', async () => {
      await expect(userService.createUser(null as any))
        .rejects.toThrow('Invalid user data provided');
    });

    it('should throw error for user without name', async () => {
      await expect(userService.createUser(testUsers.invalidUserNoName))
        .rejects.toThrow('Validation failed: Name is required');
    });

    it('should throw error for user without email', async () => {
      await expect(userService.createUser(testUsers.invalidUserNoEmail))
        .rejects.toThrow('Validation failed: Email is required');
    });

    it('should throw error for user with invalid email', async () => {
      await expect(userService.createUser(testUsers.invalidUserBadEmail))
        .rejects.toThrow('Validation failed: Invalid email format');
    });

    it('should throw error for duplicate email', async () => {
      // Create first user
      await userService.createUser(testUsers.validUser);
      
      // Try to create user with same email
      await expect(userService.createUser(testUsers.duplicateEmailUser))
        .rejects.toThrow('Email already exists');
    });
  });

  describe('getAllUsers', () => {
    beforeEach(async () => {
      // Create some test users
      await userService.createUser(testUsers.validUser);
      await userService.createUser(testUsers.anotherValidUser);
    });

    it('should return all users with default pagination', async () => {
      const result = await userService.getAllUsers();
      
      expect(result).toBeDefined();
      expect(result.users).toHaveLength(2);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.count).toBe(2);
      expect(result.pagination.limit).toBe(50);
    });

    it('should return users with custom limit', async () => {
      const result = await userService.getAllUsers({ limit: '1' });
      
      expect(result.users).toHaveLength(1);
      expect(result.pagination.count).toBe(1);
      expect(result.pagination.limit).toBe(1);
      expect(result.pagination.hasMore).toBe(true);
    });

    it('should throw error for invalid limit', async () => {
      await expect(userService.getAllUsers({ limit: '0' }))
        .rejects.toThrow('Limit must be between 1 and 100');
      
      await expect(userService.getAllUsers({ limit: '101' }))
        .rejects.toThrow('Limit must be between 1 and 100');
    });
  });
});