import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, MapPin, X, LogOut, HelpCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
    const cartQuantity = useSelector((state) => state.cart.totalQuantity);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [showSearch, setShowSearch] = useState(false);

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

                    {/* Help */}
                    <Link to="/home" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                        <HelpCircle className="h-4 w-4" />
                        <span className="hidden lg:block">Help</span>
                    </Link>

                    {/* Profile & Auth */}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Link to="/profile" className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors group">
                                <User className="h-5 w-5" />
                                <span className="hidden lg:block text-sm font-medium">{user?.name || 'Account'}</span>
                            </Link>
                            <button onClick={() => dispatch(logout())} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors">
                            <span className="text-sm font-medium">Sign In</span>
                        </Link>
                    )}

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
