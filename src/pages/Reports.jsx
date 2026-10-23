
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import reportService from "../services/reportService";
import { useTheme } from "../context/ThemeContext";

export default function Reports() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    status: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    status: "",
  });

  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cardClass = isDark
    ? "bg-slate-800 border border-slate-700 text-slate-100"
    : "bg-white border border-slate-200 text-slate-900";

  const labelClass = isDark
    ? "block text-sm font-medium text-slate-300 mb-2"
    : "block text-sm font-medium text-slate-700 mb-2";

  const inputClass = `w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 ${
    isDark
      ? "bg-slate-900 border-slate-600 text-slate-100"
      : "bg-white border-slate-300 text-slate-900"
  }`;

  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const applyFilters = (event) => {
    event.preventDefault();

    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      setError("Start date cannot be after end date.");
      setSuccess("");
      return;
    }

    setAppliedFilters({ ...filters });
    setError("");
    setSuccess("Filters applied. Downloads will use these filters.");
  };

  const resetFilters = () => {
    const emptyFilters = {
      startDate: "",
      endDate: "",
      leaveType: "",
      status: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setError("");
    setSuccess("Filters have been reset.");
  };

  const downloadReport = async (type) => {
    setLoading(type);
    setError("");
    setSuccess("");

    try {
      const params = Object.fromEntries(
        Object.entries(appliedFilters).filter(
          ([, value]) => value !== ""
        )
      );

      if (type === "excel") {
        await reportService.downloadExcel(params);
      } else {
        await reportService.downloadPdf(params);
      }

      setSuccess(
        `${type === "excel" ? "Excel" : "PDF"} report downloaded successfully.`
      );
    } catch (err) {
      console.error("Report download failed:", err);
      setError(
        err.response?.data?.message ||
          "Unable to download the report. Please try again."
      );
    } finally {
      setLoading("");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1
            className={`text-xl sm:text-3xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Reports & Analytics
          </h1>
          <p
            className={`mt-2 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Filter leave records and download reports.
          </p>
        </div>

        <form
          onSubmit={applyFilters}
          className={`rounded-xl shadow-sm p-4 sm:p-6 ${cardClass}`}
        >
          <h2 className="text-lg font-semibold mb-5">
            Report Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  updateFilter("startDate", e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  updateFilter("endDate", e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Leave Type</label>
              <select
                value={filters.leaveType}
                onChange={(e) =>
                  updateFilter("leaveType", e.target.value)
                }
                className={inputClass}
              >
                <option value="">All Leave Types</option>
                <option value="ANNUAL">Annual Leave</option>
                <option value="MEDICAL">Medical Leave</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="EARNED">Earned Leave</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Request Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  updateFilter("status", e.target.value)
                }
                className={inputClass}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg font-medium"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className={`px-5 py-2.5 rounded-lg border font-medium ${
                isDark
                  ? "border-slate-600 hover:bg-slate-700"
                  : "border-slate-300 hover:bg-slate-100"
              }`}
            >
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 text-red-700 p-4">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-300 bg-green-50 text-green-700 p-4">
            {success}
          </div>
        )}

        <div className={`rounded-xl shadow-sm p-4 sm:p-6 ${cardClass}`}>
          <h2 className="text-lg font-semibold mb-2">
            Download Reports
          </h2>

          <p
            className={`text-sm mb-5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Exports use the last applied filters. Reset and apply
            again to download all records.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              disabled={loading !== ""}
              onClick={() => downloadReport("excel")}
              className="flex items-center justify-center gap-2 bg-green-600 w-full sm:w-auto hover:bg-green-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {loading === "excel"
                ? "Downloading Excel..."
                : "Download Excel Report"}
            </button>

            <button
              type="button"
              disabled={loading !== ""}
              onClick={() => downloadReport("pdf")}
              className="flex items-center justify-center gap-2 bg-red-600 w-full sm:w-auto hover:bg-red-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {loading === "pdf"
                ? "Downloading PDF..."
                : "Download PDF Report"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
