// socket.js — Mock Socket.IO utility
// Replace the mock with real socket.io-client when backend is ready

const mockSocket = {
    _listeners: {},
    _emit: function (event, data) {
        const listeners = this._listeners[event] || [];
        listeners.forEach(fn => fn(data));
    },
    on: function (event, callback) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
        return this;
    },
    off: function (event, callback) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter(fn => fn !== callback);
        return this;
    },
    emit: function (event, data) {
        console.log('[Socket Mock] Emitting:', event, data);
        return this;
    },
    disconnect: function () {
        console.log('[Socket Mock] Disconnected');
        this._listeners = {};
    },
    connected: true,
};

// Simulate order tracking status updates
export const startOrderTracking = (orderId, onUpdate) => {
    const statuses = [
        { status: 'confirmed', message: 'Order confirmed by restaurant!' },
        { status: 'preparing', message: 'Chef is preparing your food 🍳' },
        { status: 'ready', message: 'Order packed & ready for pickup!' },
        { status: 'picked_up', message: 'Delivery partner picked up your order 🛵' },
        { status: 'near_you', message: "Almost there! Delivery partner is nearby" },
        { status: 'delivered', message: 'Order delivered! Enjoy your meal 🎉' },
    ];

    let index = 0;
    const interval = setInterval(() => {
        if (index < statuses.length) {
            onUpdate({ orderId, ...statuses[index] });
            index++;
        } else {
            clearInterval(interval);
        }
    }, 4000); // Advance every 4 seconds for demo

    return () => clearInterval(interval); // Return cleanup function
};

// Simulate notification events
export const subscribeToNotifications = (onNotification) => {
    const notifications = [
        { type: 'offer', message: '🔥 50% off on your next order! Use: FEAST50' },
        { type: 'order', message: '📦 Your order from Burger King is out for delivery!' },
        { type: 'promo', message: '🎉 New restaurant added in your area!' },
    ];

    let index = 0;
    const interval = setInterval(() => {
        if (index < notifications.length) {
            onNotification(notifications[index]);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 8000);

    return () => clearInterval(interval);
};

export default mockSocket;
