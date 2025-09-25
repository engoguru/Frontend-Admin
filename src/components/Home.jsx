import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
  FaThLarge ,
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaCreditCard,
  FaWallet,
  FaSignOutAlt,
} from 'react-icons/fa';
import { RxDashboard } from "react-icons/rx";
import { useAuth } from '../AuthContext';

const Home = () => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-md overflow-y-auto">
        <div className="p-6 text-2xl font-bold border-b border-gray-200">
          <span className="text-black">SPORT</span>
          <span className="text-red-700">DUNIYA</span>
        </div>

        <nav className="mt-4 flex flex-col space-y-2 px-4">
          <Link
            to="/"
            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition"
          >
            <RxDashboard className="mr-3" />
            Dashboard
          </Link>
          <Link
            to="/customers"
            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition"
          >
            <FaUsers className="mr-3" />
            Customers
          </Link>
          <Link
            to="/products"
            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition"
          >
            <FaBoxOpen className="mr-3" />
            Products
          </Link>
          <Link
            to="/orders"
            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition"
          >
            <FaShoppingCart className="mr-3" />
            Orders
          </Link>
          <Link
            to="#"
            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition"
          >
            <FaWallet className="mr-3" />
            Payments
          </Link>
          <button
            onClick={logout}
            className="flex items-center text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition w-full text-left"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
