import DonutChart from "./DonutChart";

export default function LeaveStatusChart({ metrics }) {
  const data = [
    { name: "Approved", value: metrics.approvedLeaves, color: "#22C55E" },
    { name: "Pending", value: metrics.pendingLeaves, color: "#F59E0B" },
    { name: "Rejected", value: metrics.rejectedLeaves, color: "#EF4444" },
  ];

  const total =
    (metrics.approvedLeaves || 0) +
    (metrics.pendingLeaves || 0) +
    (metrics.rejectedLeaves || 0);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-3 transition-colors duration-300">
      <div className="w-full sm:w-auto">
        <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-4 text-slate-900 dark:text-white text-center sm:text-left">
          Approval Status
        </h3>
        <DonutChart data={data} total={total} label="Total" />
      </div>

      <div className="space-y-1 sm:space-y-2 w-full sm:w-auto sm:min-w-[180px]">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 sm:gap-4 rounded-xl px-2 sm:px-3 py-1 sm:py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs sm:text-sm flex-1 text-slate-700 dark:text-slate-300">
              {item.name}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
