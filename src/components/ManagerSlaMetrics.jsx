import { useEffect, useState } from "react";
import { AlertTriangle, Clock, ShieldCheck, CircleAlert } from "lucide-react";
import leaveService from "../services/leaveService";

/**
 * SLA summary for the manager home screen: 2 x 2 on phones, 4 across on desktop.
 * Counts are calculated from the manager's pending approval requests.
 */
export default function ManagerSlaMetrics() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await leaveService.getPendingRequests();
        setRequests(response.data?.data || []);
      } catch (error) {
        console.error("Failed to load SLA metrics", error);
      }
    };
    load();
  }, []);

  const breached = requests.filter((r) => r.slaStatus === "BREACHED").length;
  const warning = requests.filter((r) => r.slaStatus === "WARNING").length;
  const within = requests.filter((r) => r.slaStatus === "WITHIN_SLA").length;
  const overdueToday = requests.filter((r) => {
    if (!r.slaDueAt) return false;
    const due = new Date(r.slaDueAt);
    const now = new Date();
    return due.toDateString() === now.toDateString() && due < now;
  }).length;

  const cards = [
    {
      label: "SLA Breached",
      sub: "Requests past SLA",
      value: breached,
      Icon: AlertTriangle,
      border: "border-red-200 dark:border-red-900/50",
      text: "text-red-600 dark:text-red-400",
      iconBox: "bg-red-100 dark:bg-red-900/30",
      bar: "bg-red-500",
    },
    {
      label: "SLA Warning",
      sub: "Approaching deadline",
      value: warning,
      Icon: Clock,
      border: "border-yellow-200 dark:border-yellow-900/50",
      text: "text-yellow-600 dark:text-yellow-400",
      iconBox: "bg-yellow-100 dark:bg-yellow-900/30",
      bar: "bg-yellow-400",
    },
    {
      label: "Within SLA",
      sub: "Requests on track",
      value: within,
      Icon: ShieldCheck,
      border: "border-green-200 dark:border-green-900/50",
      text: "text-green-600 dark:text-green-400",
      iconBox: "bg-green-100 dark:bg-green-900/30",
      bar: "bg-green-500",
    },
    {
      label: "Overdue Today",
      sub: "Due today, past time",
      value: overdueToday,
      Icon: CircleAlert,
      border: "border-orange-200 dark:border-orange-900/50",
      text: "text-orange-600 dark:text-orange-400",
      iconBox: "bg-orange-100 dark:bg-orange-900/30",
      bar: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 keep-grid">
      {cards.map(({ label, sub, value, Icon, border, text, iconBox, bar }) => (
        <div
          key={label}
          className={`bg-white dark:bg-slate-800 rounded-2xl border ${border} shadow-sm p-3 sm:p-5 relative overflow-hidden`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                {label}
              </p>
              <p className={`text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 ${text}`}>
                {value}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                {sub}
              </p>
            </div>
            <div
              className={`metric-icon-sm shrink-0 w-8 h-8 sm:w-11 sm:h-11 rounded-xl ${iconBox} flex items-center justify-center`}
            >
              <Icon size={20} className={text} />
            </div>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${bar}`} />
        </div>
      ))}
    </div>
  );
}
