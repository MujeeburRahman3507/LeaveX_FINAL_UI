import { useEffect, useState } from "react";

import DashboardLayout from "../components/DashboardLayout";
import GreetingHeader from "../components/dashboard/GreetingHeader";
import ModernMetricCard from "../components/dashboard/ModernMetricCard";
import EmployeeActionCenter from "../components/EmployeeActionCenter";
import LeaveStatusChart from "../components/LeaveStatusChart";
import LeaveTypeChart from "../components/LeaveTypeChart";
import HolidayWidget from "../components/HolidayWidget";
import BirthdayPopup from "../components/BirthdayPopup";

import leaveService from "../services/leaveService";
import birthdayService from "../services/birthdayService";

/**
 * Employee dashboard: greeting, metrics, charts, upcoming holidays.
 * Leave requests (apply + list) now live on /employee/my-leaves.
 */
export default function EmployeeDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [birthdayPopupOpen, setBirthdayPopupOpen] = useState(false);
  const [birthdayGreeting, setBirthdayGreeting] = useState(null);

  const loadDashboard = async () => {
    try {
      const response = await leaveService.getDashboardMetrics();
      setMetrics(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadBirthdayGreeting = async () => {
    try {
      const response = await birthdayService.getBirthdayGreeting();
      const data = response.data.data;
      setBirthdayGreeting(data);

      // show the birthday popup once per browser session
      const popupKey = `birthday-popup-${data.employeeName}`;
      if (data.birthday && !sessionStorage.getItem(popupKey)) {
        setBirthdayPopupOpen(true);
        sessionStorage.setItem(popupKey, "shown");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadBirthdayGreeting();
  }, []);

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">Loading Dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-4 sm:mb-8">
        <GreetingHeader />
      </div>

      <EmployeeActionCenter />

      {/* Metrics: 3 per row on phones, 6 on desktop */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-8 keep-grid">
        <ModernMetricCard
          title="Annual Balance"
          value={metrics.annualBalance}
          icon="balance"
          color="bg-gradient-to-r from-blue-600 to-cyan-500"
        />
        <ModernMetricCard
          title="Used Leave"
          value={metrics.usedLeave}
          icon="leave"
          color="bg-gradient-to-r from-violet-600 to-purple-600"
        />
        <ModernMetricCard
          title="Remaining"
          value={metrics.remainingLeave}
          icon="trend"
          color="bg-gradient-to-r from-emerald-600 to-green-500"
        />
        <ModernMetricCard
          title="Approved"
          value={metrics.approvedLeaves}
          icon="approved"
          color="bg-gradient-to-r from-green-600 to-lime-500"
        />
        <ModernMetricCard
          title="Rejected"
          value={metrics.rejectedLeaves}
          icon="rejected"
          color="bg-gradient-to-r from-red-600 to-pink-500"
        />
        <ModernMetricCard
          title="Pending"
          value={metrics.pendingLeaves}
          icon="pending"
          color="bg-gradient-to-r from-orange-500 to-amber-500"
        />
      </div>

      {/* Charts + holidays: two pies side by side on phones */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-8 items-start keep-grid">
        <LeaveStatusChart metrics={metrics} />

        <LeaveTypeChart
          casualLeave={metrics.casualLeave}
          medicalLeave={metrics.medicalLeave}
          earnedLeave={metrics.earnedLeave}
        />

        <div className="col-span-2 lg:col-span-1 h-full">
          <HolidayWidget />
        </div>
      </div>

      <BirthdayPopup
        open={birthdayPopupOpen}
        employeeName={birthdayGreeting?.employeeName}
        message={birthdayGreeting?.message}
        onClose={() => setBirthdayPopupOpen(false)}
      />
    </DashboardLayout>
  );
}
