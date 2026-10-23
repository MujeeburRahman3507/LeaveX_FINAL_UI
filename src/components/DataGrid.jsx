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

/**
 * Generic data grid used by the admin screens (web + mobile).
 *  - Action column first and pinned while scrolling sideways
 *  - header sorting, per-column filters, search box, optional quick chips
 *  - pagination with page size
 *
 * columns: [{ key, label, width, filter: "text" | "select" | false,
 *             get(row) -> string, render?(row), sortVal?(row) }]
 */
export default function DataGrid({
  title,
  subtitle,
  toolbar,
  rows = [],
  columns = [],
  rowKey = "id",
  renderActions,
  actionLabel = "Action",
  actionWidth = 150,
  defaultSort,
  chipsKey,
  searchPlaceholder = "Search...",
  emptyText = "No records found.",
  bare = false,
  initialPageSize = 10,
}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(defaultSort || null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(0);

  const sortVal = (col, r) =>
    col.sortVal ? col.sortVal(r) : String(col.get(r) ?? "").toLowerCase();

  // ---------- filter + sort ----------
  const q = search.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (q && !columns.some((c) => String(c.get(r) ?? "").toLowerCase().includes(q))) return false;
    return columns.every((c) => {
      const f = (filters[c.key] || "").trim().toLowerCase();
      if (!f) return true;
      const v = String(c.get(r) ?? "").toLowerCase();
      return c.filter === "select" ? v === f : v.includes(f);
    });
  });

  const sortCol = sort && columns.find((c) => c.key === sort.key);
  const dir = sort?.dir === "desc" ? -1 : 1;
  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const va = sortVal(sortCol, a);
        const vb = sortVal(sortCol, b);
        return (va < vb ? -1 : va > vb ? 1 : 0) * dir;
      })
    : filtered;

  // ---------- pagination ----------
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  // ---------- helpers ----------
  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };
  const toggleSort = (key) =>
    setSort((prev) =>
      prev && prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  const activeFilters = Object.values(filters).some((v) => v) || q;
  const clearAll = () => {
    setFilters({});
    setSearch("");
    setPage(0);
  };
  const options = (col) =>
    [...new Set(rows.map((r) => col.get(r)))].filter(Boolean).sort();

  const chipCol = chipsKey && columns.find((c) => c.key === chipsKey);
  const chipCounts = {};
  if (chipCol) {
    rows.forEach((r) => {
      const v = chipCol.get(r);
      if (v) chipCounts[v] = (chipCounts[v] || 0) + 1;
    });
  }

  const visibleCols = columns.filter((c) => !c.hidden);
  const totalWidth = actionWidth + visibleCols.reduce((s, c) => s + (c.width || 140), 0);

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

  const wrapper = bare
    ? "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
    : "bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden mb-16 lg:mb-0";

  return (
    <div className={wrapper}>
      {/* ---------- title + search + chips ---------- */}
      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
        {(title || toolbar) && (
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              {title && (
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
              )}
            </div>
            {toolbar}
          </div>
        )}

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
              placeholder={searchPlaceholder}
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

        {chipCol && (
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setFilter(chipsKey, "")} className={chip(!filters[chipsKey])}>
              All ({rows.length})
            </button>
            {Object.entries(chipCounts).map(([label, count]) => (
              <button
                key={label}
                type="button"
                onClick={() => setFilter(chipsKey, filters[chipsKey] === label ? "" : label)}
                className={chip(filters[chipsKey] === label)}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- grid ---------- */}
      <div className="overflow-x-auto">
        <table
          className="data-grid text-sm border-collapse"
          style={{ minWidth: totalWidth, width: "100%", tableLayout: "fixed" }}
        >
          <colgroup>
            {renderActions && <col style={{ width: actionWidth }} />}
            {visibleCols.map((c) => (
              <col key={c.key} style={{ width: c.width || 140 }} />
            ))}
          </colgroup>

          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              {renderActions && (
                <th className={`${stickyHead} ${stickyShadow} px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase`}>
                  {actionLabel}
                </th>
              )}
              {visibleCols.map((c) => (
                <th
                  key={c.key}
                  onClick={() => toggleSort(c.key)}
                  className="px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase whitespace-nowrap cursor-pointer select-none border-l border-slate-200 dark:border-slate-600"
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {sort?.key === c.key &&
                      (sort.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                  </span>
                </th>
              ))}
            </tr>

            <tr className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600">
              {renderActions && <th className={`${stickyFilter} ${stickyShadow} px-2 py-1.5`} />}
              {visibleCols.map((c) => (
                <th key={c.key} className="px-2 py-1.5 border-l border-slate-100 dark:border-slate-700 font-normal">
                  {c.filter === false ? null : c.filter === "select" ? (
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
                  colSpan={visibleCols.length + (renderActions ? 1 : 0)}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  {emptyText}
                </td>
              </tr>
            )}

            {pageRows.map((r, i) => (
              <tr
                key={r[rowKey] ?? i}
                className="group border-b border-slate-100 dark:border-slate-700 hover:bg-violet-50 dark:hover:bg-slate-700/50 transition"
              >
                {renderActions && (
                  <td className={`${stickyCell} ${stickyShadow} px-3 py-2`}>
                    <div className="flex items-center gap-2">{renderActions(r)}</div>
                  </td>
                )}
                {visibleCols.map((c) => (
                  <td
                    key={c.key}
                    className="px-3 py-2 border-l border-slate-50 dark:border-slate-700/60 whitespace-nowrap overflow-hidden text-ellipsis text-slate-700 dark:text-slate-200"
                    title={c.render ? undefined : String(c.get(r) ?? "")}
                  >
                    {c.render ? c.render(r) : c.get(r) || "-"}
                  </td>
                ))}
              </tr>
            ))}
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
