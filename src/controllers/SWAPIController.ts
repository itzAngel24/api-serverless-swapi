import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SWAPIService } from '../services/SWAPIService';

export class SWAPIController {
  private swapiService: SWAPIService;
  
  constructor(swapiService: SWAPIService) {
    this.swapiService = swapiService;
  }
  
  // Obtener personajes
  async getPeople(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const page = event.queryStringParameters?.page ? parseInt(event.queryStringParameters.page) : 1;
      let result;
      result = await this.swapiService.getAllPeople(page);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800' // 30 minutos en CDN también
        },
        body: JSON.stringify({
          success: true,
          data: result
        })
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'Failed to fetch Star Wars characters'
        })
      };
    }
  }
}