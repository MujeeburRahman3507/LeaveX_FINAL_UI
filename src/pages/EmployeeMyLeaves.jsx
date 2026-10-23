import DashboardLayout from "../components/DashboardLayout";
import LeaveTable from "../components/LeaveTable";

/**
 * My Leave Requests: list of all my leave requests.
 * Applying for leave is on /employee/apply-leave (sidebar: "Apply Leave").
 */
export default function EmployeeMyLeaves() {
  return (
    <DashboardLayout>
      <LeaveTable />
    </DashboardLayout>
  );
}
