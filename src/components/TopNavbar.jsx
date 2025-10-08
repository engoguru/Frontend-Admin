import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaCaretDown,
  FaUserCircle,
  FaUserEdit,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
const TopNavbar = ({ toggleSidebar, showLogo }) => {
  const [admin, setAdmin] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, token } = useAuth();
  const location = useLocation(); // Listen to location changes

  useEffect(() => {
    // Fetch admin details from local storage
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }

    // Click outside handler
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [location.pathname]); // Re-run only when the path changes

  const handleLogout = () => {
    logout();
  };
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center flex-shrink-0 z-20 border-b border-gray-200">
      {/* Left Section: Sidebar Toggle */}
      <div className="flex items-center w-1/4">
        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
          <FaBars className="h-6 w-6" />
        </button>
      </div>

      {/* Middle Section: Logo (conditionally rendered) */}
      {showLogo && (
        <div className="flex-1 flex justify-center">
          <NavLink to="/" className="text-xl font-bold">
            <span className="text-black">SPORT</span>
            <span className="text-red-700">EXPRESS</span>
          </NavLink>
        </div>
      )}

      {/* Right Section: Notifications & Profile */}
      <div className={`flex items-center justify-end ${showLogo ? 'w-1/4' : ''}`}>
        {/* User Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100">
            {/* Use an icon instead of an image */}
            <FaUserCircle className="h-8 w-8 text-gray-500" />

            <span className="text-sm font-medium text-gray-700 hidden sm:block">{admin?.name?.split(' ')[0]}</span>
            <FaCaretDown className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-30">
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-800">{admin?.name}</p>
                <p className="text-sm text-gray-500 truncate">{admin?.email}</p>
              </div>
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-gray-700">
                  <FaUserEdit className="text-gray-500" />
                  <span>Edit profile</span>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-gray-700">
                  <FaCog className="text-gray-500" />
                  <span>Account settings</span>
                </li>
              </ul>
              <div className="border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 flex items-center gap-3"
                >
                  <FaSignOutAlt />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
