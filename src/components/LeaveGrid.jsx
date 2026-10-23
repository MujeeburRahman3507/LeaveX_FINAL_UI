import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Search,
  X,
} from "lucide-react";

const durationLabel = (d) =>
  d === "FIRST_HALF"
    ? "First Half (Morning)"
    : d === "SECOND_HALF"
      ? "Second Half (Afternoon)"
      : "Full Day";

/**
 * Leave request history as a data grid (same design as the approvals grid):
 * Action column first (pinned), sorting, per-column filters, status chips,
 * search and pagination. Works for web and mobile.
 */
export default function LeaveGrid({
  title = "My Leave Requests",
  rows,
  onCancel,
  onDocuments,
  badgeClass,
  getDocumentStatusBadge,
  getPriorityBadge,
}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ key: "startDate", dir: "desc" });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  const hasApplied = rows.some((r) => r.createdAt);

  const columns = [
    { key: "leaveType", label: "Type", width: 130, filter: "select", get: (r) => r.leaveType || "" },
    { key: "durationType", label: "Duration", width: 190, filter: "select", get: (r) => durationLabel(r.durationType) },
    { key: "startDate", label: "Start Date", width: 120, filter: "text", get: (r) => r.startDate || "" },
    { key: "endDate", label: "End Date", width: 120, filter: "text", get: (r) => r.endDate || "" },
    { key: "totalDays", label: "Days", width: 80, filter: "text",
      get: (r) => String(r.totalDays ?? ""), sortVal: (r) => Number(r.totalDays) || 0 },
    { key: "backupPersonName", label: "Backup", width: 150, filter: "text", get: (r) => r.backupPersonName || "" },
    { key: "status", label: "Status", width: 130, filter: "select", get: (r) => r.status || "" },
    { key: "documentStatus", label: "Document", width: 130, filter: "select",
      get: (r) => (r.documentRequested ? r.documentStatus || "" : "") },
    { key: "documentPriority", label: "Priority", width: 120, filter: "select",
      get: (r) => (r.documentRequested ? r.documentPriority || "" : "") },
    hasApplied && { key: "createdAt", label: "Applied On", width: 120, filter: "text",
      get: (r) => (r.createdAt ? String(r.createdAt).slice(0, 10) : "") },
  ].filter(Boolean);

  const sortVal = (col, r) => (col.sortVal ? col.sortVal(r) : String(col.get(r)).toLowerCase());

  const q = search.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (q && !columns.some((c) => String(c.get(r)).toLowerCase().includes(q))) return false;
    return columns.every((c) => {
      const f = (filters[c.key] || "").trim().toLowerCase();
      if (!f) return true;
      const v = String(c.get(r)).toLowerCase();
      return c.filter === "select" ? v === f : v.includes(f);
    });
  });

  const sortCol = columns.find((c) => c.key === sort.key) || columns[0];
  const dir = sort.dir === "asc" ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => {
    const va = sortVal(sortCol, a);
    const vb = sortVal(sortCol, b);
    return (va < vb ? -1 : va > vb ? 1 : 0) * dir;
  });

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };
  const toggleSort = (key) =>
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  const activeFilters = Object.values(filters).some((v) => v) || q;
  const clearAll = () => {
    setFilters({});
    setSearch("");
    setPage(0);
  };
  const options = (col) => [...new Set(rows.map((r) => col.get(r)))].filter(Boolean).sort();

  const statusCounts = {};
  rows.forEach((r) => {
    if (r.status) statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });

  const ACTION_W = 180;
  const totalWidth = ACTION_W + columns.reduce((s, c) => s + c.width, 0);

  const stickyHead = "sticky left-0 z-20 bg-slate-50 dark:bg-slate-700";
  const stickyFilter = "sticky left-0 z-20 bg-white dark:bg-slate-800";
  const stickyCell =
    "sticky left-0 z-10 bg-white dark:bg-slate-800 group-hover:bg-violet-50 dark:group-hover:bg-slate-700";
  const stickyShadow = "shadow-[2px_0_4px_rgba(0,0,0,0.06)]";
  const inputCls =
    "w-full h-8 px-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[13px] focus:outline-none focus:ring-1 focus:ring-violet-500";
  const navBtn =
    "h-8 w-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 disabled:opacity-35 hover:bg-slate-100 dark:hover:bg-slate-700";
  const chip = (active) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold border ${
      active
        ? "bg-violet-600 text-white border-violet-600"
        : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"
    }`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden mb-16 lg:mb-0">
      {/* title + quick filters */}
      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search leave type, date, status..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          {activeFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center justify-center gap-1 h-10 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X size={15} /> Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setFilter("status", "")} className={chip(!filters.status)}>
            All ({rows.length})
          </button>
          {Object.entries(statusCounts).map(([label, count]) => (
            <button
              key={label}
              type="button"
              onClick={() => setFilter("status", filters.status === label ? "" : label)}
              className={chip(filters.status === label)}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div className="overflow-x-auto">
        <table
          className="data-grid text-sm border-collapse"
          style={{ minWidth: totalWidth, width: "100%", tableLayout: "fixed" }}
        >
          <colgroup>
            <col style={{ width: ACTION_W }} />
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <th className={`${stickyHead} ${stickyShadow} px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase`}>
                Action
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() => toggleSort(c.key)}
                  className="px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase whitespace-nowrap cursor-pointer select-none border-l border-slate-200 dark:border-slate-600"
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {sort.key === c.key &&
                      (sort.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                  </span>
                </th>
              ))}
            </tr>

            <tr className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600">
              <th className={`${stickyFilter} ${stickyShadow} px-2 py-1.5`} />
              {columns.map((c) => (
                <th key={c.key} className="px-2 py-1.5 border-l border-slate-100 dark:border-slate-700 font-normal">
                  {c.filter === "select" ? (
                    <select
                      value={filters[c.key] || ""}
                      onChange={(e) => setFilter(c.key, e.target.value)}
                      className={inputCls}
                    >
                      <option value="">All</option>
                      {options(c).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={filters[c.key] || ""}
                      onChange={(e) => setFilter(c.key, e.target.value)}
                      className={inputCls}
                      aria-label={`Filter ${c.label}`}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                  No leave requests found.
                </td>
              </tr>
            )}

            {pageRows.map((r) => (
              <tr
                key={r.id}
                className="group border-b border-slate-100 dark:border-slate-700 hover:bg-violet-50 dark:hover:bg-slate-700/50 transition"
              >
                <td className={`${stickyCell} ${stickyShadow} px-3 py-2`}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDocuments(r)}
                      className="px-3 py-1.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-medium whitespace-nowrap"
                    >
                      📄 Docs
                    </button>
                    {r.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => onCancel(r)}
                        className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>

                {columns.map((c) => {
                  let content;
                  if (c.key === "status") {
                    content = (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass(r.status)}`}>
                        {r.status}
                      </span>
                    );
                  } else if (c.key === "documentStatus") {
                    content = r.documentRequested ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getDocumentStatusBadge(r.documentStatus)}`}>
                        {r.documentStatus}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">-</span>
                    );
                  } else if (c.key === "documentPriority") {
                    content = r.documentRequested ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityBadge(r.documentPriority)}`}>
                        {r.documentPriority}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">-</span>
                    );
                  } else {
                    content = (
                      <span className="text-slate-700 dark:text-slate-200">{c.get(r) || "-"}</span>
                    );
                  }
                  return (
                    <td
                      key={c.key}
                      className="px-3 py-2 border-l border-slate-50 dark:border-slate-700/60 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 p-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
        <label className="flex items-center gap-2">
          Page Size
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="h-8 px-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[13px]"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <span>
          {sorted.length === 0 ? "0" : `${start + 1} to ${Math.min(start + pageSize, sorted.length)}`} of {sorted.length}
        </span>

        <div className="flex items-center gap-1">
          <button type="button" className={navBtn} disabled={safePage === 0} onClick={() => setPage(0)} aria-label="First page">
            <ChevronsLeft size={16} />
          </button>
          <button type="button" className={navBtn} disabled={safePage === 0} onClick={() => setPage(safePage - 1)} aria-label="Previous page">
            <ChevronLeft size={16} />
          </button>
          <span className="px-2">
            Page {safePage + 1} of {pageCount}
          </span>
          <button type="button" className={navBtn} disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)} aria-label="Next page">
            <ChevronRight size={16} />
          </button>
          <button type="button" className={navBtn} disabled={safePage >= pageCount - 1} onClick={() => setPage(pageCount - 1)} aria-label="Last page">
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
