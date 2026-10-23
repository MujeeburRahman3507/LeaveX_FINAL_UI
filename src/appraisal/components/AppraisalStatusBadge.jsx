const statusConfig = {
    DRAFT: {
        label: "Draft",
        className:
            "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    },

    GOALS_SUBMITTED: {
        label: "Goals Submitted",
        className:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    },

    GOALS_REVISION_REQUIRED: {
        label: "Revision Required",
        className:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    },

    GOALS_APPROVED: {
        label: "Goals Approved",
        className:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    },

    IN_PROGRESS: {
        label: "In Progress",
        className:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    },

    SELF_REVIEW: {
        label: "Self Review",
        className:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    },

    EMPLOYEE_SUBMITTED: {
        label: "Employee Submitted",
        className:
            "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
    },

    MANAGER_REVIEW: {
        label: "Manager Review",
        className:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
    },

    MANAGER_SUBMITTED: {
        label: "Manager Submitted",
        className:
            "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
    },

    HR_REVIEW: {
        label: "HR Review",
        className:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    },

    HR_SUBMITTED: {
        label: "HR Submitted",
        className:
            "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
    },

    FINALIZED: {
        label: "Finalized",
        className:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    },

    CANCELLED: {
        label: "Cancelled",
        className:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
    },

    SUBMITTED: {
        label: "Submitted",
        className:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    },

    REVISION_REQUIRED: {
        label: "Revision Required",
        className:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    },

    APPROVED: {
        label: "Approved",
        className:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    },

    COMPLETED: {
        label: "Completed",
        className:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    }
};

const AppraisalStatusBadge = ({ status }) => {

    const config =
        statusConfig[status] || {
            label: status || "Unknown",
            className:
                "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
        };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
};

export default AppraisalStatusBadge;