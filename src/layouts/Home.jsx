import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom'; // Changed to NavLink
import {
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaWallet,
  FaSignOutAlt,
  FaTimes,
} from 'react-icons/fa';
import { RxDashboard } from 'react-icons/rx';
import { useAuth } from '../context/AuthContext'; // Corrected path
import TopNavbar from '../components/TopNavbar';

const Home = () => {
  // Tailwind breakpoints
  const xlBreakpoint = 1280;
  const mdBreakpoint = 768;

  // Initialize state based on window width, defaulting to open on larger screens.
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > xlBreakpoint);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < mdBreakpoint);
  const [isLogoInNavbar, setIsLogoInNavbar] = useState(window.innerWidth < xlBreakpoint);
  const { logout } = useAuth();

  // Effect to handle automatic toggling on resize
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < mdBreakpoint;
      setIsLogoInNavbar(screenWidth < xlBreakpoint);
      setIsMobileView(isMobile);

      if (isMobile) {
        setIsMobileSidebarOpen(false); // Ensure mobile overlay is closed on resize
      } else {
        // Desktop/Tablet view
        if (screenWidth <= xlBreakpoint) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [xlBreakpoint, mdBreakpoint]);

  // Style for active NavLink
  const activeLinkStyle = {
    color: '#1D4ED8', // blue-600
    backgroundColor: '#EFF6FF', // blue-50
  };

  const handleToggleSidebar = () => {
    if (isMobileView) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleMobileLinkClick = () => {
    if (isMobileView) {
      setIsMobileSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <>
      {/* Header: Logo for desktop, Close button for mobile overlay */}
      <div className={`h-[69px] flex items-center border-b border-gray-200 ${isMobileView ? 'justify-between px-4' : 'justify-center'}`}>
        {isMobileView ? (
          <>
            <NavLink to="/" className="text-xl font-bold" onClick={handleMobileLinkClick}>
              <span className="text-black">SPORT</span>
              <span className="text-red-700">EXPRESS</span>
            </NavLink>
            <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-500 hover:text-gray-800">
              <FaTimes size={22} />
            </button>
          </>
        ) : (
          (!isLogoInNavbar || isSidebarOpen) && <NavLink to="/" className="text-2xl font-bold">
            <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-black">SPORT</span>
              <span className="text-red-700">EXPRESS</span>
            </span>
          </NavLink>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* sidebar */}
      <aside className={`bg-white shadow-md overflow-y-auto border-r border-gray-200 transition-all duration-300 z-40 
        ${isMobileView 
          ? `fixed h-full ${isMobileSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}` 
          : `flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}`}>
        {sidebarContent}

        <nav className={`mt-4 flex flex-col space-y-2 ${(isSidebarOpen || isMobileSidebarOpen) ? 'px-4' : 'px-2 items-center'}`}>
          <NavLink
            to="/"
            end // Use 'end' for the index route to prevent it from matching child routes
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className={`flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition ${!(isSidebarOpen || isMobileSidebarOpen) && 'justify-center'}`}
            title="Dashboard"
            onClick={handleMobileLinkClick}
          >
            <RxDashboard size={20} />
            <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${(isSidebarOpen || isMobileSidebarOpen) ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0'}`}>Dashboard</span>
          </NavLink>
          <NavLink
            to="/customers"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className={`flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition ${!(isSidebarOpen || isMobileSidebarOpen) && 'justify-center'}`}
            title="Customers"
            onClick={handleMobileLinkClick}
          >
            <FaUsers size={20} />
            <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${(isSidebarOpen || isMobileSidebarOpen) ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0'}`}>Customers</span>
          </NavLink>
          <NavLink
            to="/products"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className={`flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition ${!(isSidebarOpen || isMobileSidebarOpen) && 'justify-center'}`}
            title="Products"
            onClick={handleMobileLinkClick}
          >
            <FaBoxOpen size={20} />
            <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${(isSidebarOpen || isMobileSidebarOpen) ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0'}`}>Products</span>
          </NavLink>
          <NavLink
            to="/orders"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className={`flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition ${!(isSidebarOpen || isMobileSidebarOpen) && 'justify-center'}`}
            title="Orders"
            onClick={handleMobileLinkClick}
          >
            <FaShoppingCart size={20} />
            <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${(isSidebarOpen || isMobileSidebarOpen) ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0'}`}>Orders</span>
          </NavLink>
          <NavLink
            to="/" // Changed from # to a real path
            className={`flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition ${!(isSidebarOpen || isMobileSidebarOpen) && 'justify-center'}`}
            title="Payments"
            onClick={handleMobileLinkClick}
          >
            <FaWallet size={20} />
            <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${(isSidebarOpen || isMobileSidebarOpen) ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0'}`}>Payments</span>
          </NavLink>
          <button
            onClick={() => {
              logout();
              handleMobileLinkClick();
            }}
            className={`flex items-center text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition w-full ${(isSidebarOpen || isMobileSidebarOpen) ? 'text-left' : 'justify-center'}`}
            title="Logout"
          >
            <FaSignOutAlt size={20} />
            <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${(isSidebarOpen || isMobileSidebarOpen) ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0'}`}>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Backdrop for mobile overlay */}
      {isMobileView && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30" 
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* main content area */}
      <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <TopNavbar toggleSidebar={handleToggleSidebar} showLogo={isLogoInNavbar && !isSidebarOpen && !isMobileSidebarOpen} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Home;
