import { useEffect, useState } from "react";
import leaveService from "../services/leaveService";
import LeaveGrid from "./LeaveGrid";
import EmployeeDocumentRequestModal
from "./leave/EmployeeDocumentRequestModal";

export default function LeaveTable({
  refreshTrigger,
  managerMode = false
}) {

  const [rows,
    setRows] =
    useState([]);

    const [documentModalOpen,
setDocumentModalOpen] =
useState(false);

const [selectedLeaveRequest,
setSelectedLeaveRequest] =
useState(null);

  const [loading,
    setLoading] =
    useState(true);

    const [statusFilter, setStatusFilter] =
  useState("ALL");

const [searchText, setSearchText] =
  useState("");

useEffect(() => {
  loadLeaves();
}, [refreshTrigger, managerMode]);

  const loadLeaves =
    async () => {

      try {

        // const response =
        //   await leaveService
        //     .getMyLeaves();

        // setRows(
        //   response.data.data || []
        // );
const response = managerMode
  ? await leaveService.getManagerMyLeaves()
  : await leaveService.getMyLeaves();

console.log(
  "LEAVE HISTORY RESPONSE",
  response
);

setRows(
  response.data?.data ||
  response.data ||
  []
);

      } finally {

        setLoading(false);
      }
    };

    const filteredRows = rows.filter(
  (leave) => {

    const statusMatch =
      statusFilter === "ALL" ||
      leave.status === statusFilter;

    const searchMatch =
      leave.leaveType
        ?.toLowerCase()
        .includes(
          searchText.toLowerCase()
        );

    return (
      statusMatch &&
      searchMatch
    );
  }
);

const getDocumentStatusBadge = (status) => {

    switch (status) {

        case "REQUESTED":
            return `
                bg-violet-100
                text-violet-700
                dark:bg-violet-900/40
                dark:text-violet-300
            `;

        case "UPLOADED":
            return `
                bg-blue-100
                text-blue-700
                dark:bg-blue-900/40
                dark:text-blue-300
            `;

        case "VERIFIED":
            return `
                bg-green-100
                text-green-700
                dark:bg-green-900/40
                dark:text-green-300
            `;

        case "REJECTED":
            return `
                bg-red-100
                text-red-700
                dark:bg-red-900/40
                dark:text-red-300
            `;

        default:
            return `
                bg-slate-100
                text-slate-700
                dark:bg-slate-700
                dark:text-slate-300
            `;
    }

};

const getPriorityBadge = (priority) => {

    switch (priority) {

        case "LOW":
            return `
                bg-green-100
                text-green-700
                dark:bg-green-900/40
                dark:text-green-300
            `;

        case "NORMAL":
            return `
                bg-blue-100
                text-blue-700
                dark:bg-blue-900/40
                dark:text-blue-300
            `;

        case "HIGH":
            return `
                bg-orange-100
                text-orange-700
                dark:bg-orange-900/40
                dark:text-orange-300
            `;

        case "URGENT":
            return `
                bg-red-100
                text-red-700
                dark:bg-red-900/40
                dark:text-red-300
            `;

        default:
            return `
                bg-slate-100
                text-slate-700
                dark:bg-slate-700
                dark:text-slate-300
            `;
    }

};

const handleCancelLeave =
  async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to cancel this leave request?"
      )
    ) {
      return;
    }

    try {

if (managerMode) {
  await leaveService.cancelManagerLeave(id);
} else {
  await leaveService.cancelLeave(id);
}

      await loadLeaves();

      alert(
        "Leave cancelled successfully"
      );

    } catch(error) {

      console.error(error);

      alert(
        "Unable to cancel leave"
      );
    }
};

  // const badgeClass =
  //   (status) => {

  //     switch (status) {

  //       case "APPROVED":
  //         return "bg-green-100 text-green-700";

  //       case "REJECTED":
  //         return "bg-red-100 text-red-700";

  //       default:
  //         return "bg-yellow-100 text-yellow-700";
  //     }
  //   };

  const badgeClass = (status) => {

    switch (status) {

        case "APPROVED":
            return `
                bg-green-100
                text-green-700
                dark:bg-green-900/40
                dark:text-green-300
            `;

        case "REJECTED":
            return `
                bg-red-100
                text-red-700
                dark:bg-red-900/40
                dark:text-red-300
            `;

        case "CANCELLED":
            return `
                bg-slate-200
                text-slate-700
                dark:bg-slate-700
                dark:text-slate-300
            `;

        default:
            return `
                bg-yellow-100
                text-yellow-700
                dark:bg-yellow-900/40
                dark:text-yellow-300
            `;
    }

};

  if (loading) {
    return (
      
      <div
className="
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
rounded-xl
shadow
border
border-slate-200
dark:border-slate-700
p-3 sm:p-6
"
>
        Loading...
      </div>
    );
  }

  return (
    <>
      <LeaveGrid
        title="My Leave Requests"
        rows={rows}
        badgeClass={badgeClass}
        getDocumentStatusBadge={getDocumentStatusBadge}
        getPriorityBadge={getPriorityBadge}
        onCancel={(leave) => handleCancelLeave(leave.id)}
        onDocuments={(leave) => {
          setSelectedLeaveRequest(leave.id);
          setDocumentModalOpen(true);
        }}
      />

      <EmployeeDocumentRequestModal

open={documentModalOpen}

leaveRequestId={selectedLeaveRequest}

onClose={() => {

    setDocumentModalOpen(false);

    setSelectedLeaveRequest(null);

}}

onUploaded={() => {

    loadLeaves();

}}

/>

</>
    
  );
  

}