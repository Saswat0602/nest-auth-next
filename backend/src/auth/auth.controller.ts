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
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role?: Role;
      secretKey?: string;
    },
  ) {
    try {
      const user = await this.userService.createUserWithOTP(body);
      return { message: 'OTP sent. Please verify your email.' };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('verify-otp')
  async verifyOTP(@Body() body: { email: string; otp: string }) {
    await this.userService.verifyOTP(body.email, body.otp);
    return { message: 'Email verified. You can now login.' };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.userService.validateUser(body);
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
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Post('forgot-password')
  async forgot(@Body() body: { email: string }) {
    const token = await this.userService.initiatePasswordReset(body.email);
    return { message: 'Reset link sent', token };
  }

  @Post('reset-password')
  async reset(@Body() body: { token: string; newPassword: string }) {
    await this.userService.resetPassword(body.token, body.newPassword);
    return { message: 'Password updated successfully' };
  }
}
