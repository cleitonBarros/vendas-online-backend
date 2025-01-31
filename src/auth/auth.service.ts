import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { ReturnLoginDto } from './dtos/returnLogin.dto';
import { ReturnUserDto } from '../user/dtos/returnUser.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './dtos/loginPayload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const { email, password } = loginDto;

    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(email)
      .catch(() => undefined);

    const isMatch = await compare(password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException('Email or password is wrong');
    }

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
      user: new ReturnUserDto(user),
    };
  }
}
