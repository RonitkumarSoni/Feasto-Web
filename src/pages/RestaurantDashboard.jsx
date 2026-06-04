import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, UtensilsCrossed, ClipboardList, TrendingUp,
    Settings, Bell, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
    ChevronDown, Star, Clock, DollarSign, ShoppingBag, ArrowUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockMenuItems = [
    { id: 1, name: 'Classic Whopper', category: 'Burgers', price: 199, veg: false, available: true },
    { id: 2, name: 'Veggie Burger', category: 'Burgers', price: 149, veg: true, available: true },
    { id: 3, name: 'Chicken Strips', category: 'Snacks', price: 129, veg: false, available: false },
    { id: 4, name: 'Cheese Fries', category: 'Snacks', price: 99, veg: true, available: true },
    { id: 5, name: 'Chocolate Shake', category: 'Drinks', price: 89, veg: true, available: true },
];

const mockOrders = [
    { id: 'ORD-901', customer: 'Priya S.', items: '1x Whopper, 1x Fries', total: 298, status: 'New', time: '2m ago' },
    { id: 'ORD-900', customer: 'Rahul V.', items: '2x Veggie Burger', total: 298, status: 'Preparing', time: '8m ago' },
    { id: 'ORD-899', customer: 'Anjali M.', items: '1x Chicken Strips, 1x Shake', total: 218, status: 'Ready', time: '15m ago' },
    { id: 'ORD-898', customer: 'Ravi K.', items: '1x Classic Whopper', total: 199, status: 'Delivered', time: '30m ago' },
];

const statusColors = {
    New: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    Preparing: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    Ready: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    Delivered: 'text-green-600 bg-green-50 dark:bg-green-900/20',
};

const navItems = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: UtensilsCrossed, label: 'Menu' },
    { icon: ClipboardList, label: 'Orders' },
    { icon: TrendingUp, label: 'Analytics' },
    { icon: Settings, label: 'Settings' },
];

const RestaurantDashboard = () => {
    const [activeNav, setActiveNav] = useState('Overview');
    const [menuItems, setMenuItems] = useState(mockMenuItems);
    const [orders, setOrders] = useState(mockOrders);

    const toggleAvailability = (id) => {
        setMenuItems(prev => prev.map(item =>
            item.id === id ? { ...item, available: !item.available } : item
        ));
        const item = menuItems.find(i => i.id === id);
        toast.success(`${item.name} marked as ${item.available ? 'unavailable' : 'available'}`);
    };

    const advanceOrderStatus = (id) => {
        const flow = { New: 'Preparing', Preparing: 'Ready', Ready: 'Delivered' };
        setOrders(prev => prev.map(o =>
            o.id === id ? { ...o, status: flow[o.status] || o.status } : o
        ));
        toast.success('Order status updated!');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-screen fixed top-0 left-0 z-30">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-2xl font-extrabold gradient-text">Feasto</span>
                    <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">Restaurant Portal</p>
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
                            {item.label === 'Orders' && (
                                <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {orders.filter(o => o.status !== 'Delivered').length}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-xs font-bold text-green-700 dark:text-green-400">Restaurant Open</p>
                        </div>
                        <p className="text-xs text-green-600/70 dark:text-green-500/70 mt-1">Closes at 11:00 PM</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">
                            {activeNav === 'Overview' ? 'Dashboard Overview' : activeNav}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Burger King, MG Road Branch</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                            <Bell className="w-5 h-5 text-slate-500" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={activeNav} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                        {/* OVERVIEW */}
                        {activeNav === 'Overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: "Today's Orders", value: '48', icon: ShoppingBag, color: 'orange', change: '+12%' },
                                        { label: "Today's Revenue", value: '₹9,840', icon: DollarSign, color: 'green', change: '+8%' },
                                        { label: 'Avg. Rating', value: '4.5', icon: Star, color: 'yellow', change: '+0.2' },
                                        { label: 'Avg. Prep Time', value: '18 min', icon: Clock, color: 'blue', change: '-3m' },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${s.color}-100 dark:bg-${s.color}-900/30`}>
                                                    <s.icon className={`w-5 h-5 text-${s.color}-600`} />
                                                </div>
                                                <span className="text-xs font-bold text-green-600 flex items-center gap-1"><ArrowUp className="w-3 h-3" />{s.change}</span>
                                            </div>
                                            <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{s.value}</p>
                                            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Live Orders */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block"></span>
                                            Live Orders
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {orders.map(order => (
                                            <div key={order.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{order.id} · {order.customer}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{order.items}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm hidden sm:block">₹{order.total}</span>
                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                                                    {order.status !== 'Delivered' && (
                                                        <button onClick={() => advanceOrderStatus(order.id)} className="text-xs gradient-bg text-white px-3 py-1.5 rounded-lg font-semibold hidden sm:block hover:shadow-md transition-all">
                                                            Advance
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MENU MANAGEMENT */}
                        {activeNav === 'Menu' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 text-sm">{menuItems.length} items across {[...new Set(menuItems.map(i => i.category))].length} categories</p>
                                    <button onClick={() => toast.success('Add item form coming soon!')} className="flex items-center gap-2 gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
                                        <Plus className="w-4 h-4" /> Add Item
                                    </button>
                                </div>
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {menuItems.map(item => (
                                            <div key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${item.veg ? 'border-green-600' : 'border-red-600'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold text-sm ${item.available ? 'text-slate-800 dark:text-white' : 'text-slate-400 line-through'}`}>{item.name}</p>
                                                        <p className="text-xs text-slate-400">{item.category} • ₹{item.price}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => toggleAvailability(item.id)} className="text-slate-400 hover:text-primary transition-colors">
                                                        {item.available
                                                            ? <ToggleRight className="w-8 h-8 text-primary" />
                                                            : <ToggleLeft className="w-8 h-8 text-slate-300" />
                                                        }
                                                    </button>
                                                    <button onClick={() => toast.success('Edit form coming soon!')} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => { setMenuItems(prev => prev.filter(i => i.id !== item.id)); toast.success('Item deleted!'); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ORDERS MANAGEMENT */}
                        {activeNav === 'Orders' && (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="font-extrabold text-slate-800 dark:text-white">{order.id}</p>
                                                <p className="text-sm text-slate-500">{order.customer} · {order.time}</p>
                                            </div>
                                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{order.items}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-extrabold text-slate-800 dark:text-white">₹{order.total}</span>
                                            {order.status !== 'Delivered' && (
                                                <button onClick={() => advanceOrderStatus(order.id)} className="gradient-bg text-white px-5 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
                                                    Mark as {order.status === 'New' ? 'Preparing' : order.status === 'Preparing' ? 'Ready' : 'Delivered'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ANALYTICS placeholder */}
                        {(activeNav === 'Analytics' || activeNav === 'Settings') && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-16 text-center">
                                <TrendingUp className="w-16 h-16 text-slate-200 dark:text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-400">{activeNav} Coming Soon</h3>
                                <p className="text-slate-300 dark:text-slate-600 text-sm mt-2">This section is under construction.</p>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default RestaurantDashboard;
