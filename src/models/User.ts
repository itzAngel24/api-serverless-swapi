import { IUser, CreateUserData, ValidationResult } from '../utils/types/user.types';

export class User implements IUser {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name?.trim();
    this.email = email?.trim()?.toLowerCase();
  }

  public validate(): ValidationResult {
    const errors: string[] = [];
    
    if (!this.name || this.name.length === 0) {
      errors.push('Name is required');
    }
    
    if (!this.email || this.email.length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Invalid email format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public toJSON(): IUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email
    };
  }

  public static fromData(id: string, data: CreateUserData): User {
    return new User(id, data.name, data.email);
  }
}