import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaShoppingCart, FaDollarSign, FaBoxOpen } from 'react-icons/fa';

const StatCard = ({ icon, label, value, color, isLoading }) => (
  <div className={`bg-white px-6 py-16 rounded-lg shadow-md flex items-center space-x-4 ${color}`}>
    <div className="p-3 rounded-full bg-opacity-20">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isLoading ? (
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ customers: 0, orders: 0, revenue: 0, products: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [customersRes, ordersRes, productsRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/account/GetAll?limit=1'),
          fetch('http://localhost:5000/api/order/orderRoutes/getAll?limit=1'),
          fetch('http://localhost:5002/productList/getAll?itemsPerPage=1') // Assuming product service is on port 5002
        ]);

        const customersData = await customersRes.json();
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        const totalCustomers = customersData.totalUsers || 0;
        const totalOrders = ordersData.totalCount || 0;
        const totalRevenue = ordersData.totalRevenue || 0;
        const totalProducts = productsData.totalCount || 0; // Assuming backend returns totalCount

        setStats({
          customers: totalCustomers,
          orders: totalOrders,
          revenue: totalRevenue,
          products: totalProducts,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Overall Statistics</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers size={24} className="text-blue-500" />}
          label="Total Customers"
          value={stats.customers}
          color="bg-blue-100"
          isLoading={isLoading}
        />
        <StatCard
          icon={<FaShoppingCart size={24} className="text-orange-500" />}
          label="Total Orders"
          value={stats.orders}
          color="bg-orange-100"
          isLoading={isLoading}
        />
        <StatCard
          icon={<FaDollarSign size={24} className="text-green-500" />}
          label="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          color="bg-green-100"
          isLoading={isLoading}
        />
        <StatCard
          icon={<FaBoxOpen size={24} className="text-purple-500" />}
          label="Total Products"
          value={stats.products}
          color="bg-purple-100"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
