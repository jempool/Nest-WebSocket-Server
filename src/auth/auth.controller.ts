import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    try {
      return await this.authService.signIn(signInDto.email, signInDto.password);
    } catch (error) {
      throw new HttpException(
        'Incorrect email or password.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(
      signUpDto.name,
      signUpDto.email,
      signUpDto.password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshToken(@Body() refreshDto: Record<string, any>) {
    return this.authService.refreshToken(
      refreshDto.email,
      refreshDto.refreshToken,
    );
  }
}
