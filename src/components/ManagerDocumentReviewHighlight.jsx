import { useEffect, useState } from "react";
import { FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import documentRequestService from "../services/documentRequestService";

/** Home-screen summary: documents waiting for review + button to the Document Review page. */
export default function ManagerDocumentReviewHighlight() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [review, pending] = await Promise.all([
          documentRequestService.getManagerActions(),
          documentRequestService.getManagerPendingActions(),
        ]);
        const a = review?.data?.data || [];
        const b = pending?.data?.data || [];
        setCount(a.length + b.length);
      } catch (error) {
        console.error("Failed to load document review count", error);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-300 dark:border-emerald-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <FileText size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Document Review
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {count === 0 ? (
                "No documents need your attention."
              ) : (
                <>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {count}
                  </span>{" "}
                  document{count === 1 ? "" : "s"} need your attention.
                </>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager/document-review")}
          className="shrink-0 flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm transition"
        >
          <span className="hidden sm:inline">Review Documents</span>
          <span className="sm:hidden">Review</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
