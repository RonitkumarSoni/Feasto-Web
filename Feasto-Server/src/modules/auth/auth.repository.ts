// src/modules/auth/auth.repository.ts
import { prisma } from '../../shared/utils/prisma';
import { RegisterInput } from './auth.validator';
import { Prisma, Role } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserByGoogleId(googleId: string) {
    return prisma.user.findUnique({ where: { googleId } });
  }

  async findUserByAppleId(appleId: string) {
    return prisma.user.findUnique({ where: { appleId } });
  }

  async createUser(data: Omit<RegisterInput, 'role'> & { role: Role; googleId?: string; appleId?: string; password?: string }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        googleId: data.googleId,
        appleId: data.appleId,
      }
    });
  }

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    });
  }

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({
      where: { token }
    });
  }
}
