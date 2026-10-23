import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import adminService from "../../services/adminService";
import DonutChart from "../DonutChart";

const COLORS = ["#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#14B8A6", "#EC4899"];

/** Employees by country: drawn donut + list (no chart library, always renders). */
export default function AdminCountryDonutChart({ selectedCountry, setSelectedCountry }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await adminService.getCountryStats();
        setCountries(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const grandTotal = countries.reduce((s, c) => s + c.employeeCount, 0);

  // colours stay tied to the country even when the list is filtered
  const withColor = countries.map((c, i) => ({
    name: c.countryName,
    value: c.employeeCount,
    color: COLORS[i % COLORS.length],
    percentage: grandTotal ? ((c.employeeCount / grandTotal) * 100).toFixed(1) : "0.0",
  }));

  const visible =
    selectedCountry === "ALL" ? withColor : withColor.filter((c) => c.name === selectedCountry);
  const visibleTotal = visible.reduce((s, c) => s + c.value, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-violet-100 flex items-center justify-center">
            <Globe2 size={20} className="text-violet-600" />
          </div>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">
              Employees By Country
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Distribution</p>
          </div>
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-white focus:ring-2 focus:ring-violet-500"
        >
          <option value="ALL">All Countries</option>
          {countries.map((c) => (
            <option key={c.countryName} value={c.countryName}>
              {c.countryName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
        <DonutChart data={visible} total={visibleTotal} label="Total" />

        <div className="w-full sm:flex-1 space-y-2 sm:space-y-3">
          {visible.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-slate-800 dark:text-white">{item.value}</span>
                <span className="ml-2 text-xs text-slate-400">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
