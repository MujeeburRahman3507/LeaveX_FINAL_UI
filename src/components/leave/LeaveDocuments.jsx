import { useEffect, useState } from "react";

import { saveBlob, isNativeApp } from "../../utils/fileDownload";
import toast
from "react-hot-toast";


import {
    Eye,
    Download,
    FileText,
    Image as ImageIcon,
    FileSpreadsheet,
     CheckCircle2,
    XCircle,
    AlertCircle,
    File
} from "lucide-react";

import { Bot } from "lucide-react";

import leaveDocumentService
from "../../services/leaveDocumentService";

import DocumentViewerModal
from "../common/DocumentViewerModal";

import documentRequestService
from "../../services/documentRequestService";

import DocumentAiAnalysis from "../ai/DocumentAiAnalysis";

export default function LeaveDocuments({

    leaveRequestId

}) {

    const [

        documents,

        setDocuments

    ] = useState([]);

    const [
    documentRequests,
    setDocumentRequests
] = useState([]);

const [
    rejectingRequest,
    setRejectingRequest
] = useState(null);

const [
    rejectionComments,
    setRejectionComments
] = useState("");

    const [viewerOpen, setViewerOpen] =
    useState(false);

const [selectedDocument, setSelectedDocument] =
    useState(null);

const [documentUrl, setDocumentUrl] =
    useState(null);

    const [

        loading,

        setLoading

    ] = useState(true);

    useEffect(() => {

        if (leaveRequestId) {

            loadDocuments();

        }

    }, [leaveRequestId]);

    // const loadDocuments = async () => {

    //     try {

    //         const response =

    //             await leaveDocumentService
    //                 .getDocuments(
    //                     leaveRequestId
    //                 );

    //         setDocuments(

    //             response.data.data || []

    //         );

    //     } catch (error) {

    //         console.error(error);

    //     } finally {

    //         setLoading(false);

    //     }

    // };

    const loadDocuments = async () => {

    try {

        const [

            documentResponse,

            requestResponse

        ] = await Promise.all([

            leaveDocumentService.getDocuments(
                leaveRequestId
            ),

            documentRequestService.getRequests(
                leaveRequestId
            )

        ]);

        setDocuments(
            documentResponse.data.data || []
        );

        setDocumentRequests(
            requestResponse.data.data || []
        );

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }

};

const getPriorityColor = (priority) => {

    switch (priority) {

        case "URGENT":
            return "bg-red-600 text-white";

        case "HIGH":
            return "bg-orange-500 text-white";

        case "NORMAL":
            return "bg-yellow-500 text-white";

        case "LOW":
            return "bg-green-600 text-white";

        default:
            return "bg-slate-500 text-white";

    }

};

const getStatusColor = (status) => {

    switch (status) {

        case "REQUESTED":
            return "bg-yellow-100 text-yellow-700";

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
   const handleView = async (doc) => {

    try {

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

    } catch (error) {

        console.error(error);

    }

};

const handleDownload = async (id, fileName) => {

    try {

        const response =
            await leaveDocumentService
                .downloadDocumentBlob(id);

        if (isNativeApp()) {
            await saveBlob(new Blob([response.data]), fileName);
            return;
        }


        const file =
            new Blob([response.data]);

        const url =
            window.URL.createObjectURL(file);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

    } catch (e) {

        console.error(e);

    }

};

const handleVerify = async (requestId) => {

    try {

        await documentRequestService.verifyDocument(

            requestId

        );

        toast.success(

            "Document verified successfully."

        );

        loadDocuments();

    }

    catch(error){

        console.error(error);

        toast.error(

            "Unable to verify document."

        );

    }

};

const [analysisDocument, setAnalysisDocument] = useState(null);

const handleReject = async (requestId) => {

    const reason =

        prompt(

            "Enter rejection comments"

        );

    if(!reason){

        return;

    }

    try{

        await documentRequestService.rejectDocument(

            requestId,

            {

                rejectionComments:reason

            }

        );

        toast.success(

            "Document rejected."

        );

        loadDocuments();

    }

    catch(error){

        console.error(error);

        toast.error(

            "Unable to reject."

        );

    }

};

    const getIcon = (documentType) => {

        switch (documentType) {

            case "MEDICAL_CERTIFICATE":
            case "PRESCRIPTION":
            case "LAB_REPORT":

                return (
                    <FileText
                        className="text-red-500"
                        size={20}
                    />
                );

            case "HOSPITAL_BILL":

                return (
                    <FileSpreadsheet
                        className="text-green-600"
                        size={20}
                    />
                );

            case "IMAGE":

                return (
                    <ImageIcon
                        className="text-blue-500"
                        size={20}
                    />
                );

            default:

                return (
                    <File
                        className="text-slate-500"
                        size={20}
                    />
                );

        }

    };

    if (loading) {

        return (

            <div className="text-center py-6">

                Loading Documents...

            </div>

        );

    }

    if (documents.length === 0) {

        return (

     <div
className="
text-center
py-10
"
>

<div
className="
w-20
h-20
mx-auto
rounded-full
bg-slate-100
flex
items-center
justify-center
mb-4
"
>

📂

</div>

<h3
className="
font-semibold
text-slate-700
"
>

No Documents Uploaded

</h3>

<p
className="
text-slate-500
mt-2
"
>

Employee has not uploaded any supporting documents.

</p>

</div>

        );

    }

    return (

        <div className="space-y-4">

            <h3
                className="
                font-semibold
                text-lg
                "
            >

                Supporting Documents

            </h3>

            {

                documents.map(doc => {


const request = documentRequests.find(
    r => r.id === doc.documentRequestId
);

    return (

                    

                    <div

                        key={doc.id}

                        className="
                     rounded-2xl
border
border-slate-200
bg-white
shadow-sm
hover:shadow-md
transition
doc-card p-3 sm:p-5
                        flex flex-col lg:flex-row
                        lg:justify-between
                        lg:items-center gap-3
                        hover:bg-gray-50
                        transition
                        "

                    >

                        <div
                            className="
                            flex
                            items-start
                            gap-3 sm:gap-4 min-w-0
                            "
                        >

                            {getIcon(doc.documentType)}

                            <div>

                                <p
                                    className="
                                    font-semibold
                                    "
                                >

                                    {doc.documentType
                                        ?.replaceAll("_", " ")}

                                </p>

                                <p
                                    className="
                                    text-sm
                                    text-gray-500
                                    "
                                >

                                    {doc.originalFileName}

                                </p>

                                <p
                                    className="
                                    text-xs
                                    text-gray-400
                                    "
                                >

                                    {(doc.fileSize / 1024).toFixed(1)} KB

                                </p>

                                {request && (

<div className="flex gap-2 mt-3 flex-wrap">

<span
className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(request.priority)}`}
>

{request.priority}

</span>

<span
className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.documentStatus)}`}
>

{request.documentStatus}

</span>

</div>

)}

{request?.comments && (

<div
className="
mt-3
rounded-xl
bg-slate-50
border
p-3
"
>

<p
className="
text-xs
font-semibold
text-slate-500
mb-1
"
>

Manager Request

</p>

<p
className="
text-sm
text-slate-700
"
>

{request.comments}

</p>

</div>

)}

                            </div>

                        </div>

                        

                        <div
                            className="
                            doc-actions flex flex-wrap
                            gap-2 sm:gap-3
                            "
                        >

                            <button

                                type="button"

                           onClick={() =>
    handleView(doc)
}

                                //         leaveDocumentService
                                //             .viewDocument(doc.id),

                                //         "_blank"

                                //     )

                                // }

                                className="
                                flex
                                items-center
                                gap-2
                               bg-violet-100
hover:bg-violet-200
text-violet-700
                            
                                px-4
                                py-2
                                rounded-lg
                                hover:bg-blue-100
                                transition
                                "

                            >

                                <Eye size={18} />

                                View

                            </button>

                            <button
  type="button"
  onClick={() =>
    setAnalysisDocument({
      id: doc.id,
      fileName: doc.originalFileName,
    })
  }
  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40"
>
  <Bot className="h-3.5 w-3.5" />
  Analyze
</button>

                            <button

                                type="button"

                           onClick={() =>

handleDownload(

doc.id,

doc.originalFileName

)



                                }

                                className="
                                flex
                                items-center
                                gap-2
                             bg-emerald-100
hover:bg-emerald-200
text-emerald-700
                                px-4
                                py-2
                                rounded-lg
                                hover:bg-green-100
                                transition
                                "

                            >

                                <Download size={18} />

                                Download

                            </button>
                            {request?.documentStatus === "UPLOADED" && (

<>

<button

type="button"

onClick={()=>

handleVerify(

request.id

)

}

className="
flex
items-center
gap-2
bg-green-600
hover:bg-green-700
text-white
px-4
py-2
rounded-lg
"

>

<CheckCircle2 size={18}/>

Verify

</button>

<button

type="button"

onClick={()=>

handleReject(

request.id

)

}

className="
flex
items-center
gap-2
bg-red-600
hover:bg-red-700
text-white
px-4
py-2
rounded-lg
"

>

<XCircle size={18}/>

Reject

</button>

</>

)}

                        </div>

                    </div>

   );

})
            }

              <DocumentViewerModal

    open={viewerOpen}

    onClose={() => {

        setViewerOpen(false);

        if (documentUrl) {

            URL.revokeObjectURL(documentUrl);

        }

        setDocumentUrl(null);

        setSelectedDocument(null);

    }}

    documentUrl={documentUrl}

    fileName={
        selectedDocument?.originalFileName
    }

    contentType={
        selectedDocument?.contentType
    }

/>

{analysisDocument && (
  <DocumentAiAnalysis
    documentId={analysisDocument.id}
    fileName={analysisDocument.fileName}
    onClose={() => setAnalysisDocument(null)}
  />
)}

        </div>

    );

  

}