import axios from 'axios';
import { apiCache } from '../utils/cache/APICache';
import { AxiosResponse } from 'axios';
import { QuoteAPIQuote, QuoteAPIResponse } from '@/utils/types/quoteapi.types';

export class QuotesService {
  private readonly baseURL = 'https://api.breakingbadquotes.xyz/v1/quotes';
  private readonly defaultTTL = 30; // 30 minutos por defecto

  private isMock: boolean = false;
  private mockData: any;
  
  constructor() {
    // Configurar axios con timeout y retry
    axios.defaults.timeout = 10000;
    axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (compatible; API-Client/1.0)';
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['rejectUnauthorized'] = false;
    this.isMock = false;
  }

  public activateMockMode(testData: any) {
    this.isMock = true;
    this.mockData = testData;
  }
  
  // Método genérico para hacer peticiones con cache
  private async fetchWithCache<T>(
    endpoint: string, 
    ttlMinutes: number = this.defaultTTL
  ): Promise<T> {
    const cacheKey = `quoteapi:${endpoint}`;
    // Intentar obtener del cache
    const cached = apiCache.get<T>(cacheKey);
    if (cached) {
      const resultado = {"results": cached.data, "isCached": true} as unknown as T;
      // const resultado = cached.data;
      return resultado;
    }
    try {
      const response: AxiosResponse<T> = await axios.get(`${this.baseURL}${endpoint}`);
      // Guardar en cache
      const etag = response.headers.etag;
      apiCache.set(cacheKey, response.data, ttlMinutes, etag);
      const resultado = {"results": response.data, "isCached": false} as unknown as T;
      // const resultado = response.data;
      return resultado;
    } catch (error: any) {
      const expiredCache = apiCache.get<T>(cacheKey);
      if (expiredCache) {
        return expiredCache.data;
      }
      throw new Error(`Failed to fetch from API: ${error.message}`);
    }
  }
  
  // Obtener todas las películas
  async getQuotes(count: number): Promise<QuoteAPIResponse<QuoteAPIQuote>> {
    return this.fetchWithCache<QuoteAPIResponse<QuoteAPIQuote>>('/'+count, 60);
  }
  
  // Limpiar cache manualmente
  clearCache(): void {
    apiCache.cleanup();
  }
}