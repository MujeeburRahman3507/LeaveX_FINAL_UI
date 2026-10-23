import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import adminService from "../../services/adminService";

const COLORS = ["#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#14B8A6", "#EC4899"];

/** Employees by country as horizontal bars (drawn with plain HTML, always renders). */
export default function AdminCountryBarChart({ selectedCountry, setSelectedCountry }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await adminService.getCountryStats();
        setData(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const withColor = data.map((c, i) => ({ ...c, color: COLORS[i % COLORS.length] }));
  const visible =
    selectedCountry === "ALL"
      ? withColor
      : withColor.filter((c) => c.countryName === selectedCountry);
  const max = Math.max(1, ...visible.map((c) => c.employeeCount));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-violet-100 flex items-center justify-center">
            <BarChart3 size={20} className="text-violet-600" />
          </div>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">
              Employees By Country
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Bar Chart</p>
          </div>
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-white focus:ring-2 focus:ring-violet-500"
        >
          <option value="ALL">All Countries</option>
          {data.map((c) => (
            <option key={c.countryName} value={c.countryName}>
              {c.countryName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {visible.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
            No data available.
          </p>
        )}
        {visible.map((item) => (
          <div key={item.countryName}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2">
                {item.countryName}
              </span>
              <span className="font-bold text-slate-800 dark:text-white">
                {item.employeeCount}
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.employeeCount / max) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
