export interface DatabaseResult<T> {
  data: T[];
  lastEvaluatedKey: string | null;
  count: number;
  totalCount?: number;
}

export interface IUserRepository {
  create(user: any): Promise<any>;
  findAll(limit: number, lastEvaluatedKey?: string | null): Promise<DatabaseResult<any>>;
}

export interface IFusionRepository {
  create(fusion: any): Promise<any>;
  findAll(limit: number, lastEvaluatedKey?: string | null): Promise<DatabaseResult<any>>;
}