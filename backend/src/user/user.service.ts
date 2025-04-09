import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../utils/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailerService,
  ) { }

  async createUserWithOTP(data: {
    email: string;
    password: string;
    name: string;
    role?: Role;
    secretKey?: string;
  }) {
    const { email, password, name, role = Role.REGULAR, secretKey } = data;

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    if (role === Role.SUPERADMIN && secretKey !== process.env.SUPER_ADMIN_SECRET) {
      throw new ForbiddenException('Invalid secret key for super admin');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const user = await this.prisma.user.create({
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

    await this.mailService.sendOTPEmail(email, otpCode);

    return user;
  }


  async validateUser({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
  
    if (!user.isActive) {
      // Generate new OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const newExpiry = new Date(Date.now() + 15 * 60 * 1000);
  
      await this.prisma.user.update({
        where: { email },
        data: {
          otpCode: newOtp,
          otpExpiresAt: newExpiry,
        },
      });
  
      await this.mailService.sendOTPEmail(email, newOtp);
  
      throw new UnauthorizedException('Email not verified. A new OTP has been sent.');
    }
  
    return user;
  }
  

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async verifyOTP(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      String(user.otpCode) !== String(otp) ||
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
    const resetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetExpiresAt,
      },
    });

    await this.mailService.sendResetToken(email, resetToken);

    return true;
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
