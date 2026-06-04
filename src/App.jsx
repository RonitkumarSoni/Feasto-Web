import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy-loaded Pages
const Splash = React.lazy(() => import('./pages/Splash'));
const Home = React.lazy(() => import('./pages/Home'));
const Auth = React.lazy(() => import('./pages/Auth'));
const RestaurantDetails = React.lazy(() => import('./pages/RestaurantDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const OrderSuccess = React.lazy(() => import('./pages/OrderSuccess'));
const Profile = React.lazy(() => import('./pages/Profile'));
const OrderTracking = React.lazy(() => import('./pages/OrderTracking'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const RestaurantDashboard = React.lazy(() => import('./pages/RestaurantDashboard'));
const DeliveryDashboard = React.lazy(() => import('./pages/DeliveryDashboard'));

const HIDE_NAV_PATHS = ['/', '/login', '/signup', '/forgot-password', '/success', '/admin', '/restaurant-dashboard', '/delivery'];

const AppLayout = () => {
  const location = useLocation();
  const hideNavFooter = HIDE_NAV_PATHS.some(p => location.pathname === p);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Auth type="login" />} />
            <Route path="/signup" element={<Auth type="signup" />} />
            <Route path="/forgot-password" element={<Auth type="forgot" />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/track/:orderId?" element={<OrderTracking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
            <Route path="/delivery" element={<DeliveryDashboard />} />
          </Routes>
        </Suspense>
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontSize: '14px' },
          success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
        }}
      />
    </Router>
  );
}

export default App;
