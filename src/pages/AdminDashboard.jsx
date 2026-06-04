import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, Store, ClipboardList, TrendingUp,
    Bell, Search, ChevronRight, MoreVertical, ArrowUp, ArrowDown,
    ShoppingBag, DollarSign, Star, AlertCircle
} from 'lucide-react';

const stats = [
    { label: 'Total Users', value: '24,521', change: '+12.5%', up: true, icon: Users, color: 'blue' },
    { label: 'Restaurants', value: '348', change: '+3.2%', up: true, icon: Store, color: 'green' },
    { label: 'Orders Today', value: '1,842', change: '+8.1%', up: true, icon: ShoppingBag, color: 'orange' },
    { label: 'Revenue Today', value: '₹4.2L', change: '-2.3%', up: false, icon: DollarSign, color: 'purple' },
];

const recentOrders = [
    { id: 'ORD-5521', user: 'Priya Sharma', restaurant: 'Burger King', amount: '₹420', status: 'Delivered', time: '2m ago' },
    { id: 'ORD-5520', user: 'Rahul Verma', restaurant: 'Pizza Hut', amount: '₹650', status: 'In Transit', time: '5m ago' },
    { id: 'ORD-5519', user: 'Anjali Singh', restaurant: 'KFC', amount: '₹280', status: 'Preparing', time: '9m ago' },
    { id: 'ORD-5518', user: 'Vikram Nair', restaurant: 'Dominos', amount: '₹399', status: 'Cancelled', time: '14m ago' },
    { id: 'ORD-5517', user: 'Meera Iyer', restaurant: 'Subway', amount: '₹210', status: 'Delivered', time: '20m ago' },
];

const topRestaurants = [
    { name: 'Burger King', orders: 842, rating: 4.5, revenue: '₹1.2L' },
    { name: 'Pizza Hut', orders: 720, rating: 4.3, revenue: '₹98K' },
    { name: 'KFC', orders: 654, rating: 4.4, revenue: '₹87K' },
    { name: 'Dominos', orders: 590, rating: 4.2, revenue: '₹76K' },
];

const statusColors = {
    Delivered: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    'In Transit': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    Preparing: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    Cancelled: 'text-red-500 bg-red-50 dark:bg-red-900/20',
};

const iconColors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
};

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: Users, label: 'Users' },
    { icon: Store, label: 'Restaurants' },
    { icon: ClipboardList, label: 'Orders' },
    { icon: TrendingUp, label: 'Analytics' },
];

const AdminDashboard = () => {
    const [activeNav, setActiveNav] = useState('Overview');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-screen fixed top-0 left-0 z-30">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-2xl font-extrabold gradient-text">Feasto</span>
                    <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">Admin Portal</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveNav(item.label)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeNav === item.label ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">A</div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Admin</p>
                            <p className="text-xs text-slate-400">admin@feasto.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 md:ml-64 p-6 lg:p-8">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Dashboard Overview</h1>
                        <p className="text-sm text-slate-500 mt-1">Welcome back, Admin</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-48"
                            />
                        </div>
                        <button className="relative p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <Bell className="w-5 h-5 text-slate-500" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconColors[stat.color]}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-xs font-bold flex items-center gap-1 ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                                    {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Orders</h2>
                            <button className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
                                View all <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <ShoppingBag className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{order.user}</p>
                                            <p className="text-xs text-slate-400">{order.id} • {order.restaurant}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm hidden sm:block">{order.amount}</span>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                                        <span className="text-xs text-slate-400 hidden md:block">{order.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Restaurants */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Top Restaurants</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {topRestaurants.map((r, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
                                    <span className="text-lg font-extrabold text-slate-300 w-6 text-center">{i + 1}</span>
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 text-xl">🍔</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{r.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span>{r.rating}</span>
                                            <span>• {r.orders} orders</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{r.revenue}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
