// src/modules/payments/payments.service.ts
import { PaymentsRepository } from './payments.repository';
import { AppError } from '../../shared/middleware/errorHandler';
import { prisma } from '../../shared/utils/prisma';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../../shared/config/env';

export class PaymentsService {
  private repository: PaymentsRepository;

  constructor() {
    this.repository = new PaymentsRepository();
  }

  async initiateRazorpay(userId: string, orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new AppError('Order not found', 404);
    if (order.userId !== userId) throw new AppError('Not authorized', 403);

    const payment = await this.repository.findByOrderId(orderId);
    if (!payment) throw new AppError('Payment record not found', 404);
    if (payment.status === 'SUCCESS') throw new AppError('Payment already completed', 400);

    const razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });

    try {
      const rpOrder = await razorpay.orders.create({
        amount: Math.round(order.totalAmount * 100), // paise
        currency: 'INR',
        receipt: `receipt_${orderId}`,
      });

      return {
        razorpayOrderId: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        key: env.RAZORPAY_KEY_ID,
      };
    } catch (error) {
      console.error('Razorpay Error:', error);
      throw new AppError('Failed to initiate payment', 500);
    }
  }

  async verifyRazorpay(userId: string, data: {
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) {
    const order = await prisma.order.findUnique({ where: { id: data.orderId } });
    if (!order) throw new AppError('Order not found', 404);
    if (order.userId !== userId) throw new AppError('Not authorized', 403);

    const generatedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== data.razorpaySignature) {
      throw new AppError('Invalid payment signature', 400);
    }

    // Update payment status
    const payment = await this.repository.updateStatus(data.orderId, 'SUCCESS', data.razorpayPaymentId);

    return payment;
  }

  async getPaymentByOrder(orderId: string) {
    const payment = await this.repository.findByOrderId(orderId);
    if (!payment) throw new AppError('Payment not found', 404);
    return payment;
  }

  async initiateRefund(orderId: string, reason?: string) {
    const payment = await this.repository.findByOrderId(orderId);
    if (!payment) throw new AppError('Payment not found', 404);
    if (payment.status !== 'SUCCESS') throw new AppError('Payment not completed, cannot refund', 400);

    const existing = await this.repository.getRefundByPayment(payment.id);
    if (existing) throw new AppError('Refund already initiated', 400);

    const refund = await this.repository.createRefund(payment.id, payment.amount, reason);

    // Update payment status
    await this.repository.updateStatus(orderId, 'REFUNDED');

    return refund;
  }
}
