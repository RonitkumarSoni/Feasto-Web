import { io } from 'socket.io-client';

let socket;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const initSocket = (token) => {
    if (!socket && token) {
        socket = io(`${SOCKET_URL}/customer`, {
            auth: {
                token
            }
        });

        socket.on('connect', () => {
            console.log('[Socket] Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('[Socket] Disconnected from server');
        });
    }
    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const joinOrderRoom = (orderId) => {
    if (socket) {
        socket.emit('join_order_room', orderId);
    }
};

export const subscribeToOrderStatus = (onUpdate) => {
    if (!socket) return () => {};
    socket.on('order_status_update', onUpdate);
    return () => socket.off('order_status_update', onUpdate);
};

export const subscribeToDeliveryLocation = (onUpdate) => {
    if (!socket) return () => {};
    socket.on('delivery_location_update', onUpdate);
    return () => socket.off('delivery_location_update', onUpdate);
};

export const subscribeToNotifications = (onNotification) => {
    if (!socket) return () => {};
    socket.on('new_notification', onNotification);
    return () => socket.off('new_notification', onNotification);
};

export default socket;
