import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white min-h-[calc(100vh-69px)]"> {/* Adjust min-height based on TopNavbar height */}
      <h1 className="text-8xl font-extrabold text-red-700 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        The page you are looking for doesn’t exist or has been moved. Please check the URL or go back to the dashboard.
      </p>
      <Link
        to="/" // Link to the Admin dashboard
        className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-md font-medium transition duration-300"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;