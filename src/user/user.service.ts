/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dtos';
import { UserEntity } from './interfaces/user.entity';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const passwordhashed = await hash(createUserDto.password, 10);

    return this.userRepository.save({
      ...createUserDto,
      password: passwordhashed,
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
