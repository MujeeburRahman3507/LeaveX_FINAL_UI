import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X } from "lucide-react";
import FilePreview from "./FilePreview";
// import AiDocumentPanel from "../ai/AiDocumentPanel"  ;

export default function DragDropUpload({
    file,
    onFileChange
}) {

    const onDrop = (acceptedFiles) => {

        if (acceptedFiles.length > 0) {

            onFileChange(
                acceptedFiles[0]
            );

        }

    };

    const {

        getRootProps,

        getInputProps,

        isDragActive

    } = useDropzone({

        onDrop,

        multiple: false,

        maxSize: 10 * 1024 * 1024,

        accept: {

            "application/pdf": [".pdf"],

            "image/*": [
                ".jpg",
                ".jpeg",
                ".png"
            ],

            "application/msword": [".doc"],

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]

        }

    });

    return (

        <>

        <div

            {...getRootProps()}

            className={`
            border-2
            border-dashed
            rounded-xl
            p-6
            cursor-pointer
            text-center
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
                className="mx-auto text-violet-600"
            />

         <h3 className="text-lg font-semibold mt-3">

Drag & Drop your document here

</h3>

<p className="text-sm text-slate-500 mt-2">

or click to browse

</p>

<p className="text-xs text-slate-400 mt-2">

Supported:
PDF • JPG • PNG • DOC • DOCX

(Max 10 MB)

</p>
        </div>

 {file && (

<div
className="
mt-6
rounded-2xl
border
border-slate-200
bg-white
dark:bg-slate-800
shadow-md
overflow-hidden
">

    {/* File Header */}

    <div
        className="
        flex
        justify-between
        items-center
        px-6
        py-4
        border-b
        bg-slate-50
        dark:bg-slate-900
        "
    >

        <div className="flex items-center gap-3">

            <FileText
                size={24}
                className="text-violet-600"
            />

            <div>

                <h3 className="font-semibold text-slate-800 dark:text-white">

                    {file.name}

                </h3>

                <p className="text-sm text-slate-500">

                    {(file.size / 1024 / 1024).toFixed(2)} MB

                </p>

            </div>

        </div>

        <button

            onClick={() => onFileChange(null)}

            className="
            p-2
            rounded-lg
            hover:bg-red-100
            text-red-500
            transition
            "

        >

            <X size={18}/>

        </button>

    </div>

    {/* Workspace */}

    <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-8
        p-6
        items-start
        "
    >

        <FilePreview file={file}/>

        {/* <AiDocumentPanel
            file={file}
            onAnalysisComplete={(result)=>{

                console.log(result);

            }}
        /> */}

    </div>

</div>

)}

        </>

    );

}