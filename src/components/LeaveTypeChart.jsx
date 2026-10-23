import DonutChart from "./DonutChart";

export default function LeaveTypeChart({
  casualLeave,
  medicalLeave,
  earnedLeave,
}) {
  const data = [
    { name: "Casual", value: casualLeave || 0, color: "#6D5DF6" },
    { name: "Medical", value: medicalLeave || 0, color: "#22C55E" },
    { name: "Earned", value: earnedLeave || 0, color: "#F59E0B" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-3 transition-colors duration-300">
      <div className="w-full sm:w-auto">
        <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-4 text-slate-900 dark:text-white text-center sm:text-left">
          Leave Types
        </h3>
        <DonutChart data={data} total={total} label="Total Leave" />
      </div>

      <div className="space-y-1 sm:space-y-2 w-full sm:w-auto sm:min-w-[180px]">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-0"
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
