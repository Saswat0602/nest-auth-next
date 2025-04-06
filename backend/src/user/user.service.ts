import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../utils/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUserWithOTP(data: {
    email: string;
    password: string;
    name: string;
    role?: Role;
    secretKey?: string;
  }) {
    const { email, password, name, role = Role.REGULAR, secretKey } = data;

    if (role === Role.SUPERADMIN && secretKey !== process.env.SUPER_ADMIN_SECRET) {
      throw new ForbiddenException('Invalid secret key for super admin');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins from now

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        isActive: false,
        otpCode,
        otpExpiresAt,
      },
    });
  }

  async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive)
      throw new UnauthorizedException('Please verify your email first');

    return user;
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async verifyOTP(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      user.otpCode !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    return this.prisma.user.update({
      where: { email },
      data: {
        isActive: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });
  }

  async initiatePasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const resetToken = randomUUID();
    const resetExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetExpiresAt,
      },
    });

    // Here you should send this via email instead of returning
    return resetToken;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) throw new UnauthorizedException('Invalid or expired token');

    const hashed = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetExpiresAt: null,
      },
    });
  }
}
