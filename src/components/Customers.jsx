import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination'; // Assuming Pagination.jsx is in the same folder

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest');
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/users/account/GetAll?page=${currentPage}&limit=${itemsPerPage}&sort=${sortBy}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCustomers(data.users);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch customers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, itemsPerPage, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page
  };

  const handleViewClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const filteredCustomers = customers.filter(customer =>
    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.whatsApp_Number && customer.whatsApp_Number.includes(searchTerm)) ||
    (customer.contactNumber && customer.contactNumber.includes(searchTerm)) ||
    (customer.address && Array.isArray(customer.address) && customer.address.join(' ').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="p-8 text-center text-lg">Loading customers...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-lg text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex justify-between items-center pt-8 px-8 pb-4 flex-shrink-0 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Customers</h2>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none bg-white"
          >
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="a-z">Sort by A-Z</option>
            <option value="z-a">Sort by Z-A</option>
          </select>

          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-l-md focus:outline-none w-48"
          />
          <button className="bg-gray-200 px-3 py-2 text-sm rounded-r-md hover:bg-gray-300 text-gray-600">
            Search
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="px-8 pb-8">
          <table className="min-w-full bg-white border border-gray-300 whitespace-nowrap">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 border">Sr No</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">WhatsApp Number</th>
                <th className="py-2 px-4 border">Contact Number</th>
                <th className="py-2 px-4 border">Address</th>
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">Verified</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? filteredCustomers.map((customer, index) => (
                <tr key={customer._id} className="text-center">
                  <td className="py-2 px-4 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-2 px-4 border">{customer.name}</td>
                  <td className="py-2 px-4 border">{customer.email}</td>
                  <td className="py-2 px-4 border">{customer.whatsApp_Number}</td>
                  <td className="py-2 px-4 border">{customer.contactNumber}</td>
                  <td className="py-2 px-4 border">{Array.isArray(customer.address) ? customer.address.join(', ') : ''}</td>
                  <td className="py-2 px-4 border">{customer.role}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.isVerified ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {customer.isVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      onClick={() => handleViewClick(customer._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    {/* <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                      Delete
                    </button> */}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">No customers found.</td>
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

export default Customers;
