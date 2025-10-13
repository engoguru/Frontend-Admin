import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Pagination from '../components/Pagination'; // Assuming Pagination.jsx is in the same folder

// const allMockOrders = Array.from({ length: 25 }, (_, i) => ({
//     _id: `o${i + 1}`,
//     productOrderId: `ORD-2023-${String(i + 1).padStart(3, '0')}`,
//     price: Math.floor(Math.random() * 5000) + 150,
//     quantity: Math.floor(Math.random() * 3) + 1,
//     paymentId: `pay_${Math.random().toString(36).substring(2, 11)}`,
//     paymentStatus: ['Paid', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
//     shippingStatus: ['Shipped', 'Processing', 'Delivered', 'Cancelled'][Math.floor(Math.random() * 4)],
//     createdAt: new Date(new Date() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in the last 30 days
//     deliveryAddress: `${i + 1}23, Mockingbird Lane, Apt ${i + 1}, Mumbai, Maharashtra, 400001`,
// }));
// let mockOrdersDB = [...allMockOrders].sort((a, b) => b.createdAt - a.createdAt); // Default sort by latest

const paymentStatusColors = {
    Paid: 'bg-green-200 text-green-800',
    Pending: 'bg-yellow-200 text-yellow-800',
    Failed: 'bg-red-200 text-red-800',
};

const shippingStatusColors = {
    Delivered: 'bg-green-200 text-green-800',
    Confirmed: 'bg-indigo-200 text-indigo-800',
    Shipped: 'bg-blue-200 text-blue-800',
    Processing: 'bg-yellow-200 text-yellow-800',
    Pending: 'bg-yellow-200 text-yellow-800',
    Cancelled: 'bg-red-200 text-red-800',
};

const StatusBadge = ({ text, colorClass }) => (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
        {text}
    </span>
);


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('latest');
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchOrders = useCallback(async (page, limit, sort, search) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = new URL('http://localhost:5000/api/order/orderRoutes/getAll');
            url.searchParams.append('page', page);
            url.searchParams.append('itemsPerPage', limit);
            url.searchParams.append('sort', sort);
            if (search) {
                url.searchParams.append('search', search);
            }

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrders(data.data || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.page || 1);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch orders:", err);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array as it doesn't depend on component state

    useEffect(() => {
        // Use a timeout to debounce the search API call
        const handler = setTimeout(() => fetchOrders(currentPage, itemsPerPage, sortBy, searchTerm), 500);
        return () => clearTimeout(handler);
    }, [fetchOrders, currentPage, itemsPerPage, sortBy, searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (limit) => {
        setItemsPerPage(limit);
        setCurrentPage(1); // Reset to first page
    };

    const handleViewClick = (orderId) => {
        navigate(`/orders/${orderId}`); // Adjust route as needed
    };

    return (
        <div className="relative flex flex-col h-full">
            <div className="flex justify-between items-center pt-8 px-8 pb-4 flex-shrink-0 flex-wrap gap-4">
                <h2 className="text-2xl font-semibold">Orders</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative group w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search by Order or Payment ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page on new search
                            }}
                            className="w-full sm:w-64 md:w-80 lg:w-[30rem] xl:w-[36rem] border px-3 py-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-colors group-hover:bg-gray-100 cursor-pointer">
                            <FaSearch className="text-gray-400 group-hover:text-gray-600" />
                        </div>
                    </div>

                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-3 py-2 rounded-md focus:outline-none bg-white">
                        <option value="latest">Sort by Latest</option>
                        <option value="oldest">Sort by Oldest</option>
                        <option value="price-asc">Total Price: Low to High</option>
                        <option value="price-desc">Total Price: High to Low</option>
                    </select>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="px-8 pb-8 relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
                            <p className="text-lg">Loading orders...</p>
                        </div>
                    )}
                    <table className="min-w-full bg-white border border-gray-300 whitespace-nowrap">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="py-2 px-4 border">Sr No</th>
                                <th className="py-2 px-4 border">Order ID</th>
                                <th className="py-2 px-4 border">Customer</th>
                                <th className="py-2 px-4 border">Total Price</th>
                                <th className="py-2 px-4 border">Delivery Address</th>
                                <th className="py-2 px-4 border">Payment ID</th>
                                <th className="py-2 px-4 border">Payment Method</th>
                                <th className="py-2 px-4 border">Payment Status</th>
                                <th className="py-2 px-4 border">Order  Status</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {error ? (
                                <tr>
                                    <td colSpan="11" className="text-center py-4 text-red-500">Error: {error}</td>
                                </tr>
                            ) : orders.length > 0 ? orders.map((order, index) => (
                                <tr key={order._id} className="text-center">
                                    <td className="py-2 px-4 border">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>
                                    <td className="py-2 px-4 border font-medium text-blue-600">{order._id || 'N/A'}</td>
                                    <td className="py-2 px-4 border">{order.deliveryAddress?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 border">
                                        ₹{typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : 'N/A'}
                                    </td>
                                    <td className="py-2 px-4 border text-left align-top text-sm">
                                        {order.deliveryAddress ? (
                                            <div>
                                                {order.deliveryAddress.address_line1 && <p>{order.deliveryAddress.address_line1},</p>}
                                                {order.deliveryAddress.address_line2 && <p>{order.deliveryAddress.address_line2},</p>}
                                                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                                                <p>{order.deliveryAddress.country}</p>
                                                <p className="italic text-gray-500">Type: {order.deliveryAddress.address_type}</p>
                                            </div>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="py-2 px-4 border">{order.paymentId}</td>
                                    <td className="py-2 px-4 border">{order.paymentMethod}</td>
                                    <td className="py-2 px-4 border">
                                        <StatusBadge text={order.paymentStatus} colorClass={paymentStatusColors[order.paymentStatus]} />
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <StatusBadge text={order.orderStatus} colorClass={shippingStatusColors[order.orderStatus]} />
                                    </td>
                                    <td className="py-2 px-4 border text-center">
                                        <button
                                            onClick={() => handleViewClick(order._id)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="11" className="text-center py-4 text-gray-500">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Orders;