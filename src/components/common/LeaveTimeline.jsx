import { useEffect, useState } from "react";

import timelineService
from "../../services/timelineService";

import {

    CheckCircle2,

    XCircle,

    Upload,

    FileWarning,

    FilePlus,

    Info

} from "lucide-react";


export default function LeaveTimeline({

    leaveRequestId

}) {

    const [timeline, setTimeline] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (leaveRequestId) {

            loadTimeline();

        }

    }, [leaveRequestId]);

    const loadTimeline = async () => {

        try {

            const response =

                await timelineService
                    .getLeaveTimeline(
                        leaveRequestId
                    );

            setTimeline(

                response.data.data || []

            );

        }

        catch(error){

            console.error(error);

        }

        finally{

            setLoading(false);

        }

    };

    const getIcon = (icon) => {

    switch(icon){

        case "FILE_PLUS":

            return <FilePlus className="text-blue-600"/>;

        case "FILE_WARNING":

            return <FileWarning className="text-orange-500"/>;

        case "UPLOAD":

            return <Upload className="text-indigo-600"/>;

        case "CHECK":

            return <CheckCircle2 className="text-green-600"/>;

        case "CHECK_CIRCLE":

            return <CheckCircle2 className="text-green-600"/>;

        case "X":

            return <XCircle className="text-red-600"/>;

        case "X_CIRCLE":

            return <XCircle className="text-red-600"/>;

        default:

            return <Info className="text-slate-500"/>;

    }

};

const getColor = (color) => {

    switch(color){

        case "blue":

            return "border-blue-500";

        case "green":

            return "border-green-500";

        case "orange":

            return "border-orange-500";

        case "red":

            return "border-red-500";

        case "indigo":

            return "border-indigo-500";

        default:

            return "border-slate-300";

    }

};

if(loading){

    return (

        <div className="text-center py-5">

            Loading Timeline...

        </div>

    );

}

return(

<div className="space-y-5">

<h3
className="
text-lg
font-bold
text-slate-800
"
>

Activity Timeline

</h3>

{

timeline.length===0 && (

<div
className="
text-slate-500
"
>

No Activity Yet

</div>

)

}

{

timeline.map(item=>(

<div

key={item.actionDate}

className="
flex
gap-5
"

>

<div
className={`
w-12
h-12
rounded-full
border-2
flex
items-center
justify-center
${getColor(item.color)}
`}
>

{getIcon(item.icon)}

</div>

<div
className="
flex-1
pb-6
border-l
border-slate-200
pl-6
"
>

<h4
className="
font-semibold
"
>

{item.action}

</h4>

<p
className="
text-sm
text-slate-500
"
>

{item.performedBy}

</p>

{

item.comments && (

<p
className="
mt-2
text-slate-700
"
>

{item.comments}

</p>

)

}

<p
className="
mt-2
text-xs
text-slate-400
"
>

{

new Date(

item.actionDate

).toLocaleString()

}

</p>

</div>

</div>

))

}

</div>

);

}