import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {

    X,

    Upload,

    UploadCloud,

    FileText,

    User,

    Calendar,

    ChevronDown,

    ChevronUp,
    
    Image

} from "lucide-react";

// import { useDropzone } from "react-dropzone";

import documentRequestService
from "../../services/documentRequestService";

import leaveDocumentService
from "../../services/leaveDocumentService";

import DocumentViewerModal
from "../common/DocumentViewerModal";

import LeaveTimeline
from "../common/LeaveTimeline";

import DragDropUpload
from "../common/DragDropUpload";

export default function EmployeeDocumentRequestModal({

    open,

    leaveRequestId,

    onClose,

    onUploaded

}) {

    const [requests,setRequests]=
    useState([]);

    const [uploadedDocuments, setUploadedDocuments] =
    useState([]);

const [viewerOpen, setViewerOpen] =
    useState(false);

const [documentUrl, setDocumentUrl] =
    useState(null);

const [selectedDocument, setSelectedDocument] =
    useState(null);

// const [selectedFile, setSelectedFile] =
//     useState(null);

    const [selectedFiles,setSelectedFiles]=
    useState({});

    const [loading,setLoading]=
    useState(false);

    const [showTimeline,
setShowTimeline] =
useState(false);

    useEffect(()=>{

        if(open){

            loadRequests();

        }

    },[open]);

    const loadRequests=async()=>{

        try{

            const response=

            await documentRequestService
            .getPendingByLeave(
                leaveRequestId
            );

            setRequests(
                response.data.data || []
            );

            const documentResponse =
    await leaveDocumentService
        .getDocuments(
            leaveRequestId
        );

setUploadedDocuments(
    documentResponse.data.data || []
);

        }

        catch(e){

            console.error(e);

        }

    };

    const handleFileChange=(

        id,

        file

    )=>{

        setSelectedFiles({

            ...selectedFiles,

            [id]:file

        });

    };

    const upload=(request)=>{

        if(!selectedFiles[request.id]){

            toast.error(
                "Please choose a file."
            );

            return;

        }

        uploadDocument(request);

    };

    const getPriorityBadge = (priority) => {

switch(priority){

case "LOW":
return "bg-green-100 text-green-700";

case "NORMAL":
return "bg-blue-100 text-blue-700";

case "HIGH":
return "bg-orange-100 text-orange-700";

case "URGENT":
return "bg-red-100 text-red-700";

default:
return "bg-slate-100 text-slate-700";

}

};


const getStatusBadge = (status)=>{

switch(status){

case "PENDING":
return "bg-yellow-100 text-yellow-700";

case "COMPLETED":
return "bg-green-100 text-green-700";

case "CANCELLED":
return "bg-red-100 text-red-700";

default:
return "bg-slate-100 text-slate-700";

}

};

const getDocumentStatusBadge = (status)=>{

switch(status){

case "REQUESTED":
return "bg-violet-100 text-violet-700";

case "UPLOADED":
return "bg-blue-100 text-blue-700";

case "VERIFIED":
return "bg-green-100 text-green-700";

case "REJECTED":
return "bg-red-100 text-red-700";

default:
return "bg-slate-100 text-slate-700";

}

};

const handleDownload = async(doc)=>{

    try{

        const response =
            await leaveDocumentService
                .downloadDocumentBlob(doc.id);

        const file =
            new Blob([response.data]);

        const url =
            URL.createObjectURL(file);

        const link =
            document.createElement("a");

        link.href=url;

        link.download=
            doc.originalFileName;

        link.click();

        URL.revokeObjectURL(url);

    }

    catch(error){

        console.error(error);

    }

};
    const uploadDocument=
    async(request)=>{

        try{

            setLoading(true);

            const formData=
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

                selectedFiles[request.id]

            );



                        await leaveDocumentService
                .uploadDocument(formData);

            toast.success(
                "Document uploaded successfully."
            );

            await loadRequests();

            if (onUploaded) {

                onUploaded();

            }

        }

        catch(e){

            console.error(e);

            toast.error(
                "Upload failed."
            );

        }

        finally{

            setLoading(false);

        }

    };

    const handleView = async (doc) => {

    try{

        const response =
            await leaveDocumentService
                .viewDocumentBlob(doc.id);

        const blob =
            new Blob(
                [response.data],
                {
                    type:
                        response.headers["content-type"]
                }
            );

        const url =
            URL.createObjectURL(blob);

        setDocumentUrl(url);

        setSelectedDocument(doc);

        setViewerOpen(true);

    }

    catch(error){

        console.error(error);

    }

};

// const onDrop = (acceptedFiles) => {

//     if (acceptedFiles.length > 0) {

