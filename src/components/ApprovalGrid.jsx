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
  d === "FIRST_HALF" ? "First Half" : d === "SECOND_HALF" ? "Second Half" : "Full Day";

const SLA_RANK = { BREACHED: 0, WARNING: 1, WITHIN_SLA: 2 };

const dueTime = (r) => (r.slaDueAt ? new Date(r.slaDueAt).getTime() : Infinity);

/**
 * Data grid for pending approvals (web + mobile):
 *  - "View" action is the FIRST column (pinned while scrolling sideways)
 *  - header sorting, per-column filters (type to filter, like a grid filter row)
 *  - quick SLA chips + search box, so urgent requests are one tap away
 *  - pagination with page size
 * Default order: most urgent first (SLA breached, then nearest SLA due time).
 */
export default function ApprovalGrid({
  requests,
  onView,
  getSlaStatusDisplay,
  getLeaveBadgeColor,
}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ key: "slaStatus", dir: "asc" });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  const hasDept = requests.some((r) => r.department);
  const hasDays = requests.some((r) => r.totalDays !== undefined && r.totalDays !== null);
  const hasApplied = requests.some((r) => r.createdAt);

  const slaLabel = (r) => getSlaStatusDisplay(r.slaStatus).label;

  const columns = [
    { key: "employeeName", label: "Employee", width: 190, filter: "text",
      get: (r) => r.employeeName || "" },
    hasDept && { key: "department", label: "Department", width: 140, filter: "text",
      get: (r) => r.department || "" },
    { key: "leaveType", label: "Leave Type", width: 140, filter: "select",
      get: (r) => r.leaveType || "" },
    { key: "durationType", label: "Duration", width: 130, filter: "select",
      get: (r) => durationLabel(r.durationType) },
    { key: "startDate", label: "From", width: 120, filter: "text",
      get: (r) => r.startDate || "" },
    { key: "endDate", label: "To", width: 120, filter: "text",
      get: (r) => r.endDate || "" },
    hasDays && { key: "totalDays", label: "Days", width: 80, filter: "text",
      get: (r) => String(r.totalDays ?? ""), sortVal: (r) => Number(r.totalDays) || 0 },
    { key: "slaStatus", label: "SLA", width: 130, filter: "select",
      get: slaLabel, sortVal: (r) => SLA_RANK[r.slaStatus] ?? 9 },
    { key: "slaDueAt", label: "SLA Due", width: 185, filter: "text",
      get: (r) => (r.slaDueAt ? new Date(r.slaDueAt).toLocaleString() : ""),
      sortVal: dueTime },
    { key: "backupPersonName", label: "Backup Person", width: 150, filter: "text",
      get: (r) => r.backupPersonName || "" },
    hasApplied && { key: "createdAt", label: "Applied On", width: 120, filter: "text",
      get: (r) => (r.createdAt ? String(r.createdAt).slice(0, 10) : "") },
  ].filter(Boolean);

  const sortVal = (col, r) => (col.sortVal ? col.sortVal(r) : String(col.get(r)).toLowerCase());

  // ---------- filter + sort ----------
  const q = search.trim().toLowerCase();
  const filtered = requests.filter((r) => {
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
  const rows = [...filtered].sort((a, b) => {
    const va = sortVal(sortCol, a);
    const vb = sortVal(sortCol, b);
    const r = va < vb ? -1 : va > vb ? 1 : 0;
    if (r !== 0) return r * dir;
    const da = dueTime(a);
    const db = dueTime(b);
    return da < db ? -1 : da > db ? 1 : 0;
  });

  // ---------- pagination ----------
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  // ---------- helpers ----------
  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };
  const toggleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };
  const activeFilters = Object.values(filters).some((v) => v) || q;
  const clearAll = () => {
    setFilters({});
    setSearch("");
    setPage(0);
  };

  const options = (col) => [...new Set(requests.map((r) => col.get(r)))].filter(Boolean).sort();

  // SLA quick chips
  const slaCounts = {};
  requests.forEach((r) => {
    const label = slaLabel(r);
    slaCounts[label] = (slaCounts[label] || 0) + 1;
  });

  const totalWidth = 96 + columns.reduce((s, c) => s + c.width, 0);

  const stickyHead = "sticky left-0 z-20 bg-slate-50 dark:bg-slate-700";
  const stickyFilter = "sticky left-0 z-20 bg-white dark:bg-slate-800";
  const stickyCell =
    "sticky left-0 z-10 bg-white dark:bg-slate-800 group-hover:bg-violet-50 dark:group-hover:bg-slate-700";
  const stickyShadow = "shadow-[2px_0_4px_rgba(0,0,0,0.06)]";
  const inputCls =
    "w-full h-8 px-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[13px] focus:outline-none focus:ring-1 focus:ring-violet-500";

  const navBtn =
    "h-8 w-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 disabled:opacity-35 hover:bg-slate-100 dark:hover:bg-slate-700";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden mb-16 lg:mb-0">
      {/* ---------- quick filters ---------- */}
      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search employee, leave type, date..."
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
          <button
            type="button"
            onClick={() => setFilter("slaStatus", "")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              !filters.slaStatus
                ? "bg-violet-600 text-white border-violet-600"
                : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"
            }`}
          >
            All ({requests.length})
          </button>
          {Object.entries(slaCounts).map(([label, count]) => (
            <button
              key={label}
              type="button"
              onClick={() =>
                setFilter("slaStatus", filters.slaStatus === label ? "" : label)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                filters.slaStatus === label
                  ? "bg-violet-600 text-white border-violet-600"
                  : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* ---------- grid ---------- */}
      <div className="overflow-x-auto">
        <table
          className="data-grid text-sm border-collapse"
          style={{ minWidth: totalWidth, width: "100%", tableLayout: "fixed" }}
        >
          <colgroup>
            <col style={{ width: 96 }} />
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

            {/* filter row */}
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
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  No requests match your filters.
                </td>
              </tr>
            )}

            {pageRows.map((r) => {
              const sla = getSlaStatusDisplay(r.slaStatus);
              return (
                <tr
                  key={r.id}
                  className="group border-b border-slate-100 dark:border-slate-700 hover:bg-violet-50 dark:hover:bg-slate-700/50 transition"
                >
                  <td className={`${stickyCell} ${stickyShadow} px-3 py-2`}>
                    <button
                      type="button"
                      onClick={() => onView(r)}
                      className="px-4 py-1.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-medium"
                    >
                      View
                    </button>
                  </td>

                  {columns.map((c) => {
                    let content;
                    if (c.key === "employeeName") {
                      content = (
                        <div className="font-semibold text-slate-800 dark:text-white truncate">
                          {r.employeeName}
                        </div>
                      );
                    } else if (c.key === "leaveType") {
                      content = (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getLeaveBadgeColor(r.leaveType)}`}
                        >
                          {r.leaveType}
                        </span>
                      );
                    } else if (c.key === "slaStatus") {
                      content = (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${sla.className}`}
                        >
                          {sla.label}
                        </span>
                      );
                    } else {
                      content = (
                        <span className="text-slate-700 dark:text-slate-200">
                          {c.get(r) || "-"}
                        </span>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ---------- pagination ---------- */}
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
          {rows.length === 0 ? "0" : `${start + 1} to ${Math.min(start + pageSize, rows.length)}`} of{" "}
          {rows.length}
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
