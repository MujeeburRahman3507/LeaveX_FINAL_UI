import { useEffect, useState } from "react";

import {
    Upload,
    Eye,
    AlertTriangle
} from "lucide-react";

import documentRequestService
    from "../services/documentRequestService";

import EmployeeDocumentRequestModal
    from "./leave/EmployeeDocumentRequestModal";


export default function ManagerDocumentActionCenter() {

    const [actions, setActions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);

    const [leaveRequestId, setLeaveRequestId] =
        useState(null);


    useEffect(() => {

        loadActions();

    }, []);


    const loadActions = async () => {

        try {

            const response =
                await documentRequestService
                    .getManagerPendingActions();

            setActions(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Unable to load manager document actions:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    const priorityBadge = (priority) => {

        switch (priority) {

            case "URGENT":

                return `
                    bg-red-100
                    text-red-700
                    dark:bg-red-900/30
                    dark:text-red-300
                `;

            case "HIGH":

                return `
                    bg-orange-100
                    text-orange-700
                    dark:bg-orange-900/30
                    dark:text-orange-300
                `;

            case "NORMAL":

                return `
                    bg-blue-100
                    text-blue-700
                    dark:bg-blue-900/30
                    dark:text-blue-300
                `;

            case "LOW":

                return `
                    bg-green-100
                    text-green-700
                    dark:bg-green-900/30
                    dark:text-green-300
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


    if (loading) {

        return null;

    }


    if (actions.length === 0) {

        return null;

    }


    return (

        <div className="mb-8">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

   <div
className="
mb-8
rounded-3xl
border
border-orange-300
dark:border-orange-700
bg-orange-50
dark:bg-slate-800
overflow-hidden
shadow
transition-colors
duration-300
"
>

<div
className="
bg-orange-500
dark:bg-orange-700
text-white
px-6
py-4
flex
items-center
gap-4
transition-colors
"
>

<div
className="
w-12
h-12
rounded-xl
bg-white/20
flex
items-center
justify-center
"
>

<AlertTriangle size={26}/>

</div>

<div>
    
<h2
className="
text-xl
font-bold
"
>
Action Required
</h2>

<p
className="
text-orange-100
text-sm
mt-1
"
>

You have <b>{actions.length}</b> pending document request{actions.length > 1 ? "s" : ""}.

</p>

</div>

</div>

            </div>


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <div className="
                bg-white
                dark:bg-slate-800
                rounded-2xl
                shadow-md
                border
                border-slate-200
                dark:border-slate-700
                overflow-hidden
            ">

                <div className="overflow-x-auto">

                    <table className="action-first w-full text-sm">

                        {/* HEADER */}

                        <thead className="
                            bg-slate-50
                            dark:bg-slate-700
                            border-b
                            border-slate-200
                            dark:border-slate-600
                        ">

                            <tr>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    text-slate-600
                                    dark:text-slate-200
                                ">
                                    Document Type
                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    text-slate-600
                                    dark:text-slate-200
                                ">
                                    Priority
                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    text-slate-600
                                    dark:text-slate-200
                                ">
                                    Requested By
                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    text-slate-600
                                    dark:text-slate-200
                                ">
                                    Requested On
                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-center
                                    font-semibold
                                    text-slate-600
                                    dark:text-slate-200
                                ">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        {/* BODY */}

                        <tbody>

                            {actions.map(action => (

                                <tr
                                    key={action.requestId}
                                    className="
                                        border-b
                                        border-slate-100
                                        dark:border-slate-700
                                        hover:bg-violet-50
                                        dark:hover:bg-slate-700/50
                                        transition
                                    "
                                >

                                    {/* DOCUMENT TYPE */}

                                    <td className="px-5 py-4">

                                        <div className="
                                            font-semibold
                                            text-slate-800
                                            dark:text-white
                                        ">

                                            {action.documentType
                                                ?.replaceAll(
                                                    "_",
                                                    " "
                                                )}

                                        </div>

                                    </td>


                                    {/* PRIORITY */}

                                    <td className="px-5 py-4">

                                        <span
                                            className={`
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-semibold
                                                ${priorityBadge(
                                                    action.priority
                                                )}
                                            `}
                                        >

                                            {action.priority}

                                        </span>

                                    </td>


                                    {/* REQUESTED BY */}

                                    <td className="
                                        px-5
                                        py-4
                                        text-slate-700
                                        dark:text-slate-200
                                    ">

                                        {action.requestedBy}

                                    </td>


                                    {/* REQUESTED ON */}

                                    <td className="
                                        px-5
                                        py-4
                                        text-slate-600
                                        dark:text-slate-300
                                    ">

                                        {action.requestedAt
                                            ? new Date(
                                                action.requestedAt
                                            ).toLocaleString()
                                            : "-"
                                        }

                                    </td>


                                    {/* VIEW */}

                                    <td className="
                                        px-5
                                        py-4
                                        text-center
                                    ">

                                        <button
                                            type="button"
                                            onClick={() => {

                                                setLeaveRequestId(
                                                    action.leaveRequestId
                                                );

                                                setModalOpen(true);

                                            }}
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                px-4
                                                py-2
                                                rounded-lg
                                                bg-violet-600
                                                hover:bg-violet-700
                                                text-white
                                                font-medium
                                                transition
                                            "
                                        >

                                            <Eye size={17} />

                                            View

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ================================================= */}
            {/* EXISTING UPLOAD MODAL */}
            {/* ================================================= */}

            <EmployeeDocumentRequestModal

                open={modalOpen}

                leaveRequestId={leaveRequestId}

                onClose={() => {

                    setModalOpen(false);

                    setLeaveRequestId(null);

                }}

                onUploaded={() => {

                    loadActions();

                    setModalOpen(false);

                    setLeaveRequestId(null);

                }}

            />

        </div>

    );

}