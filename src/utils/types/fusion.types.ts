export interface IFusion {
  id: string;
  name: string;
  height: string;
  mass: string;
  gender: string;
  homeworld: string;
  favoritequote: string;
  createdAt?: string;
}

export interface CreateFusionData {
  name: string;
  height: string;
  mass: string;
  gender: string;
  homeworld: string;
  favoritequote: string;
  createdAt?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FusionServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

export interface FusionPaginationResult<T> {
  fusions: T[];
  isCached?: boolean;
  pagination: {
    count: number;
    totalCount?: number;
    limit: number;
    lastEvaluatedKey: string | null;
    hasMore: boolean;
  };
}

export interface PaginationResult<T> {
  fusions: T[];
  pagination: {
    count: number;
    totalCount?: number;
    limit: number;
    lastEvaluatedKey: string | null;
    hasMore: boolean;
  };
}