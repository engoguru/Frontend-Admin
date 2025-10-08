import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ordered'); // Default tab

  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      try {
        // Assuming an endpoint exists to fetch a single user by ID
        const response = await fetch(`http://localhost:5000/api/users/account/GetOne/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customer details.');
        }
        const data = await response.json();
        setCustomer(data.user);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch customer:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const renderContent = () => {
    switch (activeTab) {
      case 'ordered':
        return <div className="p-4">Ordered Products Content (coming soon)</div>;
      case 'cart':
        return <div className="p-4">Cart Products Content (coming soon)</div>;
      case 'feedback':
        return <div className="p-4">Feedback Content (coming soon)</div>;
      case 'payment':
        return <div className="p-4">Payment History Content (coming soon)</div>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-lg">Loading customer details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-lg text-red-500">Error: {error}</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-lg">Customer not found.</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Customer Details</h2>

      {/* User Details Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold">{customer.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{customer.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">WhatsApp Number</p>
            <p className="font-semibold">{customer.whatsApp_Number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact Number</p>
            <p className="font-semibold">{customer.contactNumber || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-semibold">
              {Array.isArray(customer.address) && customer.address.length > 0 ?
                (() => {
                  const addr = customer.address[0]; // Get only the first (default) address
                  if (typeof addr !== 'object' || addr === null) return 'Invalid address format';
                  const addressParts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.pincode];
                  return addressParts.filter(Boolean).join(', ');
                })() : 'No address provided'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-semibold capitalize">{customer.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              customer.isVerified ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}>
              {customer.isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Tabs Container */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 p-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('ordered')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'ordered' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Ordered Product
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'cart' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Cart Product
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'feedback' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Feedback
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'payment' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Payment
            </button>
          </nav>
        </div>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default CustomerDetail;