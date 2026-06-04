import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Auth = ({ type }) => {
    const isLogin = type === 'login';
    const isForgot = type === 'forgot';
    const isSignup = type === 'signup';
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isForgot) {
            toast.success('Password reset link sent to your email!');
            navigate('/login');
            return;
        }
        // Dummy login/signup action
        toast.success(isLogin ? 'Successfully logged in!' : 'Account created successfully!');
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-3xl font-extrabold gradient-text">Feasto</span>
                        </Link>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {isForgot ? 'Reset Password' : isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            {isForgot ? 'Enter your email to receive a reset link' : isLogin ? 'Enter your details to access your account' : 'Sign up to start ordering delicious food'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isSignup && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input type="text" className="pl-10 w-full py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white" placeholder="John Doe" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 w-full py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white" placeholder="you@example.com" />
                            </div>
                        </div>

                        {!isForgot && (
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                    {isLogin && <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 w-full py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white" placeholder="••••••••" />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="w-full gradient-bg text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98]">
                            {isForgot ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>

                    {!isForgot && (
                        <>
                            <div className="mt-8 flex items-center my-6">
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                                <span className="px-4 text-xs font-medium text-slate-400 bg-white dark:bg-slate-800">Or continue with</span>
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-semibold shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                                    </svg>
                                    Google
                                </button>
                                <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-semibold shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-5 w-5 fill-current">
                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                                    </svg>
                                    Apple
                                </button>
                            </div>
                        </>
                    )}

                    <p className="text-center mt-8 text-sm text-slate-500">
                        {isForgot ? "Remember your password? " : isLogin ? "Don't have an account? " : "Already have an account? "}
                        <Link to={isForgot || isSignup ? "/login" : "/signup"} className="text-primary font-semibold hover:underline">
                            {isForgot || isSignup ? 'Sign in' : 'Sign up'}
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
