import { User } from '../../../src/models/User';
import { IUser } from '../../../src/utils/types/user.types';
import { DatabaseResult, IUserRepository } from '../../../src/utils/types/database.types';

export class MockUserRepository implements IUserRepository {
  private users: Map<string, IUser> = new Map();

  constructor() {
  }

  public async create(user: User): Promise<User> {
    for (const existingUser of this.users.values()) {
      if (existingUser.email === user.email) {
        throw new Error('Email already exists');
      }
    }
    
    this.users.set(user.id, user.toJSON());
    return user;
  }

  public async findById(id: string): Promise<IUser | null> {
    const user = this.users.get(id);
    return user || null;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  public async findAll(limit: number = 50, lastEvaluatedKey: string | null = null): Promise<DatabaseResult<IUser>> {
    const users = Array.from(this.users.values());
    
    let startIndex = 0;
    if (lastEvaluatedKey) {
      const lastIndex = users.findIndex(user => user.id === lastEvaluatedKey);
      startIndex = lastIndex + 1;
    }
    
    const paginatedUsers = users.slice(startIndex, startIndex + limit);
    const nextKey = startIndex + limit < users.length ? users[startIndex + limit - 1].id : null;
    
    return {
      data: paginatedUsers,
      lastEvaluatedKey: nextKey,
      count: paginatedUsers.length
    };
  }

  // Métodos útiles para testing
  public clear(): void {
    this.users.clear();
  }

  public size(): number {
    return this.users.size;
  }

  public getAllUsers(): IUser[] {
    return Array.from(this.users.values());
  }
}