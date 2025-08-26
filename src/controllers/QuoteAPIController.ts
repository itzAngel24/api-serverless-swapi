import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QuotesService } from '../services/QuotesService';

export class QuoteAPIController {
  private service: QuotesService;
  
  constructor(service: QuotesService) {
    this.service = service;
  }
  
  // Obtener quotes
  async getQuotes(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const page = event.queryStringParameters?.page ? parseInt(event.queryStringParameters.page) : 1;
      let result;
      result = await this.service.getQuotes(page);
      console.log("controller Got quotes:", result);
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
          error: 'Failed to fetch Quotes'
        })
      };
    }
  }
}