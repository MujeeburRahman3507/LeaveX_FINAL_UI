import DashboardLayout from "../components/DashboardLayout";
import ApprovalBasket from "../components/ApprovalBasket";

/** Manager: pending approval requests (moved out of the dashboard). */
export default function ManagerApprovals() {
  return (
    <DashboardLayout>
      <div className="mt-2 sm:mt-6">
        <ApprovalBasket />
      </div>
    </DashboardLayout>
  );
}
