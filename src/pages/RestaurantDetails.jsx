import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, Clock } from 'lucide-react';
import MenuItem from '../components/MenuItem';
import { MenuItemSkeleton } from '../components/Skeletons';
import { motion } from 'framer-motion';
import { fetchMenu } from '../redux/dataSlice';

const RestaurantDetails = () => {
    const { id } = useParams();
    const { restaurants, menuItems, loading } = useSelector((state) => state.data);
    const dispatch = useDispatch();
    
    React.useEffect(() => {
        dispatch(fetchMenu(id));
    }, [dispatch, id]);

    const restaurant = restaurants.find(r => String(r.id) === String(id));

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                Restaurant not found
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-24">
            {/* Restaurant Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 pb-8 pt-8 px-4 sm:px-6 lg:px-8 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb would go here */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                                {restaurant.name}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                                {restaurant.categories.join(', ')}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Near by location • {restaurant.deliveryTime}
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 shadow-sm min-w-20">
                            <div className="flex items-center gap-1 text-green-600 font-extrabold pb-2 border-b border-slate-200 dark:border-slate-600 w-full justify-center">
                                <Star className="w-4 h-4 fill-green-600 text-green-600" />
                                <span>{restaurant.rating}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-300 pt-2 text-center uppercase">
                                10k+ ratings
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-700 dark:text-slate-300 py-4 border-t border-slate-200 dark:border-slate-700 border-dashed">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-slate-500" />
                            <span>{restaurant.deliveryTime}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold border border-slate-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">₹</span>
                            <span>{restaurant.priceForTwo}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Area */}
            <div className="max-w-4xl mx-auto px-4 py-8 relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                        Recommended
                    </h2>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <MenuItemSkeleton key={idx} />
                        ))
                    ) : menuItems && menuItems.length > 0 ? (
                        menuItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <MenuItem item={item} />
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-slate-500 text-center py-8">No menu items available at the moment.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default RestaurantDetails;
