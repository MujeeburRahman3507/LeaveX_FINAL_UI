import DashboardLayout from "../components/DashboardLayout";
import GreetingHeader from "../components/dashboard/GreetingHeader";
import ManagerSlaMetrics from "../components/ManagerSlaMetrics";
import ManagerTeamLeaveOverview from "../components/ManagerTeamLeaveOverview";
import HolidayWidget from "../components/HolidayWidget";
import ManagerApprovalHighlight from "../components/ManagerApprovalHighlight";
import ManagerDocumentReviewHighlight from "../components/ManagerDocumentReviewHighlight";
import EmployeeOnLeaveCard from "../components/EmployeeOnLeaveCard";
import ManagerBirthdayWidget from "../components/ManagerBirthdayWidget";
import { useAuth } from "../context/AuthContext";

/**
 * Manager home: greeting, SLA metrics, team leave overview, holidays,
 * summary cards that link to Approvals / Document Review, birthdays.
 */
export default function ManagerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <GreetingHeader name={user?.username} />

      <div className="mt-4 sm:mt-6">
        <ManagerSlaMetrics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4 sm:mt-8 items-start">
        <ManagerTeamLeaveOverview />
        <HolidayWidget managerMode={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4 sm:mt-8">
        <ManagerApprovalHighlight />
        <ManagerDocumentReviewHighlight />
      </div>

      <div className="mt-4 sm:mt-8">
        <EmployeeOnLeaveCard />
      </div>

      <div className="mt-4 sm:mt-8">
        <ManagerBirthdayWidget />
      </div>
    </DashboardLayout>
  );
}