//         setSelectedFile(
//             acceptedFiles[0]
//         );

//     }

// };

// const onDrop = (requestId) => (acceptedFiles) => {

//     if (acceptedFiles.length > 0) {

//         setSelectedFiles(prev => ({

//             ...prev,

//             [requestId]: acceptedFiles[0]

//         }));

//     }

// };

// const {

//     getRootProps,

//     getInputProps,

//     isDragActive

// } = useDropzone({

//     onDrop,

//     multiple: false,

//     maxSize: 10 * 1024 * 1024,

//     accept: {

//         "application/pdf": [".pdf"],

//         "image/*": [
//             ".png",
//             ".jpg",
//             ".jpeg"
//         ],

//         "application/msword": [
//             ".doc"
//         ],

//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
//             ".docx"
//         ]

//     }

// });

    if(!open){

        return null;

    }

    return(

<div
className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
z-50
flex
items-center
justify-center
"
>

<div
className="
bg-white
rounded-3xl
shadow-2xl
w-full
max-w-4xl
overflow-hidden
"
>

{/* Header */}

<div
className="
bg-violet-600
text-white
px-6
py-5
flex
justify-between
items-center
"
>

<div>

<h2
className="
text-2xl
font-bold
"
>

Requested Documents

</h2>

<p
className="
text-violet-100
text-sm
mt-1
"
>

Upload documents requested by your manager

</p>

</div>



<button

onClick={onClose}

className="
hover:bg-violet-700
rounded-lg
p-2
transition
"

>

<X size={22}/>

</button>

</div>

<div
className="
p-6
space-y-5
max-h-[70vh]
overflow-auto
"
>

{

requests.length===0 && (

<div
className="
text-center
py-10
text-slate-500
"
>

No pending document requests.

</div>

)

}

{

requests.map(request=>(

<div

key={request.id}

className="
rounded-2xl
border
border-slate-200
bg-white
shadow-sm
hover:shadow-lg
transition
p-6
"

>

<div className="space-y-6">

{/* Left */}

<div>

<div className="flex items-center gap-4 mb-5">

<div className="
w-14
h-14
rounded-xl
bg-violet-100
flex
items-center
justify-center
">

<FileText
size={28}
className="text-violet-600"
/>

</div>

<div>

<h3 className="font-bold text-xl">

{request.documentType?.replaceAll("_"," ")}

</h3>

<p className="text-slate-500">

Requested by

<b className="ml-1">

{request.requestedByName}

</b>

</p>

</div>

</div>

{/* Status Row */}

<div className="grid grid-cols-2 gap-4 mb-5">

<div>

<p className="text-xs text-slate-500 mb-2">

Priority

</p>

<span
className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(request.priority)}`}
>

{request.priority}

</span>

</div>

<div>

<p className="text-xs text-slate-500 mb-2">

Request Status

</p>

<span
className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(request.status)}`}
>

{request.status}

</span>

</div>

<div>

<p className="text-xs text-slate-500 mb-2">

Document Status

</p>

<span
className={`px-3 py-1 rounded-full text-xs font-semibold ${getDocumentStatusBadge(request.documentStatus)}`}
>

{request.documentStatus}

</span>

</div>

<div>

<p className="text-xs text-slate-500 mb-2">

Requested On

</p>

<p className="font-medium">

{

new Date(request.requestedAt)

.toLocaleString()

}

</p>

</div>

</div>

{/* Comments */}

<div className="
bg-slate-50
border
rounded-xl
p-4
">

<p className="font-semibold mb-2">

Manager Comments

</p>

<p className="text-slate-600">

{request.comments}

</p>

</div>

</div>

{/* Previously Uploaded */}

<div>

<h4 className="font-semibold mb-3">

Previously Uploaded Documents

</h4>

{
uploadedDocuments
.filter(doc =>
    doc.documentType === request.documentType
)
.map(doc => (

<div
key={doc.id}
className="
border
rounded-xl
p-4
mb-4
flex
justify-between
items-center
"
>

<div>

<p className="font-semibold">

{doc.originalFileName}

</p>

<p className="text-sm text-slate-500">

Status :
{doc.status}

</p>

</div>

<div className="flex gap-2">

<button
onClick={() => handleView(doc)}
className="
bg-violet-100
text-violet-700
px-3
py-2
rounded-lg
"
>

👁 View

</button>

<button
onClick={() => handleDownload(doc)}
className="
bg-green-100
text-green-700
px-3
py-2
rounded-lg
"
>

⬇ Download

</button>

</div>

</div>

))
}

</div>

{/* Right */}

<div>

<div
className="
border-2
border-dashed
border-violet-300
rounded-2xl
p-5
text-center
bg-violet-50
"
>

{/* <div

    {...getRootProps()}

    className={`

    border-2

    border-dashed

    rounded-2xl

    p-8

    text-center

    cursor-pointer

    transition

    ${

        isDragActive

            ? "border-violet-600 bg-violet-50"

            : "border-slate-300 hover:border-violet-500"

    }

`}

>

<input {...getInputProps()} />

<UploadCloud

    size={48}

    className="

    mx-auto

    text-violet-600

    mb-4

    "

/>

<h3 className="text-lg font-semibold">

    Drag & Drop File

</h3>

<p className="text-slate-500 mt-2">

    or click to browse

</p>

<p className="text-xs text-slate-400 mt-2">

    PDF, JPG, PNG, DOC, DOCX

</p>

</div> */}

<DragDropUpload

    file={
        selectedFiles[request.id]
    }

    onFileChange={(file)=>

        handleFileChange(

            request.id,

            file

        )

    }

/>

{/* {

selectedFiles && (

<div

className="

mt-6

border

rounded-xl

p-4

flex

justify-between

items-center

"

>

<div className="flex items-center gap-3">

<FileText
size={24}
className="text-violet-600"
/>

<div>

<div className="font-semibold">

{selectedFiles.name}

</div>

<div className="text-sm text-slate-500">

{

(selectedFiles.size / 1024 / 1024)

.toFixed(2)

} MB

</div>

</div>

</div>

<button

type="button"

onClick={() =>
setSelectedFiles(null)
}

className="text-red-500"

>

<X/>

</button>

</div>

)

}

{

selectedFiles[request.id] && (

<div
className="
bg-green-50
border
border-green-200
rounded-xl
p-3
text-sm
mb-4
"
>

<b>

Selected

</b>

<br/>

{

selectedFiles[request.id].name

}

</div>

)

}

<button

onClick={()=>upload(request)}

disabled={loading}

className="
w-full
bg-violet-600
hover:bg-violet-700
text-white
py-3
rounded-xl
font-semibold
flex
items-center
justify-center
gap-2
"

>

<Upload size={18}/>

{

loading

?

"Uploading..."

:

"Upload Document"

}

</button>

</div> */}

{/* {selectedFiles[request.id] && (

<div
className="
mt-4
border
rounded-xl
p-4
flex
justify-between
items-center
"
>

<div>

<p className="font-semibold">

{selectedFiles[request.id].name}

</p>

<p className="text-sm text-slate-500">

{(
selectedFiles[request.id].size /
1024 /
1024
).toFixed(2)} MB

</p>

</div>

<button
type="button"
onClick={() => {

const copy = {

...selectedFiles

};

delete copy[request.id];

setSelectedFiles(copy);

}}

className="text-red-500"

>

<X/>

</button>

</div>

)} */}

<button

onClick={()=>upload(request)}

disabled={loading}

className="
w-full
mt-4
bg-violet-600
hover:bg-violet-700
text-white
py-3
rounded-xl
"

>

Upload Document

</button>

</div>

</div>

</div>

</div>

))

}

