import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ResponseUtil } from '../utils/response';
import { QueryParams } from '../utils/types/api.types';
import { FusionService } from '@/services/FusionService';
import { CreateFusionData, IFusion } from '@/utils/types/fusion.types';

export class FusionController {
  private readonly service: FusionService;

  constructor(service?: FusionService) {
    this.service = service || new FusionService();
  }
  public async getFusions(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const queryParams: QueryParams = (event.queryStringParameters as QueryParams) || {};
      const result = await this.service.getFusions(queryParams);
      return ResponseUtil.success(200, result, `Retrieved ${result.fusions.length} fusions successfully`);
    } catch (error: any) {
      if (error.message.includes('Limit must be')) {
        return ResponseUtil.error(400, error.message);
      }
      return ResponseUtil.error(500, 'Internal server error');
    }
  }

  public async createFusion(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      let requestBody: CreateFusionData;
      try {
        requestBody = JSON.parse(event.body || '{}') as CreateFusionData;
      } catch (parseError) {
        return ResponseUtil.error(400, 'Invalid JSON in request body');
      }
      const fusion: IFusion = await this.service.createFusion(requestBody);
      return ResponseUtil.success(201, fusion, 'Fusion created successfully');
    } catch (error: any) {
      return ResponseUtil.error(500, 'Internal server error');
    }
  }

  public async getHistoryFusions(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const queryParams: QueryParams = (event.queryStringParameters as QueryParams) || {};
      
      const result = await this.service.getHistoryFusions(queryParams);
      return ResponseUtil.success(200, result, `Retrieved ${result.fusions.length} fusions successfully`);

    } catch (error: any) {
      if (error.message.includes('Limit must be')) {
        return ResponseUtil.error(400, error.message);
      }
      return ResponseUtil.error(500, 'Internal server error');
    }
  }
  
}