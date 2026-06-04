import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/cartSlice';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const MenuItem = ({ item }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);

    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = () => {
        dispatch(addToCart(item));
        if (quantity === 0) {
            toast.success(`Added ${item.name} to cart!`);
        }
    };

    const handleRemove = () => {
        dispatch(removeFromCart(item.id));
    };

    return (
        <div className="flex justify-between items-start gap-4 p-4 mb-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${item.veg ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                        {item.name}
                    </h3>
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    ₹{item.price}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.description}
                </p>
            </div>

            <div className="relative flex flex-col items-center">
                <div className="w-28 h-28 rounded-xl overflow-hidden shadow-sm relative mb-4">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">No image</div>
                    )}
                </div>

                <div className="absolute -bottom-3 w-28 flex justify-center">
                    {quantity === 0 ? (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAdd}
                            className="px-6 py-2 bg-white text-primary font-extrabold text-sm rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-colors uppercase tracking-wide"
                        >
                            ADD
                        </motion.button>
                    ) : (
                        <div className="flex items-center justify-between w-24 bg-white text-primary font-bold rounded-lg shadow-md border border-slate-200 overflow-hidden">
                            <motion.button whileTap={{ scale: 0.9 }} onClick={handleRemove} className="p-2 hover:bg-slate-50 text-slate-600">
                                <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="text-sm">{quantity}</span>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={handleAdd} className="p-2 hover:bg-slate-50 text-slate-600">
                                <Plus className="w-4 h-4" />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
