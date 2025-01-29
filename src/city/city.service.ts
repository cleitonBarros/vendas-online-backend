import { Injectable } from '@nestjs/common';
import { CityEntity } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async getAllCityByStateId(stateId: number): Promise<CityEntity[]> {
    const getCities = () => {
      return this.cityRepository.find({
        where: {
          stateId,
        },
      });
    };

    return this.cacheService.getCache<CityEntity[]>(`state_${stateId}`, () =>
      getCities(),
    );
  }
}
