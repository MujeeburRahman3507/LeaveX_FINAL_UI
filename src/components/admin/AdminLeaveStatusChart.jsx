import { CheckCircle2, Clock3, XCircle, PieChart as PieChartIcon } from "lucide-react";
import DonutChart from "../DonutChart";

/** Overall leave status: drawn donut + list (no chart library, always renders). */
export default function AdminLeaveStatusChart({ statistics }) {
  const approved = statistics?.approvedRequests ?? 0;
  const pending = statistics?.pendingRequests ?? 0;
  const rejected = statistics?.rejectedRequests ?? 0;

  const data = [
    { name: "Approved", value: approved, color: "#22C55E", icon: CheckCircle2 },
    { name: "Pending", value: pending, color: "#F59E0B", icon: Clock3 },
    { name: "Rejected", value: rejected, color: "#EF4444", icon: XCircle },
  ];
  const total = approved + pending + rejected;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-violet-100 flex items-center justify-center">
            <PieChartIcon size={20} className="text-violet-600" />
          </div>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">
              Leave Status
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Overall Requests
            </p>
          </div>
        </div>
        <span className="text-xs bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-3 py-1.5 rounded-full">
          Live
        </span>
      </div>

      <div className="flex flex-col items-center gap-5">
        <DonutChart data={data} total={total} label="Total" />

        <div className="w-full space-y-2 sm:space-y-3">
          {data.map((item) => {
            const Icon = item.icon;
            const percent = total === 0 ? 0 : (item.value * 100) / total;
            return (
              <div key={item.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center"
                    style={{ background: item.color + "20" }}
                  >
                    <Icon size={17} style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">{percent.toFixed(1)} %</p>
                  </div>
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