</div>

{/* Activity Timeline */}

<div
className="
mx-6
mb-6
rounded-2xl
border
border-slate-200
overflow-hidden
"
>

<button

type="button"

onClick={() =>

setShowTimeline(

!showTimeline

)

}

className="
w-full
flex
justify-between
items-center
px-5
py-4
bg-slate-50
hover:bg-slate-100
transition
"

>

<div>

<h3
className="
font-bold
text-slate-800
"
>

📜 Activity Timeline

</h3>

<p
className="
text-sm
text-slate-500
mt-1
"
>

View complete activity history

</p>

</div>

{

showTimeline

?

<ChevronUp
size={22}
/>

:

<ChevronDown
size={22}
/>

}

</button>

{

showTimeline && (

<div
className="
bg-white
border-t
p-5
animate-fadeIn
"
>

<LeaveTimeline

leaveRequestId={
leaveRequestId
}

/>

</div>

)

}

</div>

{/* Footer */}

<div
className="
border-t
bg-slate-50
px-6
py-4
flex
justify-end
"
>

<button

onClick={onClose}

className="
px-6
py-3
rounded-xl
border
hover:bg-slate-100
transition
"

>

Close

</button>

</div>

</div>

<DocumentViewerModal

open={viewerOpen}

documentUrl={documentUrl}

fileName={
    selectedDocument?.originalFileName
}

contentType={
    selectedDocument?.contentType
}

onClose={() => {

    setViewerOpen(false);

    if(documentUrl){

        URL.revokeObjectURL(
            documentUrl
        );

    }

    setDocumentUrl(null);

    setSelectedDocument(null);

}}

/>

</div>



);

}