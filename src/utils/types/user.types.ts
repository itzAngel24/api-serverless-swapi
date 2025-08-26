// src/types/user.types.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserData {
  name: string;
  email: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface UserServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

export interface PaginationResult<T> {
  users: T[];
  pagination: {
    count: number;
    totalCount?: number;
    limit: number;
    lastEvaluatedKey: string | null;
    hasMore: boolean;
  };
}