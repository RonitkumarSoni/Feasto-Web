import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Package, CheckCircle, DollarSign, Star, Clock,
    Navigation, Phone, ChevronRight, Bell, User, Bike, ArrowUp, Wallet
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockAvailableOrders = [
    { id: 'ORD-701', restaurant: 'Burger King, MG Road', customer: 'Priya S., Koramangala', distance: '3.2 km', earning: '₹45', eta: '18 min' },
    { id: 'ORD-702', restaurant: 'Pizza Hut, Indiranagar', customer: 'Rahul V., HSR Layout', distance: '5.1 km', earning: '₹62', eta: '25 min' },
    { id: 'ORD-703', restaurant: 'KFC, Jayanagar', customer: 'Anjali M., BTM Layout', distance: '2.8 km', earning: '₹38', eta: '14 min' },
];

const mockCurrentDelivery = {
    id: 'ORD-698',
    restaurant: 'Dominos Pizza',
    restaurantAddress: 'No. 14, Church Street, Bengaluru',
    customer: 'Vikram Nair',
    customerAddress: '42, 5th Cross, Indiranagar, Bengaluru',
    customerPhone: '+91 99887 76655',
    items: '1x BBQ Chicken Pizza, 1x Garlic Bread',
    total: '₹549',
    earning: '₹55',
    status: 'Picked Up',
};

const weeklyEarnings = [
    { day: 'Mon', amount: 520 },
    { day: 'Tue', amount: 840 },
    { day: 'Wed', amount: 610 },
    { day: 'Thu', amount: 920 },
    { day: 'Fri', amount: 1100 },
    { day: 'Sat', amount: 1350 },
    { day: 'Sun', amount: 780 },
];
const maxEarning = Math.max(...weeklyEarnings.map(e => e.amount));

const navItems = [
    { icon: Package, label: 'Available' },
    { icon: Navigation, label: 'Current' },
    { icon: Wallet, label: 'Earnings' },
    { icon: User, label: 'Profile' },
];

