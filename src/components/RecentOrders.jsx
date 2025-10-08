import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-cyan-100 text-cyan-800',
    Shipped: 'bg-teal-100 text-teal-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-rose-100 text-rose-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const RecentOrders = ({ orders, isLoading }) => {
  const renderSkeletons = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <tr key={index} className="border-b border-gray-200">
        <td className="py-4 px-6"><div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div></td>
        <td className="py-4 px-6"><div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div></td>
        <td className="py-4 px-6"><div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div></td>
        <td className="py-4 px-6"><div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div></td>
        <td className="py-4 px-6"><div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div></td>
      </tr>
    ));
  };
console.log(orders);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Recent Orders</h3>
        <Link to="/orders" className="text-sm font-semibold text-blue-500 hover:text-blue-700 flex items-center gap-1">
          View All
          <FaArrowRight size={12} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Order ID</th>
              <th scope="col" className="px-6 py-3">Customer</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? renderSkeletons() : (
              orders.map(order => (
                <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline">
                      #{order._id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{order.deliveryAddress?.name}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">₹{order.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.orderStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!isLoading && orders.length === 0 && (
          <p className="text-center text-gray-500 py-8">No recent orders found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;