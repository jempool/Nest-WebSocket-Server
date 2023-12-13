import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { REFRESH_TOKEN_EXPIRES_IN } from '../config/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { name: user.name, email: user.email };
    return {
      user: payload,
      accessToken: await this.jwtService.signAsync({ user: payload }),
      refreshToken: await this.jwtService.signAsync(
        { user: payload },
        {
          expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    };
  }

  async signUp(name: string, email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user) {
      throw new BadRequestException(
        `The email ${email} is already associated with an account`,
      );
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    await this.usersService.create({ name, email, password: hash });
    const payload = { name: name, email: email };
    return {
      user: payload,
      accessToken: await this.jwtService.signAsync({ user: payload }),
      refreshToken: await this.jwtService.signAsync(
        { user: payload },
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
      ),
    };
  }

  async refreshToken(email: string, refreshToken: string) {
    const token = await this.jwtService.verifyAsync(refreshToken);
    const isValid = token.user.email === email;
    if (!isValid) {
      throw new UnauthorizedException();
    }
    const payload = { name: token.user.name, email: token.user.email };
    return {
      user: payload,
      accessToken: await this.jwtService.signAsync({ user: payload }),
    };
  }
}
