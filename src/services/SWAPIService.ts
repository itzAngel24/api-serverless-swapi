import axios from 'axios';
import { apiCache } from '../utils/cache/APICache';
import { SWAPIPerson, SWAPIResponse } from '../utils/types/swapi.types';
import { AxiosResponse } from 'axios';

export class SWAPIService {
  private readonly baseURL = 'https://swapi.py4e.com/api';
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
    const cacheKey = `swapi:${endpoint}`;
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
      throw new Error(`Failed to fetch from SWAPI: ${error.message}`);
    }
  }
  
  // Obtener todos los personajes
  async getAllPeople(page: number = 1): Promise<SWAPIResponse<SWAPIPerson>> {
    return this.fetchWithCache<SWAPIResponse<SWAPIPerson>>(`/people/?page=${page}`);
  }
  
  // Obtener estadísticas del cache
  getCacheStats(): any {
    return apiCache.getStats();
  }
  
  // Limpiar cache manualmente
  clearCache(): void {
    apiCache.cleanup();
  }
}