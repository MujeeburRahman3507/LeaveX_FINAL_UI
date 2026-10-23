import { useEffect, useState } from "react";
import adminService from "../services/adminService";
import DataGrid from "./DataGrid";

const category = (value = "") => {
  if (value.includes("APPROVED")) return "Approved";
  if (value.includes("REJECTED")) return "Rejected";
  if (value.includes("APPLIED")) return "Applied";
  if (value.includes("CANCELLED")) return "Cancelled";
  return "Other";
};

const BADGE = {
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
  Applied: "bg-blue-100 text-blue-600",
  Cancelled: "bg-amber-100 text-amber-600",
  Other: "bg-slate-200 text-slate-700",
};

export default function AuditLogTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await adminService.getAuditLogs();
        setRows(response.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-600 dark:text-slate-300">Loading Audit Logs...</div>;
  }

  const count = (name) => rows.filter((r) => category(r.actionType) === name).length;

  const kpis = [
    { label: "Approved", value: count("Approved"), cls: "from-green-400 to-green-600" },
    { label: "Rejected", value: count("Rejected"), cls: "from-red-400 to-red-600" },
    { label: "Applied", value: count("Applied"), cls: "from-blue-400 to-blue-600" },
    { label: "Cancelled", value: count("Cancelled"), cls: "from-yellow-400 to-orange-500" },
  ];

  return (
    <div className="space-y-3 sm:space-y-5">
      <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
        Audit Logs
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 keep-grid">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`bg-gradient-to-r ${k.cls} text-white p-3 sm:p-5 rounded-2xl shadow`}
          >
            <p className="text-xs sm:text-base opacity-90">{k.label}</p>
            <h3 className="text-2xl sm:text-3xl font-bold mt-1">{k.value}</h3>
          </div>
        ))}
      </div>

      <DataGrid
        rows={rows}
        searchPlaceholder="Search user, action, entity, details..."
        defaultSort={{ key: "createdAt", dir: "desc" }}
        initialPageSize={25}
        chipsKey="category"
        emptyText="No audit logs found."
        columns={[
          { key: "category", label: "Category", hidden: true, filter: "select",
            get: (r) => category(r.actionType) },
          { key: "actionBy", label: "User", width: 160, filter: "text", get: (r) => r.actionBy || "" },
          { key: "actionType", label: "Action", width: 220, filter: "select",
            get: (r) => r.actionType || "",
            render: (r) => (
              <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${BADGE[category(r.actionType)]}`}>
                {r.actionType}
              </span>
            ) },
          { key: "entityName", label: "Entity", width: 150, filter: "select", get: (r) => r.entityName || "" },
          { key: "entityId", label: "Entity Id", width: 100, filter: "text", get: (r) => String(r.entityId ?? "") },
          { key: "actionDetails", label: "Details", width: 340, filter: "text", get: (r) => r.actionDetails || "" },
          { key: "createdAt", label: "Date", width: 190, filter: "text",
            get: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString() : ""),
            sortVal: (r) => (r.createdAt ? new Date(r.createdAt).getTime() : 0) },
        ]}
      />
    </div>
  );
}
