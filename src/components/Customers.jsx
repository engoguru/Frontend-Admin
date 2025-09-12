import React, { useState } from 'react';

const Customers = () => {
  const [customers, setCustomers] = useState([
    // Mock data
    { id: 1, name: 'John Doe', email: 'john@example.com', whatsApp_Number: '1234567890', role: 'User', isVerified: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', whatsApp_Number: '9876543210', role: 'User', isVerified: false },
    { id: 3, name: 'Sam Wilson', email: 'sam@example.com', whatsApp_Number: '5554443333', role: 'Admin', isVerified: true },
    { id: 4, name: 'Alice Johnson', email: 'alice@example.com', whatsApp_Number: '1112223333', role: 'User', isVerified: true },
    { id: 5, name: 'Bob Brown', email: 'bob@example.com', whatsApp_Number: '4445556666', role: 'User', isVerified: false },
    { id: 6, name: 'Charlie Davis', email: 'charlie@example.com', whatsApp_Number: '7778889999', role: 'User', isVerified: true },
    { id: 7, name: 'Diana Evans', email: 'diana@example.com', whatsApp_Number: '1231231234', role: 'User', isVerified: true },
    { id: 8, name: 'Frank Green', email: 'frank@example.com', whatsApp_Number: '4564564567', role: 'Admin', isVerified: false },
    { id: 9, name: 'Grace Hall', email: 'grace@example.com', whatsApp_Number: '7897897890', role: 'User', isVerified: true },
    { id: 10, name: 'Henry Irving', email: 'henry@example.com', whatsApp_Number: '9879879876', role: 'User', isVerified: false },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.whatsApp_Number && customer.whatsApp_Number.includes(searchTerm))
  );

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex justify-between items-center pt-8 px-8 pb-4 flex-shrink-0 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Customers</h2>
        <div className="flex items-center">
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
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">Verified</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className="text-center">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{customer.name}</td>
                  <td className="py-2 px-4 border">{customer.email}</td>
                  <td className="py-2 px-4 border">{customer.whatsApp_Number}</td>
                  <td className="py-2 px-4 border">{customer.role}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.isVerified ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {customer.isVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                      View
                    </button>
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
