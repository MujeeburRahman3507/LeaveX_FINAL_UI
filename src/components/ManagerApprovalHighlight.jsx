import { useEffect, useState } from "react";
import { Bell, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import leaveService from "../services/leaveService";

/** Home-screen summary: number of pending approvals + button to the Approvals page. */
export default function ManagerApprovalHighlight() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await leaveService.getPendingRequests();
        setCount((response.data?.data || []).length);
      } catch (error) {
        console.error("Failed to load pending approval count", error);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-300 dark:border-amber-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <Bell size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Pending Approvals
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {count === 0 ? (
                "No requests waiting for you."
              ) : (
                <>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {count}
                  </span>{" "}
                  leave request{count === 1 ? "" : "s"} waiting for approval.
                </>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager/approvals")}
          className="shrink-0 flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm transition"
        >
          <span className="hidden sm:inline">Review Approvals</span>
          <span className="sm:hidden">Review</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
