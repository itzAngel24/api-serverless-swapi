import { User } from '../../../src/models/User';
import { CreateUserData } from '../../../src/utils/types/user.types';

describe('User Model', () => {
  describe('constructor', () => {
    it('should create a user with all required fields', () => {
      const user = new User('123', 'John Doe', 'john@example.com');
      
      expect(user.id).toBe('123');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });

    it('should normalize email to lowercase', () => {
      const user = new User('123', 'John Doe', 'JOHN@EXAMPLE.COM');
      expect(user.email).toBe('john@example.com');
    });

    it('should trim name and email', () => {
      const user = new User('123', '  John Doe  ', '  john@example.com  ');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });
  });

  describe('validate', () => {
    it('should return valid for correct user data', () => {
      const user = new User('123', 'John Doe', 'john@example.com');
      const validation = user.validate();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should return invalid for missing name', () => {
      const user = new User('123', '', 'john@example.com');
      const validation = user.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Name is required');
    });

    it('should return invalid for missing email', () => {
      const user = new User('123', 'John Doe', '');
      const validation = user.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Email is required');
    });

    it('should return invalid for malformed email', () => {
      const user = new User('123', 'John Doe', 'invalid-email');
      const validation = user.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid email format');
    });
  });

  describe('fromData', () => {
    it('should create user from CreateUserData', () => {
      const userData: CreateUserData = { name: 'John Doe', email: 'john@example.com' };
      const user = User.fromData('123', userData);
      
      expect(user.id).toBe('123');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });
  });

  describe('toJSON', () => {
    it('should return plain object with all properties', () => {
      const user = new User('123', 'John Doe', 'john@example.com');
      const json = user.toJSON();
      
      expect(json).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      });
    });
  });
});