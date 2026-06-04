import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, ChevronDown, LayoutDashboard, Store, Bike, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const dashboardLinks = [
    { label: 'Admin Dashboard', to: '/admin', icon: LayoutDashboard, color: 'text-purple-500' },
    { label: 'Restaurant Portal', to: '/restaurant-dashboard', icon: Store, color: 'text-orange-500' },
    { label: 'Delivery Partner', to: '/delivery', icon: Bike, color: 'text-blue-500' },
];

const Navbar = () => {
    const cartQuantity = useSelector((state) => state.cart.totalQuantity);
    const [showDashboard, setShowDashboard] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDashboard(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
                    <img
                        src="/logo.png"
                        alt="Feasto Logo"
                        className="h-16 sm:h-20 w-auto object-contain scale-125 origin-left"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </Link>

                {/* Search Bar - Desktop */}
                <div className="hidden md:flex flex-1 max-w-md">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for restaurants, items or more"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-1 sm:gap-3 text-gray-700 dark:text-gray-300">

                    {/* Mobile search toggle */}
                    <button
                        className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                    </button>

                    {/* Dashboard Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDashboard(!showDashboard)}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                        >
                            <LayoutDashboard className="h-4 w-4 text-primary" />
                            <span className="hidden lg:block">Dashboards</span>
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showDashboard ? 'rotate-180' : ''}`} />
                        </button>

                        {showDashboard && (
                            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                                <div className="p-2 space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-2">Switch to</p>
                                    {dashboardLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setShowDashboard(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <link.icon className={`w-4 h-4 ${link.color}`} />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <Link to="/profile" className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors group">
                        <User className="h-5 w-5" />
                        <span className="hidden lg:block text-sm font-medium">Account</span>
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors relative">
                        <ShoppingBag className="h-5 w-5" />
                        {cartQuantity > 0 && (
                            <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                {cartQuantity > 9 ? '9+' : cartQuantity}
                            </span>
                        )}
                        <span className="hidden lg:block text-sm font-medium">Cart</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {showSearch && (
                <div className="md:hidden px-4 pb-3">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search restaurants, dishes..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
