import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import leaveService from "../services/leaveService";
import LeaveDocuments from "./leave/LeaveDocuments";
import ApprovalGrid from "./ApprovalGrid";
import LeaveTimeline
from "./common/LeaveTimeline";
import RequestDocumentModal
from "./leave/RequestDocumentModal";

import {
    Calendar,
    Clock3,
    ChevronDown,
    ChevronUp,
    MessageSquare,
    CheckCircle2,
    XCircle,
    FileText,
    AlertTriangle,
    ShieldCheck,
    Clock,
    CircleAlert
} from "lucide-react";

export default function ApprovalBasket({ adminMode = false }) {

    const [approvalError, setApprovalError] =
    useState(null);

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [comments, setComments] = useState({});

const [expandedRequest, setExpandedRequest] = useState(null);

const [selectedRequestId, setSelectedRequestId] = useState(null);

const [highlightRequest,
setHighlightRequest] =
useState(null);

        const [expandedTimeline,
setExpandedTimeline] =
useState(null);

        const [requestModalOpen,
setRequestModalOpen] =
useState(false);

const [selectedLeaveRequest,
setSelectedLeaveRequest] =
useState(null);

// =====================================================
// SLA DASHBOARD COUNTS
// =====================================================

const pendingApprovalsCount =
    requests.length;

const slaBreachedCount =
    requests.filter(
        request => request.slaStatus === "BREACHED"
    ).length;

const slaWarningCount =
    requests.filter(
        request => request.slaStatus === "WARNING"
    ).length;

const slaWithinCount =
    requests.filter(
        request => request.slaStatus === "WITHIN_SLA"
    ).length;

const overdueTodayCount =
    requests.filter(request => {

        if (!request.slaDueAt) {
            return false;
        }

        const dueDate = new Date(request.slaDueAt);
        const today = new Date();

        return (
            dueDate.toDateString() === today.toDateString()
            &&
            dueDate < today
        );

    }).length;

    // opened from the Document Review page: jump to that request
    const routerLocation = useLocation();
    useEffect(() => {
        const id = routerLocation.state?.reviewLeaveRequestId;
        if (!loading && id && window.reviewLeaveRequest) {
            window.reviewLeaveRequest(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);


    useEffect(() => {

        loadRequests();

    }, []);

    const loadRequests = async () => {

        try {

const response = adminMode
    ? await leaveService.getAdminPendingApprovals()
    : await leaveService.getPendingRequests();

setRequests(
    response.data.data || []
);

        } finally {

            setLoading(false);

        }

    };

//     useEffect(() => {

//     loadRequests();

// }, []);

useEffect(() => {

   window.reviewLeaveRequest = (id) => {

    setSelectedRequestId(id);

    setExpandedRequest(id);

    setExpandedTimeline(id);

    setHighlightRequest(id);

    setTimeout(() => {

        setHighlightRequest(null);

    }, 300);

};

    return () => {

        delete window.reviewLeaveRequest;

    };

}, []);

   const handleApprove = async (id) => {

    try {

        let response;

        if (adminMode) {

            response = await leaveService.approveAdminLeave({
                requestId: id,
                managerComments:
                    comments[id] || "Approved"
            });

        } else {

            response = await leaveService.approveLeave({
                requestId: id,
                managerComments:
                    comments[id] || "Approved"
            });

        }

        if (response?.data?.success === false) {

            throw new Error(
                response.data.message ||
                "Unable to approve the leave request."
            );

        }

        loadRequests();

    } catch (error) {

        console.error(
            "Leave approval failed:",
            error
        );

        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Unable to approve the leave request.";

        setApprovalError(message);

    }

};

const handleReject = async (id) => {

    if (adminMode) {

        await leaveService.rejectAdminLeave({
            requestId: id,
            managerComments:
                comments[id] || "Rejected"
        });

    } else {

        await leaveService.rejectLeave({
            requestId: id,
            managerComments:
                comments[id] || "Rejected"
        });

    }

    loadRequests();

};

    const getInitials = (name) => {

        if (!name) return "?";

        return name

            .split(" ")

            .map(word => word[0])

            .join("")

            .substring(0, 2)

            .toUpperCase();

    };

    const getLeaveBadgeColor = (leaveType) => {

        switch (leaveType) {

            case "MEDICAL":

                return "bg-red-100 text-red-700";

            case "CASUAL":

                return "bg-blue-100 text-blue-700";

            case "EARNED":

                return "bg-green-100 text-green-700";

            default:

                return "bg-slate-100 text-slate-700";

        }

    };

    const getSlaStatusDisplay = (status) => {

    switch (status) {

        case "BREACHED":
            return {
                label: "Breached",
                className:
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            };

        case "WARNING":
            return {
                label: "Warning",
                className:
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
            };

        case "WITHIN_SLA":
            return {
                label: "Within SLA",
                className:
                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            };

        default:
            return {
                label: "Not Available",
                className:
                    "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            };
    }
};

    if (loading) {

        return (

            

           <div className="
bg-white
dark:bg-slate-800
rounded-xl
shadow
p-6
text-slate-800
dark:text-white
">

                Loading Pending Requests...

            </div>

        );

    }

   

    return (

      <>

{/* =====================================================
    SLA SUMMARY CARDS
===================================================== */}

<div
    className={`
        grid
        grid-cols-2 keep-grid
        lg:grid-cols-4
        gap-3 sm:gap-5
    `}
>

    

    {/* SLA BREACHED */}

    <div className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        border
        border-red-200
        dark:border-red-900/50
        shadow-sm
        p-3 sm:p-5
        relative
        overflow-hidden
    ">

        <div className="
            flex
            items-start
            justify-between gap-2
        ">

            <div>

                <p className="
                    text-xs sm:text-sm
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                ">
                    SLA Breached
                </p>

                <p className="
                    text-2xl sm:text-3xl
                    font-bold
                    text-red-600
                    dark:text-red-400
                    mt-2
                ">
                    {slaBreachedCount}
                </p>

                <p className="
                    text-[10px] sm:text-xs
                    text-slate-500
                    dark:text-slate-400
                    mt-1 leading-tight
                ">
                    Requests past SLA
                </p>

            </div>

            <div className="
                metric-icon-sm w-8 h-8 sm:w-11 sm:h-11
                rounded-xl
                bg-red-100
                dark:bg-red-900/30
                flex
                items-center
                justify-center
            ">

                <AlertTriangle
                    size={22}
                    className="text-red-600 dark:text-red-400"
                />

            </div>

        </div>

        <div className="
            absolute
            bottom-0
            left-0
            right-0
            h-1
            bg-red-500
        "/>

    </div>


    {/* SLA WARNING */}

    

    <div className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        border
        border-yellow-200
        dark:border-yellow-900/50
        shadow-sm
        p-3 sm:p-5
        relative
        overflow-hidden
    ">

        <div className="
            flex
            items-start
            justify-between gap-2
        ">

            <div>

                <p className="
                    text-xs sm:text-sm
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                ">
                    SLA Warning
                </p>

                <p className="
                    text-2xl sm:text-3xl
                    font-bold
                    text-yellow-600
                    dark:text-yellow-400
                    mt-2
                ">
                    {slaWarningCount}
                </p>

                <p className="
                    text-[10px] sm:text-xs
                    text-slate-500
                    dark:text-slate-400
                    mt-1 leading-tight
                ">
                    Approaching SLA deadline
                </p>

            </div>

            <div className="
                metric-icon-sm w-8 h-8 sm:w-11 sm:h-11
                rounded-xl
                bg-yellow-100
                dark:bg-yellow-900/30
                flex
                items-center
                justify-center
            ">

                <Clock
                    size={22}
                    className="text-yellow-600 dark:text-yellow-400"
                />

            </div>

        </div>

        <div className="
            absolute
            bottom-0
            left-0
            right-0
            h-1
            bg-yellow-400
        "/>

    </div>


    {/* WITHIN SLA */}

    <div className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        border
        border-green-200
        dark:border-green-900/50
        shadow-sm
        p-3 sm:p-5
        relative
        overflow-hidden
    ">

        <div className="
            flex
            items-start
            justify-between gap-2
        ">

            <div>

                <p className="
                    text-xs sm:text-sm
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                ">
                    Within SLA
                </p>

                <p className="
                    text-2xl sm:text-3xl
                    font-bold
                    text-green-600
                    dark:text-green-400
                    mt-2
                ">
                    {slaWithinCount}
                </p>

                <p className="
                    text-[10px] sm:text-xs
                    text-slate-500
                    dark:text-slate-400
                    mt-1 leading-tight
                ">
                    Requests on track
                </p>

            </div>

            <div className="
                metric-icon-sm w-8 h-8 sm:w-11 sm:h-11
                rounded-xl
                bg-green-100
                dark:bg-green-900/30
                flex
                items-center
                justify-center
            ">

                <ShieldCheck
                    size={22}
                    className="text-green-600 dark:text-green-400"
                />

            </div>

        </div>

        <div className="
            absolute
            bottom-0
            left-0
            right-0
            h-1
            bg-green-500
        "/>

    </div>


    {/* OVERDUE TODAY */}

    <div className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        border
        border-orange-200
        dark:border-orange-900/50
        shadow-sm
        p-3 sm:p-5
        relative
        overflow-hidden
    ">

        <div className="
            flex
            items-start
            justify-between gap-2
        ">

            <div>

                <p className="
                    text-xs sm:text-sm
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                ">
                    Overdue Today
                </p>

                <p className="
                    text-2xl sm:text-3xl
                    font-bold
                    text-orange-600
                    dark:text-orange-400
                    mt-2
                ">
                    {overdueTodayCount}
                </p>

                <p className="
                    text-[10px] sm:text-xs
                    text-slate-500
                    dark:text-slate-400
                    mt-1 leading-tight
                ">
                    Due today and past time
                </p>

            </div>

            <div className="
                metric-icon-sm w-8 h-8 sm:w-11 sm:h-11
                rounded-xl
                bg-orange-100
                dark:bg-orange-900/30
                flex
                items-center
                justify-center
            ">

                <CircleAlert
                    size={22}
                    className="text-orange-600 dark:text-orange-400"
                />

            </div>

        </div>

        <div className="
            absolute
            bottom-0
            left-0
            right-0
            h-1
            bg-orange-500
        "/>

    </div>

</div>

<h2
className="
text-2xl
font-bold
text-slate-800
  dark:text-white
"
>

Pending Approval Requests

</h2>

{selectedRequestId === null && requests.length > 0 && (
  <ApprovalGrid
    requests={requests}
    getSlaStatusDisplay={getSlaStatusDisplay}
    getLeaveBadgeColor={getLeaveBadgeColor}
    onView={(request) => {
      setSelectedRequestId(request.id);
      setExpandedRequest(request.id);
      setExpandedTimeline(null);
    }}
  />
)}

{

requests.length===0 && (

<div
className="
bg-white
dark:bg-slate-800
rounded-xl
shadow
p-10
text-center
text-slate-500
dark:text-slate-400
"
>

No Pending Requests

</div>



)

}
{selectedRequestId !== null && (
<div className="mb-4">

    <button
        type="button"
        onClick={() => {

            setSelectedRequestId(null);
            setExpandedRequest(null);
            setExpandedTimeline(null);

        }}
        className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            border
            border-slate-300
            dark:border-slate-600
            text-slate-700
            dark:text-slate-200
            hover:bg-slate-100
            dark:hover:bg-slate-700
            transition
        "
    >
        ← Back to Requests
    </button>

</div>

)}
{
requests
    .filter(request =>
        selectedRequestId === request.id
    )
    .map(request => (

        

<div


id={`approval-${request.id}`}

key={request.id}

className={`
bg-white
dark:bg-slate-800
flex flex-col rounded-3xl
border
shadow-md
transition-all
duration-500

${highlightRequest===request.id
? "ring-4 ring-violet-400"
: "border-slate-200 dark:border-slate-700"
}
`}
>

{/* Header */}

<div className="p-4 sm:p-6">

<div
className="
flex flex-col lg:flex-row
lg:justify-between
items-start gap-4
"
>

{/* Employee */}

<div
className="
flex
items-center
gap-3 sm:gap-5
"
>

<div
className="
w-12 h-12 sm:w-16 sm:h-16 shrink-0
rounded-full
bg-gradient-to-r
from-violet-600
to-indigo-600
text-white
font-bold
text-xl
flex
items-center
justify-center
shadow-lg
"
>

{

getInitials(

request.employeeName

)

}

</div>

<div>

<h2
className="
text-xl
font-bold
text-slate-800
dark:text-white
"
>

{

request.employeeName

}

</h2>

{request.department && (<p className="text-slate-500 dark:text-slate-400">{request.department}</p>)}

<div
className="
flex
gap-2
mt-3
flex-wrap
"
>

<span

className={

`px-3 py-1 rounded-full text-xs font-semibold ${getLeaveBadgeColor(request.leaveType)}`

}

>

{

request.leaveType

}

<span
    className="
        bg-violet-100
        text-violet-700
        dark:bg-violet-900/40
        dark:text-violet-300
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
    "
>
    {request.durationType === "FIRST_HALF"
        ? "First Half (Morning)"
        : request.durationType === "SECOND_HALF"
            ? "Second Half (Afternoon)"
            : "Full Day"}
</span>
</span>

<span
className="
bg-yellow-100
text-yellow-700
px-3
py-1
rounded-full
text-xs
font-semibold
"
>

Pending

</span>

</div>

</div>

</div>

{/* Right */}

<div
className="
grid
grid-cols-3
gap-2 sm:gap-4 w-full lg:w-auto keep-grid
"
>

<div
className="
bg-slate-50
dark:bg-slate-700
rounded-xl
p-2 sm:p-4
text-center
sm:min-w-[110px]
"
>

<Calendar
size={18}
className="
mx-auto
text-violet-600
mb-2
"
/>

<p
className="
text-xs
text-slate-500
"
>

FROM

</p>

<p
className="
font-semibold
mt-1
"
>

{

request.startDate

}

</p>

</div>

<div
className="
bg-slate-50
dark:bg-slate-700
rounded-xl
p-2 sm:p-4
text-center
sm:min-w-[110px]
"
>

<Calendar
size={18}
className="
mx-auto
text-violet-600
mb-2
"
/>

<p
className="
text-xs
text-slate-500
"
>

TO

</p>

<p
className="
font-semibold
mt-1
"
>

{

request.endDate

}

</p>

</div>

<div
className="
bg-violet-50
dark:bg-violet-950/40
rounded-xl
p-2 sm:p-4
text-center
sm:min-w-[110px]
"
>

<Clock3
size={18}
className="
mx-auto
text-violet-600
mb-2
"
/>

<p
className="
text-xs
text-slate-500
"
>

DURATION

</p>

<p
className="
font-bold
text-violet-700
mt-1
"
>

{

request.totalDays

}

</p>

<p
    className="
        text-xs
        text-slate-500
    "
>
    {request.durationType === "FIRST_HALF"
        ? "First Half"
        : request.durationType === "SECOND_HALF"
            ? "Second Half"
            : "Day(s)"}
</p>

</div>

</div>

</div>

</div>

{/* Reason */}

<div
className="
mx-3 sm:mx-6
mb-5
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-700/50
p-5
"
>

<div
className="
flex
items-center
gap-2
mb-3
"
>

<span>

📝

</span>

<h3
className="
font-semibold
"
>

Reason

</h3>

</div>

<p
className="
text-slate-700
dark:text-slate-200
leading-7
"
>

{

request.reason

}

</p>

</div>

{/* Backup Person */}
<div
  className="
    mx-3 sm:mx-6
    mb-5
    rounded-xl
    border
    border-indigo-200
    dark:border-indigo-800
    bg-indigo-50
    dark:bg-indigo-950/30
    p-5
  "
>
  <div className="flex items-center gap-2 mb-2">
    <span>👤</span>
    <h3 className="font-semibold text-slate-800 dark:text-white">
      Backup Person
    </h3>
  </div>

  <p className="text-slate-700 dark:text-slate-200">
    {request.backupPersonName || "Not assigned"}
  </p>
</div>
```

{/* Documents */}

<div
className="
mx-3 sm:mx-6
mb-5
rounded-2xl
border
border-violet-200
dark:border-violet-800
bg-gradient-to-r
from-violet-50
to-indigo-50
dark:from-violet-950/40
dark:to-indigo-950/40
overflow-hidden
"
>

<div

onClick={()=>setExpandedRequest(

expandedRequest===request.id

? null

: request.id

)}

className="
flex
justify-between
items-center
p-5
cursor-pointer
hover:bg-violet-100
dark:hover:bg-violet-900/40
transition
"
>

<div
className="
flex
items-center
gap-4
"
>

<div
className="
w-12
h-12
rounded-xl
bg-violet-600
text-white
flex
items-center
justify-center
text-xl
"
>

📎

</div>

<div>

<h3
className="
font-bold
"
>

Supporting Documents

</h3>

<p
className="
text-sm
text-slate-500
dark:text-slate-400
"
>

Click to review employee documents

</p>

</div>

</div>

<div
className="
flex
items-center
gap-3
"
>

<span
className="
bg-violet-600
text-white
px-3
py-1
rounded-full
text-xs
font-semibold
"
>

View

</span>

{

expandedRequest===request.id

?

<ChevronUp/>

:

<ChevronDown/>

}

</div>

</div>

{

// expandedRequest===request.id && (

// <div
// className="
// border-t
// bg-white
// p-5
// "
// >

// <LeaveDocuments

// leaveRequestId={request.id}

// />

// </div>

// )

// expandedRequest===request.id && (

// <div
// className="
// border-t
// bg-white
// p-5
// space-y-6
// "
// >

// <LeaveDocuments

// leaveRequestId={request.id}

// />

// <div
// className="
// rounded-2xl
// border
// border-slate-200
// bg-slate-50
// p-5
// "
// >

// <LeaveTimeline

// leaveRequestId={request.id}

// />

// </div>

// </div>

// )


expandedRequest===request.id && (

<div
className="
border-t
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
p-5
"
>

<LeaveDocuments

leaveRequestId={request.id}

/>

</div>

)
}



{/* Timeline */}

<div
className="
mx-3 sm:mx-6
mb-5
rounded-2xl
border
border-slate-200
dark:border-slate-700
overflow-hidden
"
>

<button

type="button"

onClick={()=>

setExpandedTimeline(

expandedTimeline===request.id

? null

: request.id

)

}

className="
w-full
flex
justify-between
items-center
bg-slate-50
dark:bg-slate-700
hover:bg-slate-100
dark:hover:bg-slate-600
px-5
py-4
transition
"

>

<div>

<h3
className="
font-bold
text-slate-800
dark:text-white
"
>

📜 Activity Timeline

</h3>

<p
className="
text-sm
text-slate-800
dark:text-white
"
>

View leave activity history

</p>

</div>

{

expandedTimeline===request.id

?

<ChevronUp/>

:

<ChevronDown/>

}

</button>

{

expandedTimeline===request.id && (

<div
className="
bg-white
dark:bg-slate-800
border-t
border-slate-200
dark:border-slate-700
p-5
animate-fadeIn
"
>

<LeaveTimeline

leaveRequestId={request.id}

/>

</div>

)

}

</div>
</div>

{/* Manager Comments */}

<div className="order-[-2] px-3 sm:px-6 py-4">

    <label
        className="
        flex
        items-center
        gap-2
        font-semibold
      text-slate-700
dark:text-slate-200
        mb-3
        "
    >

        <MessageSquare size={18} />

        Manager Comments

    </label>

    <textarea

        rows="4"

        placeholder="Enter approval/rejection comments..."

   className="
w-full
border
border-slate-300
dark:border-slate-600
rounded-xl
p-4
resize-none
bg-white
dark:bg-slate-700
text-slate-800
dark:text-white
placeholder:text-slate-400
focus:outline-none
focus:ring-2
focus:ring-violet-500
focus:border-violet-500
transition
"

        value={comments[request.id] || ""}

        onChange={(e)=>

            setComments({

                ...comments,

                [request.id]:e.target.value

            })

        }

    />

</div>

{/* Footer */}

<div
className="
order-[-3] rounded-t-3xl border-b
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-700
px-3 sm:px-6
py-4 sm:py-5
flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
"
>

<div
className="
text-sm
text-slate-500
dark:text-slate-400
"
>

Request #

<b>

{request.id}

</b>

</div>

<div
className="
flex
gap-2 sm:gap-3
flex-wrap w-full sm:w-auto
"
>

{/* <button

type="button"

className="
flex-1 sm:flex-none justify-center flex
items-center
gap-2
bg-amber-500
hover:bg-amber-600
text-white
px-3 sm:px-5
py-3
rounded-xl
font-medium
transition
shadow-sm
"

>

<FileText size={18}/>

Request Documents

</button> */}

<button

type="button"

onClick={() => {

  console.log("Request Document clicked", request.id);

    setSelectedLeaveRequest(

        request.id

    );

    setRequestModalOpen(true);

}}

className="
flex-1 sm:flex-none justify-center flex
items-center
gap-2
bg-amber-500
hover:bg-amber-600
text-white
px-3 sm:px-5
py-3
rounded-xl
transition
"

>

<FileText size={18}/>

Request Documents

</button>

<button

type="button"

onClick={()=>

handleReject(

request.id

)

}

className="
flex-1 sm:flex-none justify-center flex
items-center
gap-2
bg-red-600
hover:bg-red-700
text-white
px-3 sm:px-5
py-3
rounded-xl
font-medium
transition
shadow-sm
"

>

<XCircle size={18}/>

Reject

</button>

<button

type="button"

onClick={()=>

handleApprove(

request.id

)

}

className="
flex-1 sm:flex-none justify-center flex
items-center
gap-2
bg-green-600
hover:bg-green-700
text-white
px-3 sm:px-5
py-3
rounded-xl
font-medium
transition
shadow-sm
"

>

<CheckCircle2 size={18}/>

Approve

</button>

</div>

</div>

</div>

))

}




<RequestDocumentModal

    open={requestModalOpen}

    leaveRequestId={selectedLeaveRequest}

    onClose={() => {

        setRequestModalOpen(false);

        setSelectedLeaveRequest(null);

    }}

    onSuccess={() => {

        loadRequests();

    }}

/>


{approvalError && (

    <div className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        px-4
    ">

        <div className="
            w-full
            max-w-md
            bg-white
            dark:bg-slate-800
            rounded-2xl
            shadow-2xl
            border
            border-red-200
            dark:border-red-900/50
            overflow-hidden
        ">

            {/* Header */}

            <div className="
                px-6
                py-5
                border-b
                border-slate-200
                dark:border-slate-700
                flex
                items-center
                gap-3
            ">

                <div className="
                    w-11
                    h-11
                    rounded-full
                    bg-red-100
                    dark:bg-red-900/30
                    flex
                    items-center
                    justify-center
                ">

                    <AlertTriangle
                        size={24}
                        className="
                            text-red-600
                            dark:text-red-400
                        "
                    />

                </div>

                <div>

                    <h3 className="
                        text-lg
                        font-semibold
                        text-slate-800
                        dark:text-white
                    ">

                        Approval Failed

                    </h3>

                    <p className="
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    ">

                        The leave request could not be approved.

                    </p>

                </div>

            </div>


            {/* Message */}

            <div className="px-6 py-5">

                <div className="
                    rounded-xl
                    bg-red-50
                    dark:bg-red-900/20
                    border
                    border-red-200
                    dark:border-red-900/40
                    p-4
                ">

                    <p className="
                        text-sm
                        text-red-700
                        dark:text-red-300
                        leading-6
                    ">

                        {approvalError}

                    </p>

                </div>

            </div>


            {/* Footer */}

            <div className="
                px-6
                py-4
                bg-slate-50
                dark:bg-slate-900/40
                flex
                justify-end
            ">

                <button
                    type="button"
                    onClick={() =>
                        setApprovalError(null)
                    }
                    className="
                        px-5
                        py-2.5
                        rounded-lg
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        font-medium
                        transition
                    "
                >

                    OK

                </button>

            </div>

        </div>

    </div>

)}

</>

);




}