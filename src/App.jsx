import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Home from './layouts/Home';
import Customers from './pages/Customers';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import CustomerDetail from './pages/CustomerDetail';
import ProductDetail from './pages/ProductDetail'; // Import the new component
import OrderDetail from './pages/OrderDetail';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import Banners from './pages/Banners';
import Coupon from './pages/Coupon';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Wrap your routes with AuthProvider */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />}>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="products/:id" element={<ProductDetail />} /> {/* Add the new route */}
              <Route path="products" element={<Products />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="orders" element={<Orders />} />
              <Route path="banners" element={<Banners />} />
               <Route path="coupon" element={<Coupon />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
