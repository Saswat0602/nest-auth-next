import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../utils/prisma.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}