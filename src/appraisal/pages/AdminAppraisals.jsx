import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataGrid from "../../components/DataGrid";
import { getAllAppraisals } from "../services/appraisalService";

const getStatusClass = (status) => {
  switch (status) {
    case "FINALIZED":
      return "bg-green-100 text-green-700";
    case "HR_REVIEW":
      return "bg-purple-100 text-purple-700";
    case "HR_SUBMITTED":
      return "bg-indigo-100 text-indigo-700";
    case "MANAGER_SUBMITTED":
      return "bg-blue-100 text-blue-700";
    case "MANAGER_REVIEW":
      return "bg-yellow-100 text-yellow-700";
    case "EMPLOYEE_SUBMITTED":
      return "bg-orange-100 text-orange-700";
    case "IN_PROGRESS":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AdminAppraisals = () => {
  const navigate = useNavigate();
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppraisals = async () => {
    try {
      setLoading(true);
      const data = await getAllAppraisals();
      setAppraisals(data || []);
    } catch (error) {
      console.error("Failed to load appraisals:", error);
      alert(error?.response?.data?.message || "Failed to load appraisals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppraisals();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-300">
        Loading appraisals...
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-0 sm:p-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Performance Appraisal
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage employee performance appraisals and HR reviews.
        </p>
      </div>

      <DataGrid
        rows={appraisals}
        searchPlaceholder="Search employee, manager, cycle, status..."
        defaultSort={{ key: "employeeName", dir: "asc" }}
        chipsKey="status"
        actionWidth={110}
        emptyText="No employee appraisals found."
        renderActions={(appraisal) => (
          <button
            type="button"
            onClick={() => navigate(`/admin/appraisal/${appraisal.id}`)}
            className="rounded-md bg-violet-600 hover:bg-violet-700 px-4 py-1.5 text-[13px] font-medium text-white"
          >
            Review
          </button>
        )}
        columns={[
          { key: "employeeName", label: "Employee", width: 180, filter: "text",
            get: (a) => String(a.employeeName || a.employeeId || "") },
          { key: "managerName", label: "Manager", width: 160, filter: "text",
            get: (a) => String(a.managerName || a.managerId || "Not assigned") },
          { key: "cycleName", label: "Cycle", width: 190, filter: "select",
            get: (a) => String(a.cycleName || a.cycleId || "") },
          { key: "status", label: "Status", width: 190, filter: "select",
            get: (a) => a.status || "",
            render: (a) => (
              <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${getStatusClass(a.status)}`}>
                {a.status}
              </span>
            ) },
          { key: "employeeRating", label: "Employee Rating", width: 150, filter: "text",
            get: (a) => String(a.overallEmployeeRating ?? "") },
          { key: "managerRating", label: "Manager Rating", width: 150, filter: "text",
            get: (a) => String(a.overallManagerRating ?? "") },
          { key: "finalRating", label: "Final Rating", width: 130, filter: "text",
            get: (a) => String(a.finalRating ?? "") },
        ]}
      />
    </div>
  );
};

export default AdminAppraisals;
