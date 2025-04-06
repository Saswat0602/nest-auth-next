import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.userService.create(body);
      return this.authService.login(user);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      console.error('Register Error:', err);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.userService.validateUser(body);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return this.authService.login(user);
    } catch (err) {
      console.error('Login Error:', err);
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException('Login failed');
    }
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      const payload = await this.jwtService.verifyAsync(body.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      return this.authService.login(user);
    } catch (err) {
      console.error('Refresh Token Error:', err);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
