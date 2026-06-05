// src/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, refreshTokenSchema, oauthSchema } from './auth.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refresh = this.refresh.bind(this);
    this.logout = this.logout.bind(this);
    this.googleAuth = this.googleAuth.bind(this);
    this.appleAuth = this.appleAuth.bind(this);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const user = await this.service.register(input);
      sendSuccess(res, 'User registered successfully', { user }, 201);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const { user, tokens } = await this.service.login(input);
      
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      sendSuccess(res, 'Login successful', { user, accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Token can be in body or cookie
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const input = refreshTokenSchema.parse({ refreshToken: token });
      
      const { accessToken } = await this.service.refresh(input.refreshToken);
      sendSuccess(res, 'Token refreshed successfully', { accessToken });
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (token) {
        await this.service.logout(token);
      }
      res.clearCookie('refreshToken');
      sendSuccess(res, 'Logout successful');
    } catch (e) {
      next(e);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const input = oauthSchema.parse(req.body);
      const { user, tokens } = await this.service.googleAuth(input.idToken, input.role);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      sendSuccess(res, 'Google login successful', { user, accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async appleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const input = oauthSchema.parse(req.body);
      const { user, tokens } = await this.service.appleAuth(input.idToken, input.role);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      sendSuccess(res, 'Apple login successful', { user, accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }
}
