// src/modules/payments/payments.repository.ts
import { prisma } from '../../shared/utils/prisma';

export class PaymentsRepository {

  async findByOrderId(orderId: string) {
    return prisma.payment.findUnique({ where: { orderId } });
  }

  async updateStatus(orderId: string, status: string, transactionId?: string) {
    return prisma.payment.update({
      where: { orderId },
      data: {
        status: status as any,
        transactionId,
      },
    });
  }

  async createRefund(paymentId: string, amount: number, reason?: string) {
    return prisma.refund.create({
      data: {
        paymentId,
        amount,
        reason,
        status: 'PENDING',
      },
    });
  }

  async getRefundByPayment(paymentId: string) {
    return prisma.refund.findUnique({ where: { paymentId } });
  }
}
