import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import About from './pages/About';
import ShippingPolicy from './pages/ShippingPolicy';
import Returns from './pages/Returns';
import Contact from './pages/Contact';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminStockNotifications from './pages/admin/AdminStockNotifications';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children;
};

// Layout wrapper for customer pages
const CustomerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes - No Navbar/Footer */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiries /></AdminRoute>} />
            <Route path="/admin/stock-notifications" element={<AdminRoute><AdminStockNotifications /></AdminRoute>} />

            {/* Customer Routes - With Navbar/Footer */}
            <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
            <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
            <Route path="/product/:slug" element={<CustomerLayout><ProductDetails /></CustomerLayout>} />
            <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
            <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
            <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
            <Route path="/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />
            <Route path="/my-orders" element={<CustomerLayout><MyOrders /></CustomerLayout>} />
            <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
            <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
            <Route path="/shipping-policy" element={<CustomerLayout><ShippingPolicy /></CustomerLayout>} />
            <Route path="/returns" element={<CustomerLayout><Returns /></CustomerLayout>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
