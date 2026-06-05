// src/shared/realtime/socket.ts
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server } from 'http';
import { env } from '../config/env';
import logger from '../logger';
import jwt from 'jsonwebtoken';

let io: SocketIOServer;

interface AuthSocket extends Socket {
  user?: any;
}

export const initSocket = (server: Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: env.CORS_ORIGIN.split(','),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication Middleware
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      socket.user = decoded;
      next();
    } catch (e) {
      next(new Error('Invalid token'));
    }
  });

  // Namespaces for different client apps
  
  // 1. Customer Namespace
  const customerNsp = io.of('/customer');
  customerNsp.on('connection', (socket: AuthSocket) => {
    logger.info(`Customer connected: ${socket.user?.userId}`);
    
    // Join a room specifically for this user's notifications
    socket.join(`user_${socket.user?.userId}`);

    socket.on('join_order_room', (orderId) => {
      socket.join(`order_${orderId}`);
      logger.info(`Customer joined order room: ${orderId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Customer disconnected: ${socket.user?.userId}`);
    });
  });

  // 2. Restaurant Namespace
  const restaurantNsp = io.of('/restaurant');
  restaurantNsp.on('connection', (socket: AuthSocket) => {
    if (socket.user?.role !== 'RESTAURANT_OWNER') {
      socket.disconnect();
      return;
    }
    logger.info(`Restaurant owner connected: ${socket.user?.userId}`);

    socket.on('join_restaurant_room', (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`);
      logger.info(`Restaurant joined room: ${restaurantId}`);
    });
  });

  // 3. Delivery Partner Namespace
  const deliveryNsp = io.of('/delivery');
  deliveryNsp.on('connection', (socket: AuthSocket) => {
    if (socket.user?.role !== 'DELIVERY_PARTNER') {
      socket.disconnect();
      return;
    }
    logger.info(`Delivery partner connected: ${socket.user?.userId}`);

    socket.on('update_location', (data) => {
      // Broadcast location to the order room so customer can track
      customerNsp.to(`order_${data.orderId}`).emit('delivery_location_update', {
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.IO is not initialized!');
  return io;
};

// Helper emit functions
export const notifyRestaurantNewOrder = (restaurantId: string, orderData: any) => {
  io.of('/restaurant').to(`restaurant_${restaurantId}`).emit('new_order', orderData);
};

export const notifyCustomerOrderStatus = (orderId: string, status: string) => {
  io.of('/customer').to(`order_${orderId}`).emit('order_status_update', { orderId, status });
};
