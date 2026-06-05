// src/modules/auth/auth.service.ts
import { AuthRepository } from './auth.repository';
import { RegisterInput, LoginInput } from './auth.validator';
import { hashPassword, comparePassword } from '../../shared/utils/bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../shared/utils/jwt';
import { AppError } from '../../shared/middleware/errorHandler';
import ms from 'ms';
import { env } from '../../shared/config/env';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async register(input: RegisterInput) {
    const existingUser = await this.repository.findUserByEmail(input.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await hashPassword(input.password);
    
    // Using string literal mapping as Zod validation handles string enum logic
    // but Prisma expects exact matching Enum types.
    // The role field on input was checked by zod to match one of the string variants.
    const userRole = input.role as 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DELIVERY_PARTNER';

    const user = await this.repository.createUser({
      ...input,
      password: hashedPassword,
      role: userRole
    });

    // Exclude password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(input: LoginInput) {
    const user = await this.repository.findUserByEmail(input.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.password) {
      throw new AppError('Account uses social login. Please sign in with Google or Apple.', 401);
    }

    const isMatch = await comparePassword(input.password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    const expiresInMs = ms(env.JWT_REFRESH_EXPIRES_IN as string);
    const expiresAt = new Date(Date.now() + expiresInMs);

    await this.repository.saveRefreshToken(user.id, refreshToken, expiresAt);

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  async refresh(refreshTokenStr: string) {
    try {
      const decoded = verifyRefreshToken(refreshTokenStr);
      const savedToken = await this.repository.findRefreshToken(refreshTokenStr);
      
      if (!savedToken) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      if (new Date() > savedToken.expiresAt) {
        await this.repository.deleteRefreshToken(refreshTokenStr);
        throw new AppError('Refresh token expired', 401);
      }

      const accessToken = signAccessToken({ userId: savedToken.userId, role: savedToken.user.role });
      
      // Optionally rotate refresh token
      // For now, return a new access token
      return { accessToken };
    } catch (e) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(refreshTokenStr: string) {
    await this.repository.deleteRefreshToken(refreshTokenStr).catch(() => {});
  }

  async googleAuth(idToken: string, role: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new AppError('Invalid Google Token', 401);

    let user = await this.repository.findUserByGoogleId(payload.sub);
    if (!user) {
      user = await this.repository.findUserByEmail(payload.email);
      if (user) {
        // Link account
        user = await prisma.user.update({ where: { id: user.id }, data: { googleId: payload.sub } });
      } else {
        // Register new
        const userRole = role as 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DELIVERY_PARTNER';
        user = await this.repository.createUser({
          email: payload.email,
          name: payload.name || 'Google User',
          role: userRole,
          googleId: payload.sub,
          password: '' // Or leave it out if schema allows optional
        });
      }
    }
    return this.generateTokensForUser(user);
  }

  async appleAuth(idToken: string, role: string) {
    try {
      const payload = await appleSignin.verifyIdToken(idToken, {
        audience: process.env.APPLE_CLIENT_ID,
        ignoreExpiration: false,
      });

      let user = await this.repository.findUserByAppleId(payload.sub);
      if (!user) {
        if (payload.email) {
          user = await this.repository.findUserByEmail(payload.email);
        }
        if (user) {
          user = await prisma.user.update({ where: { id: user.id }, data: { appleId: payload.sub } });
        } else {
          const userRole = role as 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DELIVERY_PARTNER';
          user = await this.repository.createUser({
            email: payload.email || `${payload.sub}@apple.auth`,
            name: 'Apple User', // Apple only sends name on first login in frontend
            role: userRole,
            appleId: payload.sub,
          });
        }
      }
      return this.generateTokensForUser(user);
    } catch (e) {
      throw new AppError('Invalid Apple Token', 401);
    }
  }

  private async generateTokensForUser(user: any) {
    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    const expiresInMs = ms(env.JWT_REFRESH_EXPIRES_IN as string);
    const expiresAt = new Date(Date.now() + expiresInMs);

    await this.repository.saveRefreshToken(user.id, refreshToken, expiresAt);

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      tokens: { accessToken, refreshToken }
    };
  }
}
