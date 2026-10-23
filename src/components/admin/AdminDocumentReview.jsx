import { useEffect, useState } from "react";

import {
    User,
    Calendar,
    Eye
} from "lucide-react";

import documentRequestService
    from "../../services/documentRequestService";

    import LeaveDocuments from "../leave/LeaveDocuments";

export default function AdminDocumentReview({

    onReview

}) {

const [actions, setActions] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedLeaveRequestId, setSelectedLeaveRequestId] = useState(null);

    useEffect(() => {

        loadActions();

    }, []);

    const loadActions = async () => {

        try {

            const response =
                await documentRequestService
                    .getAdminActions();

            setActions(
                response.data.data || []
            );

        }

        catch (e) {

            console.error(e);

        }

        finally {

            setLoading(false);

        }

    };

    const priorityColor = (priority) => {

        switch (priority) {

            case "URGENT":

                return "bg-red-600 text-white";

            case "HIGH":

                return "bg-orange-500 text-white";

            case "NORMAL":

                return "bg-blue-500 text-white";

            default:

                return "bg-slate-500 text-white";

        }

    };

    if (loading) {

        return null;

    }

    if (actions.length === 0) {

        return (
            <div
                className="
                    bg-white
                    dark:bg-slate-800
                    rounded-3xl
                    shadow-lg
                    border
                    border-slate-200
                    dark:border-slate-700
                    p-6
                "
            >

                <h2
                    className="
                        text-xl
                        font-bold
                        text-slate-800
                        dark:text-white
                    "
                >
                    📄 Documents Waiting Review
                </h2>

                <p
                    className="
                        text-slate-500
                        dark:text-slate-400
                        mt-2
                    "
                >
                    No documents are currently waiting for review.
                </p>

            </div>
        );

    }

    return (

        <div
            className="
                bg-white
                dark:bg-slate-800
                rounded-3xl
                shadow-lg
                border
                border-slate-200
                dark:border-slate-700
            "
        >

            {/* Header */}

            <div
                className="
                    px-6
                    py-4
                    border-b
                    bg-gradient-to-r
                    from-green-600
                    to-emerald-600
                    text-white
                    flex
                    justify-between
                    items-center
                "
            >

                <div>

                    <h2
                        className="
                            text-xl
                            font-bold
                        "
                    >
                        📄 Documents Waiting Review
                    </h2>

                    <p
                        className="
                            text-green-100
                            text-sm
                        "
                    >
                        Manager uploaded documents awaiting verification
                    </p>

                </div>

                <span
                    className="
                        bg-white/20
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-semibold
                    "
                >
                    {actions.length} Pending
                </span>

            </div>

            {/* Body */}

            <div
                className={`
                    divide-y
                    overflow-y-auto
                    ${actions.length > 4
                        ? "max-h-[350px]"
                        : ""}
                `}
            >
{actions.map(action => (

    <div key={action.requestId}>

        {/* Document request row */}

        <div
            className="
                flex
                justify-between
                items-center
                px-6
                py-5
                hover:bg-slate-50
                dark:hover:bg-slate-700
                transition
            "
        >

            {/* Left */}

            <div className="flex items-center gap-5">

                <div
                    className="
                        w-14
                        h-14
                        rounded-full
                        bg-violet-100
                        text-violet-700
                        font-bold
                        flex
                        items-center
                        justify-center
                        text-lg
                    "
                >
                    {action.employeeName
                        ?.split(" ")
                        .map(x => x[0])
                        .join("")
                        .substring(0, 2)}
                </div>

                <div>

                    <h3
                        className="
                            font-bold
                            text-lg
                            text-slate-800
                            dark:text-white
                        "
                    >
                        {action.employeeName}
                    </h3>

                    <p
                        className="
                            text-slate-500
                            dark:text-slate-400
                            text-sm
                        "
                    >
                        {action.documentType?.replaceAll("_", " ")}
                    </p>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            mt-2
                            flex-wrap
                        "
                    >

                        <span
                            className={`
                                px-2
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                ${priorityColor(action.priority)}
                            `}
                        >
                            {action.priority}
                        </span>

                        <span className="text-xs text-slate-500">
                            <User
                                size={14}
                                className="inline mr-1"
                            />
                            {action.uploadedBy}
                        </span>

                        <span className="text-xs text-slate-500">
                            <Calendar
                                size={14}
                                className="inline mr-1"
                            />
                            {action.uploadedAt
                                ? new Date(
                                    action.uploadedAt
                                ).toLocaleString()
                                : "-"}
                        </span>

                    </div>

                </div>

            </div>

            {/* Review button */}

            <button
                type="button"
                onClick={() => {

                    setSelectedLeaveRequestId(
                        selectedLeaveRequestId === action.leaveRequestId
                            ? null
                            : action.leaveRequestId
                    );

                }}
                className="
                    bg-violet-600
                    hover:bg-violet-700
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                    flex
                    items-center
                    gap-2
                "
            >

                <Eye size={18} />

                {selectedLeaveRequestId === action.leaveRequestId
                    ? "Close"
                    : "Review"}

            </button>

        </div>


        {/* Document review */}

        {selectedLeaveRequestId === action.leaveRequestId && (

            <div
                className="
                    border-t
                    border-slate-200
                    dark:border-slate-700
                    bg-slate-50
                    dark:bg-slate-900/40
                    px-6
                    py-6
                "
            >

                <LeaveDocuments
                    leaveRequestId={
                        action.leaveRequestId
                    }
                />

            </div>

        )}

    </div>

))}

            </div>

        </div>

    );

}