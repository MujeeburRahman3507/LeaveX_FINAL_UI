import { useEffect, useState } from "react";

import {
    AlertTriangle,
    Upload,
    CheckCircle2,
    Clock3,
    User
} from "lucide-react";

import toast from "react-hot-toast";

import documentRequestService
from "../../services/documentRequestService";

import leaveDocumentService
from "../../services/leaveDocumentService";

export default function RequestedDocuments() {

    const [requests, setRequests] =
        useState([]);

    const [selectedFiles, setSelectedFiles] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadRequests();

    }, []);

    const loadRequests = async () => {

        try {

            const response =
                await documentRequestService
                    .getEmployeePendingRequests();

            setRequests(
                response.data.data || []
            );

        } finally {

            setLoading(false);

        }

    };

    const handleFileChange = (
        requestId,
        file
    ) => {

        setSelectedFiles({

            ...selectedFiles,

            [requestId]: file

        });

    };

    const handleUpload = async (
        request
    ) => {

        const file =
            selectedFiles[request.id];

        if (!file) {

            toast.error(
                "Please choose a file."
            );

            return;

        }

        const formData =
            new FormData();

        formData.append(
            "leaveRequestId",
            request.leaveRequestId
        );

        formData.append(
            "documentType",
            request.documentType
        );

        formData.append(
            "remarks",
            "Uploaded against manager request"
        );

        formData.append(
            "file",
            file
        );

        try {

            await leaveDocumentService
                .uploadDocument(formData);

            toast.success(
                "Document uploaded successfully."
            );

            loadRequests();

        } catch (e) {

            toast.error(
                "Upload failed."
            );

        }

    };

    if (loading) {

        return (
            <div className="bg-white rounded-xl shadow p-6">
                Loading...
            </div>
        );

    }

    if (requests.length === 0) {

        return (

            <div className="bg-white rounded-2xl shadow p-8 text-center">

    <CheckCircle2
        size={60}
        className="mx-auto text-green-500 mb-4"
    />

    <h2 className="text-xl font-bold text-slate-700">

        No Pending Document Requests

    </h2>

    <p className="text-slate-500 mt-2">

        Your manager has not requested any additional documents.

    </p>

</div>

);

}

return (

<div className="space-y-6">

<h2
className="
text-2xl
font-bold
text-slate-800
flex
items-center
gap-3
"
>

<AlertTriangle
className="text-amber-500"
/>

Requested Documents

</h2>

{

requests.map(request => (

<div

key={request.id}

className="
bg-white
rounded-2xl
border
border-amber-200
shadow-sm
hover:shadow-lg
transition
p-6
"

>

<div
className="
flex
justify-between
items-start
flex-wrap
gap-5
"
>

<div className="flex-1">

<div
className="
flex
items-center
gap-3
mb-4
"
>

<div
className="
w-12
h-12
rounded-xl
bg-amber-100
flex
items-center
justify-center
text-xl
"
>

📄

</div>

<div>

<h3
className="
font-bold
text-lg
"
>

{request.documentType?.replaceAll("_"," ")}

</h3>

<p
className="
text-sm
text-slate-500
"
>

Requested on

{

new Date(request.requestedAt)

.toLocaleDateString()

}

</p>

</div>

</div>

<div
className="
space-y-3
"
>

<div
className="
flex
items-center
gap-2
"
>

<User
size={18}
className="text-violet-600"
/>

<span
className="font-medium"
>

{request.requestedByName}

</span>

</div>

<div
className="
flex
items-start
gap-2
"
>

<Clock3
size={18}
className="text-amber-500 mt-1"
/>

<div>

<p
className="
font-semibold
text-sm
"
>

Manager Comments

</p>

<p
className="
text-slate-600
"
>

{request.comments}

</p>

</div>

</div>

</div>

</div>

<div
className="
w-full
md:w-80
space-y-4
"
>

<input

type="file"

className="
block
w-full
text-sm
"

onChange={(e)=>

handleFileChange(

request.id,

e.target.files[0]

)

}

/>

{

selectedFiles[request.id] && (

<div
className="
text-sm
text-green-600
"
>

Selected:

<b>

{" "}

{

selectedFiles[request.id].name

}

</b>

</div>

)

}

<button

type="button"

onClick={()=>

handleUpload(request)

}

className="
w-full
bg-violet-600
hover:bg-violet-700
text-white
rounded-xl
py-3
font-semibold
flex
justify-center
items-center
gap-2
transition
"

>

<Upload size={18}/>

Upload Document

</button>

</div>

</div>

</div>

))

}

</div>

);

}