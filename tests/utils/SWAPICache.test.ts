import { apiCache } from '../../src/utils/cache/APICache';

describe('SWAPICache', () => {
  beforeEach(() => {
    // Limpiar cache antes de cada test
    apiCache.cleanup();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Limpiar cache después de cada test
    apiCache.cleanup();
  });

  describe('Basic Cache Operations', () => {
    it('should store and retrieve data from cache', () => {
      const testData = { name: 'Luke Skywalker' };
      const key = 'test:luke';

      apiCache.set(key, testData, 30);
      const result = apiCache.get(key);

      expect(result).not.toBeNull();
      expect(result?.data).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const result = apiCache.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should handle TTL expiration', () => {
      const testData = { name: 'Luke Skywalker' };
      const key = 'test:luke';

      // Guardar con TTL muy corto (0.001 minutos = 60ms)
      apiCache.set(key, testData, 0.001);

      // Inmediatamente debería estar disponible
      expect(apiCache.get(key)).not.toBeNull();

      // Esperar a que expire
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(apiCache.get(key)).toBeNull();
          resolve();
        }, 100);
      });
    });

    it('should store etag information', () => {
      const testData = { name: 'Luke Skywalker' };
      const key = 'test:luke';
      const etag = 'W/"abc123"';

      apiCache.set(key, testData, 30, etag);
      const result = apiCache.get(key);

      expect(result?.etag).toBe(etag);
    });

    it('should delete specific keys', () => {
      const testData = { name: 'Luke Skywalker' };
      const key = 'test:luke';

      apiCache.set(key, testData, 30);
      expect(apiCache.get(key)).not.toBeNull();

      apiCache.delete(key);
      expect(apiCache.get(key)).toBeNull();
    });

    it('should provide cache statistics', () => {
      apiCache.set('key1', { data: 1 }, 30);
      apiCache.set('key2', { data: 2 }, 30);

      const stats = apiCache.getStats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });
  });
});