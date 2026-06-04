import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Package, Bike, Home, ChevronRight, MapPin } from 'lucide-react';
import { startOrderTracking } from '../socket';
import { toast } from 'react-hot-toast';

const trackingSteps = [
    { key: 'confirmed', icon: CheckCircle, label: 'Order Confirmed', desc: 'Restaurant accepted your order' },
    { key: 'preparing', icon: Clock, label: 'Preparing', desc: 'Chef is cooking your food' },
    { key: 'ready', icon: Package, label: 'Ready for Pickup', desc: 'Order packed and ready' },
    { key: 'picked_up', icon: Bike, label: 'On the Way', desc: 'Delivery partner picked up' },
    { key: 'near_you', icon: MapPin, label: 'Almost There', desc: 'Partner is nearby' },
    { key: 'delivered', icon: Home, label: 'Delivered', desc: 'Enjoy your meal!' },
];

const OrderTracking = () => {
    const { orderId = 'ORD-5521' } = useParams();
    const [currentStatus, setCurrentStatus] = useState('confirmed');
    const [updates, setUpdates] = useState([]);

    const currentIdx = trackingSteps.findIndex(s => s.key === currentStatus);

    useEffect(() => {
        const cleanup = startOrderTracking(orderId, ({ status, message }) => {
            setCurrentStatus(status);
            setUpdates(prev => [{ status, message, time: new Date().toLocaleTimeString() }, ...prev]);
            toast.success(message, { icon: '📦', duration: 3000 });
        });
        return cleanup;
    }, [orderId]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <Link to="/profile" className="text-sm text-primary font-semibold flex items-center gap-1 mb-4 hover:underline">
                        ← Back to Orders
                    </Link>
                    <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Track Order</h1>
                    <p className="text-slate-500 text-sm mt-1">{orderId} · Burger King, MG Road</p>
                </div>

                {/* Live Status Banner */}
                <motion.div
                    key={currentStatus}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="gradient-bg rounded-2xl p-6 text-white shadow-xl shadow-primary/30"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            {(() => {
                                const Step = trackingSteps[currentIdx]?.icon || Clock;
                                return <Step className="w-7 h-7 text-white" />;
                            })()}
                        </div>
                        <div>
                            <p className="text-sm font-medium opacity-80">Current Status</p>
                            <p className="text-xl font-extrabold">{trackingSteps[currentIdx]?.label}</p>
                            <p className="text-sm opacity-70 mt-0.5">{trackingSteps[currentIdx]?.desc}</p>
                        </div>
                    </div>
                    {currentStatus !== 'delivered' && (
                        <div className="mt-4 flex items-center gap-2">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
                                ))}
                            </div>
                            <p className="text-sm opacity-75">Live updates every few seconds</p>
                        </div>
                    )}
                </motion.div>

                {/* Progress Steps */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <h2 className="font-bold text-slate-800 dark:text-white mb-6">Order Progress</h2>
                    <div className="space-y-0">
                        {trackingSteps.map((step, idx) => {
                            const isCompleted = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;
                            const Icon = step.icon;
                            return (
                                <div key={step.key} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? 'gradient-bg border-primary' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700'}`}
                                        >
                                            <Icon className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-slate-300 dark:text-slate-500'}`} />
                                        </motion.div>
                                        {idx < trackingSteps.length - 1 && (
                                            <div className={`w-0.5 h-10 mt-1 transition-all ${idx < currentIdx ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-700'}`}></div>
                                        )}
                                    </div>
                                    <div className="pb-8 pt-1.5">
                                        <p className={`font-bold text-sm ${isCompleted ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>{step.label}</p>
                                        <p className={`text-xs mt-0.5 ${isCompleted ? 'text-slate-500' : 'text-slate-300 dark:text-slate-600'}`}>{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Live Update Log */}
                {updates.length > 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Live Updates</h2>
                        <div className="space-y-3">
                            {updates.map((update, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{update.message}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{update.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Order Summary */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <h2 className="font-bold text-slate-800 dark:text-white mb-4">Order Summary</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">1x Whopper</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">₹199</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">1x Medium Fries</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">₹99</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">1x Coke Large</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">₹79</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Delivery fee</span>
                            <span className="font-semibold text-green-600">FREE</span>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-700 pt-2 mt-2 flex justify-between">
                            <span className="font-bold text-slate-800 dark:text-white">Total</span>
                            <span className="font-extrabold text-slate-800 dark:text-white">₹377</span>
                        </div>
                    </div>
                </div>

                {currentStatus === 'delivered' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center"
                    >
                        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                        <h3 className="text-xl font-extrabold text-green-700 dark:text-green-400">Order Delivered!</h3>
                        <p className="text-sm text-green-600/70 dark:text-green-500/70 mt-1 mb-4">Enjoy your meal 🎉</p>
                        <Link to="/home">
                            <button className="gradient-bg text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
                                Order Again
                            </button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
