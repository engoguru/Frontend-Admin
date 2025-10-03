import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaBars,
  FaBell,
  FaCaretDown,
} from 'react-icons/fa';

const TopNavbar = ({ toggleSidebar, showLogo }) => {
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
      <div className={`flex items-center justify-end space-x-6 ${showLogo ? 'w-1/4' : ''}`}>
        {/* Notifications Icon */}
        {/* <button className="relative text-gray-600 hover:text-gray-800">
          <FaBell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
        </button> */}
        {/* User Profile Dropdown */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40" // Placeholder image
            alt="Admin"
            className="h-9 w-9 rounded-full object-cover border-2 border-gray-200"
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
          <FaCaretDown className="text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
