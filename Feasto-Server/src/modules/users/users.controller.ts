// src/modules/users/users.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { updateProfileSchema, createAddressSchema, updateAddressSchema } from './users.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class UsersController {
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getAddresses = this.getAddresses.bind(this);
    this.addAddress = this.addAddress.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user is set by authenticate middleware
      // @ts-ignore
      const user = await this.service.getProfile(req.user!.userId);
      sendSuccess(res, 'Profile fetched successfully', { user });
    } catch (e) {
      next(e);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateProfileSchema.parse(req.body);
      // @ts-ignore
      const user = await this.service.updateProfile(req.user!.userId, input);
      sendSuccess(res, 'Profile updated successfully', { user });
    } catch (e) {
      next(e);
    }
  }

  async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const addresses = await this.service.getAddresses(req.user!.userId);
      sendSuccess(res, 'Addresses fetched successfully', { addresses });
    } catch (e) {
      next(e);
    }
  }

  async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createAddressSchema.parse(req.body);
      // @ts-ignore
      const address = await this.service.addAddress(req.user!.userId, input);
      sendSuccess(res, 'Address added successfully', { address }, 201);
    } catch (e) {
      next(e);
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateAddressSchema.parse(req.body);
      const addressId = req.params.id;
      // @ts-ignore
      const address = await this.service.updateAddress(addressId, req.user!.userId, input);
      sendSuccess(res, 'Address updated successfully', { address });
    } catch (e) {
      next(e);
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const addressId = req.params.id;
      // @ts-ignore
      await this.service.deleteAddress(addressId, req.user!.userId);
      sendSuccess(res, 'Address deleted successfully');
    } catch (e) {
      next(e);
    }
  }
}
