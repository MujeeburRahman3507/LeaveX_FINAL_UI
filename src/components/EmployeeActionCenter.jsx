import { useEffect, useState } from "react";

import {
    AlertTriangle,
    Upload,
    User,
    Calendar
} from "lucide-react";

import documentRequestService
from "../services/documentRequestService";

import EmployeeDocumentRequestModal
from "./leave/EmployeeDocumentRequestModal";

export default function EmployeeActionCenter() {

    const [actions, setActions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [leaveRequestId, setLeaveRequestId] =
        useState(null);

    useEffect(() => {

        loadActions();

    }, []);

    const loadActions = async () => {

        try {

            const response =
                await documentRequestService
                    .getEmployeeActions();

            setActions(
                response.data.data || []
            );

        } catch (e) {

            console.error(e);

        } finally {

            setLoading(false);

        }

    };

    const priorityBadge = (priority) => {

    switch(priority){

        case "URGENT":
            return `
                bg-red-100
                text-red-700
                dark:bg-red-900/40
                dark:text-red-300
            `;

        case "HIGH":
            return `
                bg-orange-100
                text-orange-700
                dark:bg-orange-900/40
                dark:text-orange-300
            `;

        case "NORMAL":
            return `
                bg-blue-100
                text-blue-700
                dark:bg-blue-900/40
                dark:text-blue-300
            `;

        case "LOW":
            return `
                bg-green-100
                text-green-700
                dark:bg-green-900/40
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
    if(loading){

        return null;

    }

    if(actions.length===0){

        return null;

    }

    return (
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

<div
className="
divide-y
"
>

{

actions.map(action=>(

<div

key={action.requestId}

className="
m-4
rounded-2xl
bg-white
dark:bg-slate-700
border
border-slate-200
dark:border-slate-600
p-6
flex
justify-between
items-center
gap-5
flex-wrap
shadow-sm
hover:shadow-lg
transition
"

>

<div>

<h3
className="
font-bold
text-lg
text-slate-900
dark:text-white
"
>

{action.documentType.replaceAll("_"," ")}

</h3>

<div
className="
flex
gap-4
mt-2
text-sm
text-slate-600
flex-wrap
"
>

<span
className={`
px-3
py-1
rounded-full
${priorityBadge(action.priority)}
`}
>

{action.priority}

</span>

{/* <span>

<User
size={15}
className="inline mr-1"
/>

{action.requestedBy}

</span>

<span>

<Calendar
size={15}
className="inline mr-1"
/>

{

new Date(
action.requestedAt
).toLocaleDateString()

}

</span> */}

<div
className="
flex
items-center
gap-5
mt-3
text-sm
text-slate-500
dark:text-slate-300
"
>

<div className="flex items-center gap-2">

<User size={15}/>

<span>{action.requestedBy}</span>

</div>

<div className="flex items-center gap-2">

<Calendar size={15}/>

<span>

{new Date(action.requestedAt).toLocaleDateString()}

</span>

</div>

</div>

</div>

{/* <p
className="
mt-3
text-slate-600
dark:text-slate-300
"
>

{action.comments}

</p> */}

<div
className="
mt-4
rounded-xl
bg-slate-100
dark:bg-slate-800
border
border-slate-200
dark:border-slate-600
p-4
"
>

<p
className="
text-sm
font-semibold
mb-2
text-slate-700
dark:text-slate-300
"
>
Manager Comments
</p>

<p
className="
text-slate-600
dark:text-slate-200
"
>
{action.comments}
</p>

</div>

</div>

<button

type="button"

onClick={()=>{

setLeaveRequestId(
action.leaveRequestId
);

setModalOpen(true);

}}

className="
bg-violet-600
hover:bg-violet-700
dark:bg-violet-500
dark:hover:bg-violet-600
text-white
px-5
py-3
rounded-xl
flex
items-start
gap-2
transition
shadow-md
hover:shadow-lg
"

>

<Upload size={18}/>

Upload Now

</button>

</div>

))

}

</div>

<EmployeeDocumentRequestModal

open={modalOpen}

leaveRequestId={leaveRequestId}

onClose={()=>{

setModalOpen(false);

setLeaveRequestId(null);

}}

onUploaded={()=>{

loadActions();

}}

 />

</div>

);

}