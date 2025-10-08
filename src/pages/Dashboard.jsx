import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
  FaCheckCircle,
  FaShippingFast,
  FaTimesCircle,
  FaClipboardCheck,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaPiggyBank,
} from "react-icons/fa";
import RecentOrders from "../components/RecentOrders";
import { FaSackDollar } from "react-icons/fa6";

const ComparisonBadge = ({ percentage }) => {
  if (percentage === null || isNaN(percentage)) {
    return null; // Don't render if no data
  }
  const isPositive = percentage >= 0;
  const colorClass = isPositive
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
  const ArrowIcon = isPositive ? <FaArrowUp /> : <FaArrowDown />;

  return (
    <span
      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${colorClass}`}
    >
      {ArrowIcon} {Math.abs(percentage).toFixed(1)}%
    </span>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
  isLoading,
  comparison = null,
  prevMonthName = "",
  linkTo = null,
}) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-md flex flex-col justify-between min-h-[160px] ${color}`}
  >
    <div className="flex items-start justify-between">
      <div className="p-3 rounded-full bg-gray-100">{icon}</div>
      {comparison !== null && !isLoading && (
        <div className="flex flex-col items-end">
          <ComparisonBadge percentage={comparison} />
          <span className="text-xs text-gray-500 mt-1">vs {prevMonthName}</span>
        </div>
      )}
    </div>
    <div className="mt-6 flex-grow">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isLoading ? (
        <div className="h-8 w-24 bg-gray-300 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      )}
    </div>
    {linkTo && !isLoading && (
      <Link
        to={linkTo}
        className="self-end text-xs font-semibold text-blue-500 hover:text-blue-700 flex items-center gap-1 pt-1"
      >
        View More
        <FaArrowRight size={10} />
      </Link>
    )}
  </div>
);

const MonthNavigator = ({ date, setDate }) => {
  const handleMonthChange = (increment) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + increment);
    setDate(newDate);
  };

  const monthYearString = date.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200 w-fit">
      <button
        onClick={() => handleMonthChange(-1)}
        className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
        aria-label="Previous month"
      >
        <FaChevronLeft />
      </button>
      <span className="font-semibold text-gray-700 w-32 text-center">
        {monthYearString}
      </span>
      <button
        onClick={() => handleMonthChange(1)}
        className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
        aria-label="Next month"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

