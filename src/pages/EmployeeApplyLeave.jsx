import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import LeaveForm from "../components/LeaveForm";
import GreetingHeader from "../components/dashboard/GreetingHeader";

/**
 * Apply Leave (same layout as the manager's Apply Leave page).
 * The AI assistant can pre-fill the form (data arrives via router state
 * or directly from the floating assistant on this page).
 */
export default function EmployeeApplyLeave() {
  const location = useLocation();
  const navigate = useNavigate();

  const [aiLeaveData, setAiLeaveData] = useState(
    location.state?.aiLeaveData || null
  );

  // AI assistant (global button) sends parsed leave via router state
  useEffect(() => {
    const data = location.state?.aiLeaveData;
    if (data) {
      setAiLeaveData(data);
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <DashboardLayout>
      <GreetingHeader />

      <div className="mt-4 sm:mt-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
              Apply Leave
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Submit your leave request for approval.
            </p>
          </div>

          <LeaveForm
            aiLeaveData={aiLeaveData}
            onSuccess={() => {
              setAiLeaveData(null);
              navigate("/employee/my-leaves");
            }}
          />
        </div>
      </div>

    </DashboardLayout>
  );
}
