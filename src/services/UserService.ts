import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserData, IUser, PaginationResult } from '../utils/types/user.types';
import { IUserRepository, DatabaseResult } from '../utils/types/database.types';
import { QueryParams } from '../utils/types/api.types';

export class UserService {
  private readonly userRepository: IUserRepository;

  constructor(repository?: IUserRepository) {
    this.userRepository = repository || new UserRepository();
  }

  public async createUser(userData: CreateUserData): Promise<IUser> {
    try {
      if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid user data provided');
      }

      const user = User.fromData(uuidv4(), userData);
      
      const validation = user.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      const createdUser = await this.userRepository.create(user);
      return createdUser.toJSON();
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllUsers(queryParams: QueryParams = {}): Promise<PaginationResult<IUser>> {
    try {
      const limit = parseInt(queryParams.limit || '50');
      const lastEvaluatedKey = queryParams.lastEvaluatedKey || null;
      if (limit < 1 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }
      const result: DatabaseResult<IUser> = await this.userRepository.findAll(limit, lastEvaluatedKey);
      return {
        users: result.data,
        pagination: {
          count: result.count,
          totalCount: result.totalCount,
          limit: limit,
          lastEvaluatedKey: result.lastEvaluatedKey,
          hasMore: !!result.lastEvaluatedKey
        }
      };
    } catch (error: any) {
      throw error;
    }
  }
}