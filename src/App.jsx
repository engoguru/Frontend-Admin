import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Wrap your routes with AuthProvider */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
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
              {/* Catch-all route for any other invalid paths within the protected layout */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
