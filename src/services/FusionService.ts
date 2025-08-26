import { v4 as uuidv4 } from 'uuid';
import { DatabaseResult, IFusionRepository } from '../utils/types/database.types';
import { QueryParams } from '../utils/types/api.types';
import { FusionRepository } from '@/repositories/FusionRepository';
import { CreateFusionData, IFusion, FusionPaginationResult, PaginationResult } from '@/utils/types/fusion.types';
import { Fusion } from '@/models/Fusion';
import { QuotesService } from './QuotesService';
import { SWAPIService } from './SWAPIService';
import { FusionAdapter } from '@/utils/fusion.adapter';

export class FusionService {
  private readonly repository: IFusionRepository;
  private swapiService: SWAPIService;
  private quoteService: QuotesService;
  private fusionAdapter: FusionAdapter;

  constructor(repository?: IFusionRepository) {
    this.repository = repository || new FusionRepository();
    this.quoteService = new QuotesService();
    this.swapiService = new SWAPIService();
    this.fusionAdapter = new FusionAdapter();
  }

  public async createFusion(fusionData: CreateFusionData): Promise<IFusion> {
    try {
      if (!fusionData || typeof fusionData !== 'object') {
        throw new Error('Invalid user data provided');
      }
      const fusion = Fusion.fromData(uuidv4(), fusionData);
      const validation = fusion.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      const createdUser = await this.repository.create(fusion);
      return createdUser.toJSON();
    } catch (error: any) {
      console.error("Error in createFusion:", error);
      throw error;
    }
  }

  public async getFusions(queryParams: QueryParams = {}): Promise<FusionPaginationResult<IFusion>> {
    try {
      const limit = parseInt(queryParams.limit || '50');
      const lastEvaluatedKey = queryParams.lastEvaluatedKey || null;
      if (limit < 1 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }
      const [peopleData, quotesData] = await Promise.all([
        this.swapiService.getAllPeople(1),
        this.quoteService.getQuotes(10)
      ]);
      return this.adaptFusionData(limit, peopleData, quotesData);
    } catch (error: any) {
      console.error("Error in getFusions:", error);
      throw error;
    }
  }

  public async adaptFusionData(limit:any, peopleData: any, quotesData: any): Promise<FusionPaginationResult<IFusion>>  {
    // Ahora que tenemos ambos datos, adaptarlos
    const fusedData = this.fusionAdapter.adapt(peopleData, quotesData);
    const fusedCreateFusionData = this.fusionAdapter.fusionToCreateFusionDataList(fusedData);
    for (const fusionData of fusedCreateFusionData) {
      this.createFusion(fusionData).catch(err => 
        {
          console.error("Error creating fusion:", err);
        }
      );
    }
    const result: DatabaseResult<IFusion> = {
      data: fusedData,
      count: fusedData.length,
      totalCount: fusedData.length,
      lastEvaluatedKey: null
    };
    return {
      fusions: result.data,
      isCached: peopleData.isCached || quotesData.isCached,
      pagination: {
        count: result.count,
        totalCount: result.totalCount,
        limit: limit,
        lastEvaluatedKey: result.lastEvaluatedKey,
        hasMore: !!result.lastEvaluatedKey
      }
    };
  }

  public async getHistoryFusions(queryParams: QueryParams = {}): Promise<PaginationResult<IFusion>> {
    try {
      const limit = parseInt(queryParams.limit || '50');
      const lastEvaluatedKey = queryParams.lastEvaluatedKey || null;
      if (limit < 1 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }
      const result: DatabaseResult<IFusion> = await this.repository.findAll(limit, lastEvaluatedKey);
      return {
        fusions: result.data,
        pagination: {
          count: result.count,
          totalCount: result.totalCount,
          limit: limit,
          lastEvaluatedKey: result.lastEvaluatedKey,
          hasMore: !!result.lastEvaluatedKey
        }
      };
    } catch (error: any) {
      console.error("Error in getHistoryFusions:", error);
      throw error;
    }
  }
}