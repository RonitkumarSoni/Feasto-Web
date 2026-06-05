import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, clearCart } from '../redux/cartSlice';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import useRazorpay from 'react-razorpay';

const Cart = () => {
    const { items, totalAmount, totalQuantity } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);

    const [Razorpay] = useRazorpay();

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to place an order");
            navigate('/login');
            return;
        }
        
        try {
            setLoading(true);
            const deliveryAddress = user?.addresses?.[0] || {
                street: "123 Main St",
                city: "Bangalore",
                state: "Karnataka",
                zipCode: "560001",
                country: "India",
                isDefault: true
            };

            // 1. Create Order
            const orderPayload = {
                restaurantId: "1", // Hardcoded for demo if items are mixed
                items: items.map(i => ({ foodId: i.id.toString(), quantity: i.quantity, price: i.price })),
                deliveryAddress: deliveryAddress,
                paymentMethod: "RAZORPAY"
            };

            const orderRes = await api.post('/orders', orderPayload);
            const orderId = orderRes.data.data.id;

            // 2. Initiate Payment
            const initRes = await api.post('/payments/initiate', { orderId });
            const { razorpayOrderId, amount, currency, key } = initRes.data.data;

            // 3. Configure Razorpay Options
            const options = {
                key: key,
                amount: amount.toString(),
                currency: currency,
                name: "Feasto",
                description: "Order Payment",
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        setLoading(true);
                        // 4. Verify Payment
                        await api.post('/payments/verify', {
                            orderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature
                        });
                        
                        dispatch(clearCart());
                        toast.success("Payment successful! Order placed.");
                        navigate(`/profile/track/${orderId}`);
                    } catch (err) {
                        toast.error("Payment verification failed");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user?.name || "Customer",
                    email: user?.email || "",
                },
                theme: {
                    color: "#f97316", // Primary color (orange-500)
                },
            };

            // 5. Open Razorpay Modal
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response){
                toast.error(response.error.description || "Payment failed");
            });
            rzp.open();

        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="w-64 h-64 mb-6 opacity-80">
                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty Cart" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 max-w-sm">
                    You can go to home page to view more restaurants and add items to your cart.
                </p>
                <Link to="/home">
                    <button className="gradient-bg text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1">
                        SEE RESTAURANTS NEAR YOU
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Cart Items List */}
                <div className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6 text-primary" /> Order Summary
                        </h2>
                        <button
                            onClick={() => dispatch(clearCart())}
                            className="text-sm text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md flex items-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" /> Clear Cart
                        </button>
                    </div>

                    <div className="space-y-6">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${item.veg ? 'border-green-600' : 'border-red-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                        </div>
                                        <h3 className="font-semibold text-slate-800 dark:text-white text-base leading-tight">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <p className="text-slate-500 text-sm mt-1">₹{item.price}</p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center justify-between w-24 bg-white dark:bg-slate-700 text-primary font-bold rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden h-9">
                                        <button onClick={() => dispatch(removeFromCart(item.id))} className="h-full px-2.5 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm dark:text-white">{item.quantity}</span>
                                        <button onClick={() => dispatch(addToCart(item))} className="h-full px-2.5 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">
                                        ₹{item.totalPrice}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <textarea
                            placeholder="Any suggestions? We will pass it on..."
                            className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-300 transition-shadow"
                            rows="2"
                        />
                    </div>
                </div>

                {/* Bill Details */}
                <div className="w-full lg:w-96">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Bill Details</h3>

                        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex justify-between">
                                <span>Item Total</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee | 2.5 kms</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">₹35</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Free Delivery with Feasto One</span>
                                <span>-₹35</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform fee</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">₹5</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST and Restaurant Charges</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">₹{(totalAmount * 0.05).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 my-4 pt-4 flex justify-between items-center text-lg font-bold text-slate-800 dark:text-white">
                            <span>TO PAY</span>
                            <span>₹{(totalAmount + 5 + totalAmount * 0.05).toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full gradient-bg mt-6 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>Checkout <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>

                        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-start gap-3">
                            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                <LeafIcon className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Our delivery partners ensure safe and hygienic delivery.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Quick helper
const LeafIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
)

export default Cart;
