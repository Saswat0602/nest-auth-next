import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string; role?: string; secretKey?: string }) {
    try {
      const role = body.role ? (Role[body.role.toUpperCase() as keyof typeof Role] ?? Role.REGULAR) : Role.REGULAR;
  
      const user = await this.userService.createUserWithOTP({
        email: body.email,
        password: body.password,
        name: body.name,
        role,
        secretKey: body.secretKey,
      });
  
      return { message: 'OTP sent to your email', userId: user.id };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      console.error('Register Error:', err);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    return this.userService.verifyOTP(body.email, body.otp);
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
      console.error('Refresh Token Error:', err);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return this.userService.findById(req.user.id);
  }
}