const YearNavigator = ({ date, setDate }) => {
  const handleYearChange = (increment) => {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + increment);
    setDate(newDate);
  };

  const yearString = date.getFullYear();

  return (
    <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200 w-fit">
      <button
        onClick={() => handleYearChange(-1)}
        className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
        aria-label="Previous year"
      >
        <FaChevronLeft />
      </button>
      <span className="font-semibold text-gray-700 w-24 text-center">
        {yearString}
      </span>
      <button
        onClick={() => handleYearChange(1)}
        className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
        aria-label="Next year"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    revenue: 0,
    netRevenue: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [isOverallLoading, setIsOverallLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsOverallLoading(true);
      try {
        const [
          ordersRes,
          customerStatsRes,
          orderStatsRes,
          orderStatusCountsRes,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/order/orderRoutes/getAll?limit=10"),
          fetch("http://localhost:5000/api/users/account/stats"),
          fetch("http://localhost:5000/api/order/orderRoutes/stats"),
          fetch("http://localhost:5000/api/order/orderRoutes/status-counts"),
        ]);
        // console.log(ordersRes);
        // console.log(orderStatsRes);
        const ordersData = await ordersRes.json();
       // console.log(ordersData);
        const customerStatsData = await customerStatsRes.json();
        const orderStatsData = await orderStatsRes.json();
        // console.log(orderStatsData);
        const orderStatusCountsData = await orderStatusCountsRes.json();
        // console.log(orderStatusCountsData);

        // Correctly access the 'data' property from the API response
        setRecentOrders(ordersData.data || []);

        const formattedCustomerStats = customerStatsData.reduce(
          (acc, yearData) => {
            acc[yearData._id] = yearData.months;
            return acc;
          },
          {}
        );

        const totalCustomers = Object.values(formattedCustomerStats)
          .flat()
          .reduce((sum, month) => sum + month.customers, 0);

        const formattedOrderStats = orderStatsData.reduce((acc, yearData) => {
          acc[yearData._id] = yearData.months;
          return acc;
        }, {});

        setStats({
          ...stats, // Keep other stats like confirmed, shipped etc. if they are fetched elsewhere
          orders: ordersData.totalCount || 0,
          revenue: ordersData.totalRevenue || 0,
          netRevenue: ordersData.netRevenue || 0,
          customers: totalCustomers,
          customerStats: formattedCustomerStats,
          orderStats: formattedOrderStats,
          pending: orderStatusCountsData.pending || 0,
          confirmed: orderStatusCountsData.confirmed || 0,
          shipped: orderStatusCountsData.shipped || 0,
          delivered: orderStatusCountsData.delivered || 0,
          cancelled: orderStatusCountsData.cancelled || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsOverallLoading(false);
      }
    };

    fetchStats();
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("monthly"); // 'monthly' or 'yearly'
  const [selectedYearDate, setSelectedYearDate] = useState(new Date());

  // --- Current Month Order Status Calculation ---
  const now = new Date();
  const currentYearForStatus = now.getFullYear();
  const currentMonthForStatus = now.getMonth() + 1;
  const currentMonthNameForStatus = now.toLocaleString("default", {
    month: "long",
  });

  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // --- Monthly Calculation ---
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const monthlyCustomerCount =
    stats.customerStats?.[year]?.find((m) => m.month === month)?.customers || 0;
  const monthlyOrderStats = stats.orderStats?.[year]?.find(
    (m) => m.month === month
  ) || { orders: 0, revenue: 0 };

  const prevMonthDate = new Date(selectedDate);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const prevMonthYear = prevMonthDate.getFullYear();
  const prevMonthMonth = prevMonthDate.getMonth() + 1;
  const prevMonthShortName = prevMonthDate.toLocaleString("default", {
    month: "short",
  });
  const prevMonthCustomerCount =
    stats.customerStats?.[prevMonthYear]?.find(
      (m) => m.month === prevMonthMonth
    )?.customers || 0;
  const prevMonthOrderStats = stats.orderStats?.[prevMonthYear]?.find(
    (m) => m.month === prevMonthMonth
  ) || { orders: 0, revenue: 0 };

  const comparisons = {
    customers: calculateChange(monthlyCustomerCount, prevMonthCustomerCount),
    orders: calculateChange(
      monthlyOrderStats.orders,
      prevMonthOrderStats.orders
    ),
    revenue: calculateChange(
      monthlyOrderStats.revenue,
      prevMonthOrderStats.revenue
    ),
    netRevenue: calculateChange(
      monthlyOrderStats.revenue,
      prevMonthOrderStats.revenue
    ), // Assuming net revenue for monthly is same as gross for now
  };

  // --- Yearly Calculation ---
  const selectedYear = selectedYearDate.getFullYear();
  const yearlyCustomerCount =
    stats.customerStats?.[selectedYear]?.reduce(
      (acc, month) => acc + month.customers,
      0
    ) || 0;
  const prevYearCustomerCount =
    stats.customerStats?.[selectedYear - 1]?.reduce(
      (acc, month) => acc + month.customers,
      0
    ) || 0;
  const yearlyOrderCount =
    stats.orderStats?.[selectedYear]?.reduce(
      (acc, month) => acc + month.orders,
      0
    ) || 0;
  const prevYearOrderCount =
    stats.orderStats?.[selectedYear - 1]?.reduce(
      (acc, month) => acc + month.orders,
      0
    ) || 0;
  const yearlyGrossRevenue =
    stats.orderStats?.[selectedYear]?.reduce(
      (acc, month) => acc + month.revenue,
      0
    ) || 0;
  const prevYearGrossRevenue =
    stats.orderStats?.[selectedYear - 1]?.reduce(
      (acc, month) => acc + month.revenue,
      0
    ) || 0;
  const yearlyNetRevenue =
    stats.orderStats?.[selectedYear]?.reduce(
      (acc, month) => acc + month.revenue,
      0
    ) || 0;
  const prevYearNetRevenue =
    stats.orderStats?.[selectedYear - 1]?.reduce(
      (acc, month) => acc + month.revenue,
      0
    ) || 0;

  const yearlyComparisons = {
    customers: calculateChange(yearlyCustomerCount, prevYearCustomerCount),
    orders: calculateChange(yearlyOrderCount, prevYearOrderCount),
    revenue: calculateChange(yearlyGrossRevenue, prevYearGrossRevenue), // This was already correct for yearly
    netRevenue: calculateChange(yearlyNetRevenue, prevYearNetRevenue),
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Overall Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Overall Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          <StatCard
            icon={<FaUsers size={24} className="text-blue-500" />}
            label="Total Customers"
            value={stats.customers}
            color=""
            isLoading={isOverallLoading}
            linkTo="/customers"
          />
          <StatCard
            icon={<FaShoppingCart size={24} className="text-orange-500" />}
            label="Total Orders"
            value={stats.orders}
            color=""
            isLoading={isOverallLoading}
            linkTo="/orders"
          />
          <StatCard
            icon={<FaMoneyBillWave size={24} className="text-green-500" />}
            label="Gross Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
            color=""
            isLoading={isOverallLoading}
            linkTo="/orders"
          />
          <StatCard
            icon={<FaSackDollar size={24} className="text-emerald-500" />}
            label="Net Revenue"
            value={`₹${stats.netRevenue.toLocaleString()}`}
            color=""
            isLoading={isOverallLoading}
            linkTo="/orders"
          />
        </div>
      </div>

      {/* Detailed Statistics Section (Monthly/Yearly) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("monthly")}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                  viewMode === "monthly"
                    ? "bg-white text-gray-800 shadow"
                    : "bg-transparent text-gray-600"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setViewMode("yearly")}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                  viewMode === "yearly"
                    ? "bg-white text-gray-800 shadow"
                    : "bg-transparent text-gray-600"
                }`}
              >
                Yearly
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Statistics</h2>
          </div>
          {viewMode === "monthly" ? (
            <MonthNavigator date={selectedDate} setDate={setSelectedDate} />
          ) : (
            <YearNavigator
              date={selectedYearDate}
              setDate={setSelectedYearDate}
            />
          )}
        </div>
        {viewMode === "monthly" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              <StatCard
                icon={<FaUsers size={24} className="text-blue-500" />}
                label="Customers"
                value={monthlyCustomerCount}
                color=""
                isLoading={isOverallLoading}
                comparison={comparisons.customers}
                prevMonthName={prevMonthShortName}
                linkTo="/customers"
              />
              <StatCard
                icon={<FaShoppingCart size={24} className="text-orange-500" />}
                label="Orders"
                value={monthlyOrderStats.orders}
                color=""
                isLoading={isOverallLoading}
                comparison={comparisons.orders}
                prevMonthName={prevMonthShortName}
                linkTo="/orders"
              />
              <StatCard
                icon={<FaMoneyBillWave size={24} className="text-green-500" />}
                label="Gross Revenue"
                value={`₹${(monthlyOrderStats.revenue || 0).toLocaleString()}`}
                color=""
                isLoading={isOverallLoading}
                comparison={comparisons.revenue}
                prevMonthName={prevMonthShortName}
                linkTo="/orders"
              />
              <StatCard
                icon={<FaSackDollar size={24} className="text-emerald-500" />}
                label="Net Revenue"
                value={`₹${(monthlyOrderStats.revenue || 0).toLocaleString()}`}
                color=""
                isLoading={isOverallLoading}
                comparison={comparisons.netRevenue}
                prevMonthName={prevMonthShortName}
                linkTo="/orders"
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              <StatCard
                icon={<FaUsers size={24} className="text-blue-500" />}
                label="Total Customers"
                value={yearlyCustomerCount.toLocaleString()}
                color=""
                isLoading={isOverallLoading}
                comparison={yearlyComparisons.customers}
                prevMonthName={`${selectedYear - 1}`}
                linkTo="/customers"
              />
              <StatCard
                icon={<FaShoppingCart size={24} className="text-orange-500" />}
                label="Total Orders"
                value={yearlyOrderCount.toLocaleString()}
                color=""
                isLoading={isOverallLoading}
                comparison={yearlyComparisons.orders}
                prevMonthName={`${selectedYear - 1}`}
                linkTo="/orders"
              />
              <StatCard
                icon={<FaMoneyBillWave size={24} className="text-green-500" />}
                label="Gross Revenue"
                value={`₹${yearlyGrossRevenue.toLocaleString()}`}
                color=""
                isLoading={isOverallLoading}
                comparison={yearlyComparisons.revenue}
                prevMonthName={`${selectedYear - 1}`}
                linkTo="/orders"
              />
              <StatCard
                icon={<FaSackDollar size={24} className="text-emerald-500" />}
                label="Net Revenue"
                value={`₹${yearlyNetRevenue.toLocaleString()}`}
                color=""
                isLoading={isOverallLoading}
                comparison={yearlyComparisons.netRevenue}
                prevMonthName={`${selectedYear - 1}`}
                linkTo="/orders"
              />
            </div>
          </>
        )}
      </div>

      {/* Current Month Order Status Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Order Status ({currentMonthNameForStatus})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatCard
            icon={<FaHourglassHalf size={24} className="text-yellow-500" />}
            label="Pending Orders"
            value={stats.pending}
            color=""
            isLoading={isOverallLoading}
            linkTo="/orders?status=Pending"
          />
          <StatCard
            icon={<FaCheckCircle size={24} className="text-cyan-500" />}
            label="Confirmed Orders"
            value={stats.confirmed}
            color=""
            isLoading={isOverallLoading}
            linkTo="/orders?status=Confirmed"
          />
          <StatCard
            icon={<FaShippingFast size={24} className="text-teal-500" />}
            label="Shipped Orders"
            value={stats.shipped}
            color=""
            isLoading={isOverallLoading}
            linkTo="/orders?status=Shipped"
          />
          <StatCard
            icon={<FaClipboardCheck size={24} className="text-emerald-500" />}
            label="Delivered Orders"
            value={stats.delivered}
            color=""
            isLoading={isOverallLoading}
            linkTo="/orders?status=Delivered"
          />
          <StatCard
            icon={<FaTimesCircle size={24} className="text-rose-500" />}
            label="Cancelled Orders"
            value={stats.cancelled}
            color=""
            isLoading={isOverallLoading}
            linkTo="/orders?status=Cancelled"
          />
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="mt-8">
        <RecentOrders orders={recentOrders} isLoading={isOverallLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
