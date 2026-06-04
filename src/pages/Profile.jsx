import { useState, useEffect } from 'react';
import { User, MapPin, Receipt, Heart, Settings, LogOut, Sun, Moon, Plus, Trash2, Star, Clock, ChevronRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const mockOrders = [
    { id: 'ORD-10041', restaurant: 'Burger King', date: '12 Feb 2026, 08:30 PM', items: '1x Whopper, 1x Fries, 1x Coke', total: 420, status: 'Delivered', statusColor: 'green' },
    { id: 'ORD-10042', restaurant: 'Pizza Hut', date: '10 Feb 2026, 07:15 PM', items: '1x Margherita, 1x Pepsi', total: 350, status: 'Delivered', statusColor: 'green' },
    { id: 'ORD-10043', restaurant: 'KFC', date: '08 Feb 2026, 01:00 PM', items: '2x Chicken Bucket', total: 680, status: 'Cancelled', statusColor: 'red' },
    { id: 'ORD-10044', restaurant: 'Dominos', date: '05 Feb 2026, 09:00 PM', items: '1x BBQ Chicken Pizza', total: 299, status: 'Delivered', statusColor: 'green' },
];

const mockAddresses = [
    { id: 1, type: 'Home', address: '42, MG Road, Bengaluru, Karnataka - 560001', default: true },
    { id: 2, type: 'Work', address: 'Tower B, DLF Cyber City, Gurugram, Haryana - 122002', default: false },
];

const tabs = ['Orders', 'Addresses', 'Favorites'];

const Profile = () => {
    const [activeTab, setActiveTab] = useState('Orders');
    const [darkMode, setDarkMode] = useState(false);
    const [addresses, setAddresses] = useState(mockAddresses);

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setDarkMode(true);
        }
    }, []);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const deleteAddress = (id) => {
        setAddresses(addresses.filter(a => a.id !== id));
        toast.success('Address removed!');
    };

    const sideMenuItems = [
        { icon: Receipt, label: 'Orders', tab: 'Orders', count: mockOrders.length },
        { icon: Heart, label: 'Favorites', tab: 'Favorites', count: 4 },
        { icon: MapPin, label: 'Addresses', tab: 'Addresses', count: addresses.length },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <div className="w-full md:w-72 space-y-4 flex-shrink-0">
                    {/* User Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-300/40">
                            <User className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">John Doe</h2>
                        <p className="text-sm text-slate-500 mb-1">john.doe@example.com</p>
                        <p className="text-xs text-slate-400 mb-5">+91 98765 43210</p>
                        <button className="text-sm font-semibold text-primary border border-primary/30 bg-primary/5 w-full py-2 rounded-lg hover:bg-primary/10 transition-colors">
                            Edit Profile
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        {sideMenuItems.map((item) => (
                            <button
                                key={item.tab}
                                onClick={() => setActiveTab(item.tab)}
                                className={`w-full flex items-center justify-between p-4 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0 ${activeTab === item.tab ? 'bg-primary/5 text-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-5 h-5 ${activeTab === item.tab ? 'text-primary' : 'text-slate-400'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${activeTab === item.tab ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                                    {item.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Theme Toggle */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-2">
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-300 font-medium"
                        >
                            <div className="flex items-center gap-3">
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-500" />}
                                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-primary' : 'bg-slate-300'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <Link to="/login">
                            <button className="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors font-medium">
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* ORDER HISTORY TAB */}
                            {activeTab === 'Orders' && (
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                        <Receipt className="w-6 h-6 text-primary" /> Order History
                                    </h3>
                                    <div className="space-y-4">
                                        {mockOrders.map((order) => (
                                            <div key={order.id} className="border border-slate-100 dark:border-slate-700 rounded-2xl p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 dark:text-white">{order.restaurant}</h4>
                                                        <p className="text-xs text-slate-400 mt-0.5">{order.id} • {order.date}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="font-bold text-slate-800 dark:text-white">₹{order.total}</span>
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.statusColor === 'green' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-4 line-clamp-1">{order.items}</p>
                                                <div className="flex gap-3">
                                                    <Link to="/profile/track" className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1">
                                                        <Package className="w-4 h-4" /> Track
                                                    </Link>
                                                    <button className="px-4 py-2 gradient-bg text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-primary/30 transition-all">
                                                        Reorder
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SAVED ADDRESSES TAB */}
                            {activeTab === 'Addresses' && (
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <MapPin className="w-6 h-6 text-primary" /> Saved Addresses
                                        </h3>
                                        <button
                                            onClick={() => toast.success('Add address form coming soon!')}
                                            className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                                        >
                                            <Plus className="w-4 h-4" /> Add New
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {addresses.map((addr) => (
                                            <div key={addr.id} className="flex items-start gap-4 p-4 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-primary/30 transition-colors">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${addr.default ? 'bg-primary/10' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                                    <MapPin className={`w-5 h-5 ${addr.default ? 'text-primary' : 'text-slate-400'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-slate-800 dark:text-white">{addr.type}</span>
                                                        {addr.default && <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Default</span>}
                                                    </div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{addr.address}</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteAddress(addr.id)}
                                                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FAVORITES TAB */}
                            {activeTab === 'Favorites' && (
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                        <Heart className="w-6 h-6 text-primary" /> Favorites
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {['Burger King', 'Pizza Hut', 'KFC', 'Dominos'].map((name, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-md transition-shadow cursor-pointer">
                                                <div className="w-14 h-14 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-2xl">🍔</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-800 dark:text-white truncate">{name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        <span>4.{i + 1}</span>
                                                        <Clock className="w-3 h-3" />
                                                        <span>{20 + i * 5} mins</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-300" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Profile;
