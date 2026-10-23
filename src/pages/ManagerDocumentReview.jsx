import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ManagerActionCenter from "../components/ManagerActionCenter";
import ManagerDocumentActionCenter from "../components/ManagerDocumentActionCenter";
import documentRequestService from "../services/documentRequestService";

/** Manager: documents waiting review + pending document requests (moved out of the dashboard). */
export default function ManagerDocumentReview() {
  const navigate = useNavigate();
  const [total, setTotal] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [review, pending] = await Promise.all([
          documentRequestService.getManagerActions(),
          documentRequestService.getManagerPendingActions(),
        ]);
        setTotal(
          (review?.data?.data || []).length +
            (pending?.data?.data || []).length
        );
      } catch (error) {
        console.error(error);
        setTotal(0);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-slate-800 dark:text-white">
          Document Review
        </h1>
        <p className="mt-1 sm:mt-2 text-sm text-slate-500 dark:text-slate-400">
          Review supporting documents and pending document requests.
        </p>
      </div>

      {total === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 text-center text-slate-500 dark:text-slate-400">
          No documents are waiting for review.
        </div>
      )}

      <div className="space-y-6">
        <ManagerDocumentActionCenter />
        <ManagerActionCenter
          onReview={(leaveRequestId) =>
            navigate("/manager/approvals", {
              state: { reviewLeaveRequestId: leaveRequestId },
            })
          }
        />
      </div>
    </DashboardLayout>
  );
}
