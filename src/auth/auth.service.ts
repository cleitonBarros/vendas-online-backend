import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async login(loginDto: LoginDto): Promise<UserEntity> {
    const { email, password } = loginDto;

    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(email)
      .catch(() => undefined);

    const isMatch = await compare(password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException('Email or password is wrong');
    }

    return user;
  }
}
