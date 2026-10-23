import { useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
    ImageIcon,
    FileText
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function FilePreview({ file }) {

    const [numPages, setNumPages] = useState(0);

    if (!file) return null;

    const fileUrl = useMemo(
        () => URL.createObjectURL(file),
        [file]
    );

    const isImage =
        file.type.startsWith("image");

    const isPdf =
        file.type === "application/pdf";

    return (

        <div
            className="
            h-full
            rounded-2xl
            border
            border-slate-200
            bg-white
            dark:bg-slate-800
            shadow-sm
            overflow-hidden
            "
        >

            {/* Header */}

            <div
                className="
                px-5
                py-4
                border-b
                bg-slate-50
                dark:bg-slate-900
                flex
                items-center
                gap-3
                "
            >

                {isImage ? (

                    <ImageIcon
                        className="text-blue-600"
                        size={22}
                    />

                ) : (

                    <FileText
                        className="text-red-600"
                        size={22}
                    />

                )}

                <h3 className="font-semibold">

                    Document Preview

                </h3>

            </div>

            {/* Body */}

            <div
                className="
                flex
                justify-center
                items-center
                p-6
                bg-slate-100
                dark:bg-slate-900
                min-h-[550px]
                "
            >

                {isImage && (

                    <img

                        src={fileUrl}

                        alt="Preview"

                        className="
                        max-h-[500px]
                        max-w-full
                        rounded-xl
                        shadow-lg
                        object-contain
                        bg-white
                        border
                        "

                    />

                )}

                {isPdf && (

                    <div className="overflow-auto">

                        <Document

                            file={fileUrl}

                            onLoadSuccess={({ numPages }) =>

                                setNumPages(numPages)

                            }

                        >

                            <Page

                                pageNumber={1}

                                width={450}

                            />

                        </Document>

                        <p
                            className="
                            text-center
                            text-sm
                            text-slate-500
                            mt-4
                            "
                        >

                            Page 1 of {numPages}

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}