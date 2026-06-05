// src/modules/delivery/delivery.service.ts
import { DeliveryRepository } from './delivery.repository';
import { AppError } from '../../shared/middleware/errorHandler';

export class DeliveryService {
  private repository: DeliveryRepository;

  constructor() {
    this.repository = new DeliveryRepository();
  }

  async registerPartner(userId: string, vehicleType: string, vehicleNumber: string) {
    const existing = await this.repository.getPartnerByUserId(userId);
    if (existing) throw new AppError('Delivery partner profile already exists', 400);
    return this.repository.registerPartner(userId, vehicleType, vehicleNumber);
  }

  async getProfile(userId: string) {
    const partner = await this.repository.getPartnerByUserId(userId);
    if (!partner) throw new AppError('Delivery partner profile not found', 404);
    return partner;
  }

  async toggleAvailability(userId: string) {
    const partner = await this.repository.getPartnerByUserId(userId);
    if (!partner) throw new AppError('Delivery partner profile not found', 404);
    return this.repository.updateAvailability(partner.id, !partner.isAvailable);
  }

  async updateLocation(userId: string, latitude: number, longitude: number) {
    const partner = await this.repository.getPartnerByUserId(userId);
    if (!partner) throw new AppError('Delivery partner profile not found', 404);
    return this.repository.updateLocation(partner.id, latitude, longitude);
  }

  async assignToOrder(orderId: string) {
    // Auto-assign to the first available delivery partner
    const partners = await this.repository.findAvailablePartners();
    if (partners.length === 0) throw new AppError('No delivery partners available', 503);

    const selectedPartner = partners[0]; // Simple FIFO; in production use proximity
    const earnings = 50; // Fixed earnings per delivery for now

    return this.repository.assignDelivery(orderId, selectedPartner.id, earnings);
  }

  async getDeliveryByOrder(orderId: string) {
    const delivery = await this.repository.getDeliveryByOrder(orderId);
    if (!delivery) throw new AppError('Delivery not found for this order', 404);
    return delivery;
  }

  async updateDeliveryStatus(userId: string, orderId: string, status: string) {
    const partner = await this.repository.getPartnerByUserId(userId);
    if (!partner) throw new AppError('Delivery partner profile not found', 404);

    const delivery = await this.repository.getDeliveryByOrder(orderId);
    if (!delivery) throw new AppError('Delivery not found', 404);
    if (delivery.deliveryPartnerId !== partner.id) {
      throw new AppError('Not authorized to update this delivery', 403);
    }

    return this.repository.updateDeliveryStatus(orderId, status);
  }

  async getMyDeliveries(userId: string, page = 1, limit = 10) {
    const partner = await this.repository.getPartnerByUserId(userId);
    if (!partner) throw new AppError('Delivery partner profile not found', 404);
    return this.repository.getPartnerDeliveries(partner.id, page, limit);
  }

  async getMyEarnings(userId: string) {
    const partner = await this.repository.getPartnerByUserId(userId);
    if (!partner) throw new AppError('Delivery partner profile not found', 404);
    return this.repository.getPartnerEarnings(partner.id);
  }
}
