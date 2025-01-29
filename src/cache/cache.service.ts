import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCache<T>(key: string, funcRequest: () => Promise<T>): Promise<T> {
    const allData: T | null = await this.cacheManager.get<T>(key);

    if (allData) {
      return allData;
    }

    const data: T = await funcRequest();

    await this.cacheManager.set(key, data);

    return data;
  }
}
