// src/shared/queues/bullmq.ts
import { Queue, Worker, QueueEvents } from 'bullmq';
import { env } from '../config/env';
import logger from '../logger';
import { prisma } from '../utils/prisma';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

const redisConnection = {
  url: env.REDIS_URL,
};

// 1. Email Queue
export const emailQueue = new Queue('email-queue', { connection: redisConnection });
const emailWorker = new Worker('email-queue', async (job) => {
  logger.info(`Sending email to ${job.data.to}: ${job.data.subject}`);
  
  if (env.RESEND_API_KEY) {
    await resend.emails.send({
      from: env.EMAIL_FROM || 'Feasto <onboarding@resend.dev>',
      to: job.data.to,
      subject: job.data.subject,
      html: job.data.html || `<p>${job.data.body}</p>`,
    });
  }

  return { success: true };
}, { connection: redisConnection });

emailWorker.on('completed', (job) => logger.info(`Email job ${job.id} completed`));
emailWorker.on('failed', (job, err) => logger.error(`Email job ${job?.id} failed:`, err));

// 2. Notification Queue
export const notificationQueue = new Queue('notification-queue', { connection: redisConnection });
const notificationWorker = new Worker('notification-queue', async (job) => {
  const { userId, title, body, type } = job.data;
  await prisma.notification.create({ data: { userId, title, body, type } });
  logger.info(`Notification saved for user ${userId}`);
  return { success: true };
}, { connection: redisConnection });

// 3. Auto-Cancellation Queue (e.g., if restaurant doesn't accept order in 15 mins)
export const orderCancelQueue = new Queue('order-cancel-queue', { connection: redisConnection });
const orderCancelWorker = new Worker('order-cancel-queue', async (job) => {
  const { orderId } = job.data;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  
  if (order && order.status === 'PENDING') {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
    logger.info(`Order ${orderId} auto-cancelled due to timeout`);
    // Queue notification to user
    await notificationQueue.add('order-cancelled', {
      userId: order.userId,
      title: 'Order Cancelled',
      body: 'Your order was cancelled because the restaurant did not respond in time.',
      type: 'ORDER',
    });
  }
}, { connection: redisConnection });

export const queues = {
  emailQueue,
  notificationQueue,
  orderCancelQueue,
};
