// src/utils/response.ts
import { APIGatewayProxyResult } from 'aws-lambda';
import { ApiResponse } from '../utils/types/api.types';

export class ResponseUtil {
  private static readonly corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
  };

  public static success<T>(statusCode: number, data: T, message: string = 'Success'): APIGatewayProxyResult {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };

    return {
      statusCode,
      headers: this.corsHeaders,
      body: JSON.stringify(response)
    };
  }

  public static error(statusCode: number, error: string, message: string = 'Error'): APIGatewayProxyResult {
    const response: ApiResponse = {
      success: false,
      message,
      error
    };

    return {
      statusCode,
      headers: this.corsHeaders,
      body: JSON.stringify(response)
    };
  }

}