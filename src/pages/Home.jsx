import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ChevronRight, SlidersHorizontal, Tag, Zap, Clock } from 'lucide-react';
import CategorySlider from '../components/CategorySlider';
import RestaurantCard from '../components/RestaurantCard';
import { RestaurantCardSkeleton } from '../components/Skeletons';

const offers = [
    { id: 1, title: '50% OFF up to ₹100', subtitle: 'Use code FEAST50 • Min order ₹199', color: 'from-orange-500 to-pink-500', icon: Tag, badge: 'LIMITED TIME' },
    { id: 2, title: 'Free Delivery', subtitle: 'On your first 3 orders', color: 'from-blue-500 to-purple-500', icon: Zap, badge: 'NEW USER' },
    { id: 3, title: '30 Min Delivery', subtitle: 'Or your next order free', color: 'from-green-500 to-teal-500', icon: Clock, badge: 'GUARANTEE' },
];

const Home = () => {
    const { categories, restaurants } = useSelector((state) => state.data);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter restaurants based on mock filter buttons
    const filteredRestaurants = restaurants.filter(res => {
        if (filter === 'All') return true;
        if (filter === 'Rating 4.0+') return res.rating >= 4.0;
        if (filter === 'Fast Delivery') return res.deliveryTime.includes('25') || res.deliveryTime.includes('30');
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">

            {/* Hero Section */}
            <div className="w-full bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80"
                        alt="Hero Food Banner"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                            Cravings satisfied,<br />
                            <span className="text-primary">right at your door.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg">
                            Explore top-rated restaurants, incredible deals, and delicious cuisines delivered fast.
                        </p>
                        <div className="flex items-center gap-4">
                            <button className="gradient-bg px-8 py-3 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-primary/40 transition-all flex items-center gap-2">
                                Order Now <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Category Slider */}
            <CategorySlider categories={categories} />

            {/* Offers Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Offers for you</h2>
                    <button className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
                        See all <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {offers.map((offer, i) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`bg-gradient-to-br ${offer.color} rounded-2xl p-5 text-white cursor-pointer relative overflow-hidden shadow-lg`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-6 -translate-x-6"></div>
                            <span className="relative z-10 text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-full tracking-wider">{offer.badge}</span>
                            <div className="relative z-10 mt-3">
                                <offer.icon className="w-7 h-7 mb-2 opacity-90" />
                                <h3 className="text-xl font-extrabold leading-tight">{offer.title}</h3>
                                <p className="text-sm opacity-80 mt-1">{offer.subtitle}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                        Top restaurants chains in your location
                    </h2>

                    {/* Filters */}
                    <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            <SlidersHorizontal className="w-4 h-4" /> Filter
                        </button>
                        <button
                            onClick={() => setFilter('All')}
                            className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium whitespace-nowrap ${filter === 'All' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('Rating 4.0+')}
                            className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium whitespace-nowrap ${filter === 'Rating 4.0+' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                        >
                            Rating 4.0+
                        </button>
                        <button
                            onClick={() => setFilter('Fast Delivery')}
                            className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium whitespace-nowrap ${filter === 'Fast Delivery' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                        >
                            Fast Delivery
                        </button>
                    </div>
                </div>

                {/* Restaurants Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, idx) => (
                            <RestaurantCardSkeleton key={idx} />
                        ))
                    ) : (
                        filteredRestaurants.map((restaurant, index) => (
                            <motion.div
                                key={restaurant.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <RestaurantCard restaurant={restaurant} />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default Home;
