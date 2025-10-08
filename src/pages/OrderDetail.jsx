import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaMapMarkerAlt, FaCreditCard, FaBoxOpen } from 'react-icons/fa';

// In a real app, this would be in your services/api.js file
const getOrderById = async (id) => {
    const response = await fetch(`http://localhost:5000/api/order/orderRoutes/getOne/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch order details');
    }
    return await response.json();
};

const paymentStatusColors = {
    Paid: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Failed: 'bg-red-100 text-red-800',
};

const shippingStatusColors = {
    Delivered: 'bg-green-100 text-green-800',
    Confirmed: 'bg-indigo-100 text-indigo-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Processing: 'bg-yellow-100 text-yellow-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
};


const DetailCard = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
            {icon}
            <h2 className="text-lg font-semibold ml-3 text-gray-700">{title}</h2>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
            {children}
        </div>
    </div>
);

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setIsLoading(true);
                const result = await getOrderById(id);
                if (result && result.data) {
                    setOrder(result.data);
                } else {
                    throw new Error('Order not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading order details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    if (!order) {
        return <div className="p-8 text-center">No order data available.</div>;
    }

    const { deliveryAddress, customerDetails } = order;

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="flex items-center mb-6">
                <Link to="/orders" className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
                    <FaArrowLeft />
                    Back to Orders
                </Link>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Order #{order.productOrderId}</h1>
                    <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-start gap-6">
                    <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium mb-1">Payment Status</p>
                        <span className={`px-4 py-1 text-base font-semibold rounded-full ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100'}`}>
                            {order.paymentStatus}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium mb-1">Order Status</p>
                        <span className={`px-4 py-1 text-base font-semibold rounded-full ${shippingStatusColors[order.orderStatus] || 'bg-gray-100'}`}>
                            {order.orderStatus}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <DetailCard title="Order Items" icon={<FaBoxOpen size={20} className="text-gray-500" />}>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Product</th>
                                    <th className="py-2 text-center">Quantity</th>
                                    <th className="py-2 text-right">Price</th>
                                    <th className="py-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-3 flex items-center gap-3">
                                            <img src={item.productDetails?.productImages?.[0]?.url || 'https://via.placeholder.com/150'} alt={item.productDetails?.productName} className="w-12 h-12 object-cover rounded" />
                                            <div>
                                                <p className="font-semibold">{item.productDetails?.productName || 'Product not found'}</p>
                                                <p className="text-xs text-gray-500">Size: {item.size}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center">{item.quantity}</td>
                                        <td className="py-3 text-right">₹{item.price.toFixed(2)}</td>
                                        <td className="py-3 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pt-4 text-right space-y-2">
                            <p>Subtotal: <span className="font-semibold">₹{(order.itemsPrice || 0).toFixed(2)}</span></p>
                            <p>Shipping: <span className="font-semibold">₹{(order.shippingPrice || 0).toFixed(2)}</span></p>
                            <p className="text-lg font-bold">Total: <span className="text-blue-600">₹{(order.totalPrice || 0).toFixed(2)}</span></p>
                        </div>
                    </DetailCard>

                    <DetailCard title="Payment Information" icon={<FaCreditCard size={20} className="text-gray-500" />}>
                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                        <p><strong>Payment ID:</strong> {order.paymentId}</p>
                        <p><strong>Status:</strong> {order.paymentStatus}</p>
                    </DetailCard>
                </div>

                <div className="space-y-8">
                    <DetailCard title="Customer" icon={<FaUser size={20} className="text-gray-500" />}>
                        <p className="font-semibold">{customerDetails?.name || 'N/A'}</p>
                        <p>{customerDetails?.email || 'No email on account'}</p>
                        <p>{customerDetails?.contactNumber || 'No contact on account'}</p>
                    </DetailCard>

                    <DetailCard title="Shipping Address" icon={<FaMapMarkerAlt size={20} className="text-gray-500" />}>
                        <p className="font-semibold">{deliveryAddress?.name}</p>
                        <p>{deliveryAddress?.phone}</p>
                        {/* <p>{deliveryAddress?.shippingInfo?.email}</p> */}
                        <div className="border-t my-2"></div>
                        <p>{deliveryAddress?.address_line1}</p>
                        {deliveryAddress?.address_line2 && <p>{deliveryAddress.address_line2}</p>}
                        <p>{deliveryAddress?.city}, {deliveryAddress?.state} - {deliveryAddress?.pincode}</p>
                        <p>{deliveryAddress?.country}</p>
                        <p className="italic mt-2">Type: {deliveryAddress?.address_type}</p>
                    </DetailCard>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
