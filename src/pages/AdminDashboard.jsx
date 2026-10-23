import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import GreetingHeader from "../components/dashboard/GreetingHeader";
import adminService from "../services/adminService";

import AdminDashboardCards from "../components/admin/AdminDashboardCards";
import AdminCountryDonutChart from "../components/admin/AdminCountryDonutChart";
import AdminCountryBarChart from "../components/admin/AdminCountryBarChart";
import AdminLeaveStatusChart from "../components/admin/AdminLeaveStatusChart";
import AdminUpcomingHolidayWidget from "../components/admin/AdminUpcomingHolidayWidget";
import AdminBirthdayWidget from "../components/admin/AdminBirthdayWidget";
import AdminApprovalHighlight from "../components/admin/AdminApprovalHighlight";
import AdminDocumentReviewHighlight from "../components/admin/AdminDocumentReviewHighlight";

/**
 * Admin home: greeting, metrics, employees by country, leave status,
 * upcoming holidays, approval / document review summary cards, birthdays.
 */
export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, statisticsResponse] = await Promise.all([
        adminService.getDashboard(),
        adminService.getStatistics(),
      ]);
      setMetrics(dashboardResponse.data.data);
      setStatistics(statisticsResponse.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading || !metrics) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-violet-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Greeting + refresh */}
      <div className="mb-4 sm:mb-8">
        <GreetingHeader />
        <div className="flex justify-end mt-3">
          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl transition shadow text-sm sm:text-base"
          >
            <RefreshCw size={16} />
            <span className="sm:hidden">Refresh</span>
            <span className="hidden sm:inline">Refresh Dashboard</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-4 sm:mb-8">
        <AdminDashboardCards metrics={metrics} />
      </div>

      {/* Employees by country */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-4 sm:mb-8">
        <AdminCountryDonutChart
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        <AdminCountryBarChart
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </div>

      {/* Leave status + upcoming holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 sm:mb-8 items-start">
        <AdminLeaveStatusChart statistics={statistics} />
        <AdminUpcomingHolidayWidget />
      </div>

      {/* Approvals + document review summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 sm:mb-8">
        <AdminApprovalHighlight />
        <AdminDocumentReviewHighlight />
      </div>

      {/* Birthdays last */}
      <AdminBirthdayWidget />
    </DashboardLayout>
  );
}