const DeliveryDashboard = () => {
    const [activeNav, setActiveNav] = useState('Available');
    const [deliveryStatus, setDeliveryStatus] = useState('Picked Up');
    const [isOnline, setIsOnline] = useState(true);

    const statusFlow = {
        'Picked Up': 'Delivered',
    };

    const handleAdvance = () => {
        if (deliveryStatus === 'Picked Up') {
            setDeliveryStatus('Delivered');
            toast.success('Order marked as Delivered! 🎉');
        }
    };

    const handleAccept = (orderId) => {
        toast.success(`Order ${orderId} accepted! Head to restaurant.`);
        setActiveNav('Current');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Top Header */}
            <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                        <Bike className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">Arjun Kumar</p>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                            <p className="text-xs text-slate-500">{isOnline ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Bell className="w-5 h-5 text-slate-500" />
                    </button>
                    <button
                        onClick={() => { setIsOnline(!isOnline); toast.success(isOnline ? 'You are now Offline' : 'You are now Online!'); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isOnline ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100' : 'gradient-bg text-white hover:shadow-primary/30 hover:shadow-lg'}`}
                    >
                        {isOnline ? 'Go Offline' : 'Go Online'}
                    </button>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 grid grid-cols-3 gap-2 text-center">
                {[
                    { label: "Today's Earnings", value: '₹840' },
                    { label: 'Deliveries', value: '12' },
                    { label: 'Rating', value: '4.8 ⭐' },
                ].map((s, i) => (
                    <div key={i}>
                        <p className="text-base font-extrabold text-slate-800 dark:text-white">{s.value}</p>
                        <p className="text-xs text-slate-400">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="max-w-xl mx-auto p-4">
                <AnimatePresence mode="wait">
                    <motion.div key={activeNav} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                        {/* AVAILABLE ORDERS */}
                        {activeNav === 'Available' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <h2 className="font-extrabold text-slate-800 dark:text-white text-lg">Available Orders</h2>
                                    <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">{mockAvailableOrders.length} nearby</span>
                                </div>
                                {isOnline ? mockAvailableOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">{order.id}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{order.distance} away • {order.eta}</p>
                                            </div>
                                            <span className="text-lg font-extrabold text-green-600">{order.earning}</span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-3.5 h-3.5 text-orange-500" />
                                                </div>
                                                <span className="truncate">{order.restaurant}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                                </div>
                                                <span className="truncate">{order.customer}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAccept(order.id)}
                                            className="w-full gradient-bg text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all"
                                        >
                                            Accept Order
                                        </button>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-20">
                                        <Bike className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                                        <h3 className="font-bold text-slate-400">You're Offline</h3>
                                        <p className="text-sm text-slate-300 dark:text-slate-600 mt-1">Go online to receive orders</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CURRENT DELIVERY */}
                        {activeNav === 'Current' && (
                            <div className="space-y-4 py-2">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    {/* Status Bar */}
                                    <div className="gradient-bg p-4 text-white">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold opacity-80">{mockCurrentDelivery.id}</p>
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{deliveryStatus}</span>
                                        </div>
                                        <p className="text-2xl font-extrabold mt-1">{mockCurrentDelivery.earning} earned</p>
                                    </div>

                                    {/* Progress Steps */}
                                    <div className="flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                                        {['Accepted', 'Picked Up', 'Delivered'].map((step, i) => {
                                            const stepIndex = ['Accepted', 'Picked Up', 'Delivered'].indexOf(deliveryStatus);
                                            const isCompleted = i <= stepIndex;
                                            return (
                                                <div key={step} className="flex items-center flex-1 last:flex-none">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${isCompleted ? 'gradient-bg text-white border-primary' : 'border-slate-200 dark:border-slate-600 text-slate-400'}`}>
                                                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                                    </div>
                                                    {i < 2 && <div className={`h-1 flex-1 mx-1 rounded transition-all ${i < stepIndex ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-700'}`}></div>}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Addresses */}
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                                                <Package className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pickup from</p>
                                                <p className="font-bold text-slate-800 dark:text-white text-sm">{mockCurrentDelivery.restaurant}</p>
                                                <p className="text-xs text-slate-500">{mockCurrentDelivery.restaurantAddress}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Deliver to</p>
                                                <p className="font-bold text-slate-800 dark:text-white text-sm">{mockCurrentDelivery.customer}</p>
                                                <p className="text-xs text-slate-500">{mockCurrentDelivery.customerAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 p-5 border-t border-slate-100 dark:border-slate-700">
                                        <a href={`tel:${mockCurrentDelivery.customerPhone}`} className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                            <Phone className="w-4 h-4" /> Call
                                        </a>
                                        {deliveryStatus !== 'Delivered' && (
                                            <button
                                                onClick={handleAdvance}
                                                className="flex-1 gradient-bg text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* EARNINGS */}
                        {activeNav === 'Earnings' && (
                            <div className="space-y-4 py-2">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                                    <p className="text-sm text-slate-500 mb-1">This Week's Earnings</p>
                                    <p className="text-4xl font-extrabold text-slate-800 dark:text-white">₹6,120</p>
                                    <p className="text-sm text-green-600 font-semibold flex items-center gap-1 mt-1">
                                        <ArrowUp className="w-3 h-3" /> 18% from last week
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                                    <h3 className="font-bold text-slate-800 dark:text-white mb-4">Weekly Breakdown</h3>
                                    <div className="flex items-end gap-2 h-32">
                                        {weeklyEarnings.map((day) => (
                                            <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                                                <div className="w-full rounded-t-lg gradient-bg opacity-80 transition-all hover:opacity-100" style={{ height: `${(day.amount / maxEarning) * 100}%` }}></div>
                                                <span className="text-xs text-slate-400 font-medium">{day.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {[
                                    { label: 'Total Deliveries', value: '74' },
                                    { label: 'Total Distance', value: '218 km' },
                                    { label: 'Avg. per Delivery', value: '₹82' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex items-center justify-between">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
                                        <p className="font-extrabold text-slate-800 dark:text-white">{s.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PROFILE */}
                        {activeNav === 'Profile' && (
                            <div className="space-y-4 py-2">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 text-center">
                                    <div className="w-20 h-20 gradient-bg rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg shadow-primary/30">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Arjun Kumar</h2>
                                    <p className="text-sm text-slate-500">arjun.k@feasto.com</p>
                                    <div className="flex items-center justify-center gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200'}`} />
                                        ))}
                                        <span className="text-sm text-slate-500 ml-1">4.8 (220 reviews)</span>
                                    </div>
                                </div>
                                {['Vehicle: Honda Activa (KA-01 AB-1234)', 'Member since: Jan 2025', 'Zone: Bengaluru South'].map((info, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4 flex items-center justify-between">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{info}</p>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </div>
                                ))}
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-2 grid grid-cols-4 z-30">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => setActiveNav(item.label)}
                        className={`flex flex-col items-center gap-1 py-2 transition-colors ${activeNav === item.label ? 'text-primary' : 'text-slate-400'}`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="h-20"></div>
        </div>
    );
};

export default DeliveryDashboard;
