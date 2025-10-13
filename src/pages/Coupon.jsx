import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Coupon() {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minCartValue: '',
    expiryDate: '',
    allowedUsers: [],
  });

  const [message, setMessage] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
const[allCoupon,setAllCoupon]=useState([])
const [openCreate,setOpenCreate]=useState(false)
  // Fetch users with search + pagination
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:5000/api/users/account/GetAll`, {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
        },
      });

      setUserOptions(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);


useEffect(() => {
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/coupon/getCoupon",{withCredentials:true});
      console.log(res.data, " Coupon response");
      setAllCoupon(res.data)
    } catch (err) {
      console.error("Error fetching coupons:", err.message);
    }
  };

  fetchCoupons();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSelect = (userId) => {
    setFormData((prev) => {
      if (!prev.allowedUsers.includes(userId)) {
        return { ...prev, allowedUsers: [...prev.allowedUsers, userId] };
      }
      return prev;
    });
  };

  const handleRemoveUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      allowedUsers: prev.allowedUsers.filter((id) => id !== userId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    if (expiry < today.setHours(0, 0, 0, 0)) {
      setMessage(' Expiry date cannot be in the past.');
      return;
    }

    const payload = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minCartValue: parseFloat(formData.minCartValue) || 0,
    };

    try {
      await axios.post('http://localhost:5000/api/order/coupon/createCoupon', payload, {
        withCredentials: true,
      });
      setMessage(' Coupon created successfully!');
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minCartValue: '',
        expiryDate: '',
        allowedUsers: [],
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || '❌ Failed to create coupon');
    }
  };

  return (

    <>
  
{/* viewAll */}
<div className="overflow-x-auto mt-6">
  <button onClick={() => setOpenCreate(true)}>Create</button>

      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Code</th>
            <th className="px-4 py-2 border">Discount Type</th>
            <th className="px-4 py-2 border">Discount Value</th>
            <th className="px-4 py-2 border">Min Cart Value</th>
            <th className="px-4 py-2 border">Expiry Date</th>
            <th className="px-4 py-2 border">Allowed Users</th>
          </tr>
        </thead>
       <tbody>
  {allCoupon?.data?.map((coupon) => (
    <tr key={coupon._id || coupon.code}>
      <td className="px-4 py-2 border">{coupon.code || '-'}</td>
      <td className="px-4 py-2 border capitalize">{coupon.discountType || '-'}</td>
      <td className="px-4 py-2 border">{coupon.discountValue || '-'}</td>
      <td className="px-4 py-2 border">{coupon.minCartValue || '-'}</td>
      <td className="px-4 py-2 border">
        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : '-'}
      </td>
      <td className="px-4 py-2 border">
        {coupon.allowedUsers && coupon.allowedUsers.length > 0
          ? coupon.allowedUsers.join(', ')
          : '-'}
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>


{/* create */}
{openCreate ===true&&
 <div
    className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setOpenCreate(false)} // close on background click
  >
    <div
      className="max-w-2xl bg-white p-6 rounded-lg shadow-md"
      onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside content
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-md">Create Coupon</h2>

      {message && (
        <div className={`mb-4 p-3 text-sm rounded ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code and Discount Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 text-sm">Coupon Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder='save-10'
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm">Discount Type</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              
              required
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
        </div>

        {/* Value and Cart Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 text-sm">Discount Value</label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
              placeholder="10"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm">Min Cart Value</label>
            <input
              type="number"
              name="minCartValue"
              value={formData.minCartValue}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* Expiry */}
        <div>
          <label className="block font-medium mb-1 text-sm">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* User search + select */}
        <div>
          <label className="block font-medium mb-1 text-sm">Search Users</label>
          <input
            type="text"
            placeholder="Search by name or email,contact"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 mb-2 border rounded"
          />

          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {isLoading ? (
              <p className='text-sm'>Loading...</p>
            ) : (
              userOptions.map((user) => (
                <div key={user._id} className="flex items-center justify-between mb-1">
                  <span className='px-2 text-[12px] font-semibold'>{user.name || user.email}-{user.contactNumber}</span>
                  <button
                    type="button"
                    onClick={() => handleUserSelect(user._id)}
                    disabled={formData.allowedUsers.includes(user._id)}
                    className="text-blue-600 text-sm disabled:text-gray-400 font-semibold border"
                  >
                    {formData.allowedUsers.includes(user._id) ? 'Selected' : 'Add'}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-2 text-sm px-5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="text-blue-600 disabled:text-gray-400"
            >
              Prev
            </button>
            <span>
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="text-blue-600 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>

        {/* Selected Users */}
        {formData.allowedUsers.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-sm mb-1">Selected Users:</p>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              {formData.allowedUsers.map((id) => (
                <li key={id} className="flex justify-between items-center">
                  <span className='px-2 font-semibold text-[12px] border rounded'>{id}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(id)}
                    className="text-red-500 text-xs border-2 rounded "
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Coupon
        </button>
      </form>
      </div>
    </div>
}

   
    </>
  );
}

export default Coupon;
