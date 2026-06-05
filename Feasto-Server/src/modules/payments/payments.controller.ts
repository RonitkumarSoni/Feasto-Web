// src/modules/payments/payments.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PaymentsService } from './payments.service';
import { initiatePaymentSchema, verifyPaymentSchema } from './payments.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class PaymentsController {
  private service: PaymentsService;

  constructor() {
    this.service = new PaymentsService();
    this.initiate = this.initiate.bind(this);
    this.verify = this.verify.bind(this);
    this.getByOrder = this.getByOrder.bind(this);
  }

  async initiate(req: Request, res: Response, next: NextFunction) {
    try {
      const input = initiatePaymentSchema.parse(req.body);
      // @ts-ignore
      const result = await this.service.initiateRazorpay(req.user!.userId, input.orderId);
      sendSuccess(res, 'Payment initiated', result);
    } catch (e) {
      next(e);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const input = verifyPaymentSchema.parse(req.body);
      // @ts-ignore
      const payment = await this.service.verifyRazorpay(req.user!.userId, input);
      sendSuccess(res, 'Payment verified successfully', { payment });
    } catch (e) {
      next(e);
    }
  }

  async getByOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await this.service.getPaymentByOrder(req.params.orderId);
      sendSuccess(res, 'Payment details', { payment });
    } catch (e) {
      next(e);
    }
  }
}
