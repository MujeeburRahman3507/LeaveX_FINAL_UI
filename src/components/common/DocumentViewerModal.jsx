import {
    X,
    Download,
    FileText,
    Image as ImageIcon
} from "lucide-react";

export default function DocumentViewerModal({

    open,

    onClose,

    documentUrl,

    fileName,

    contentType

}) {

    if (!open) return null;

    const isPdf =
        contentType?.includes("pdf");

    const isImage =

        contentType?.includes("image");

    return (

        <div
            className="
            fixed
            inset-0
            bg-black/70
            flex
            items-center
            justify-center
            z-50
            p-6
            "
        >

            <div
                className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-6xl
                h-[90vh]
                flex
                flex-col
                overflow-hidden
                "
            >

                {/* Header */}

                <div
                    className="
                    flex
                    justify-between
                    items-center
                    border-b
                    px-6
                    py-4
                    bg-slate-50
                    "
                >

                    <div
                        className="
                        flex
                        items-center
                        gap-3
                        "
                    >

                        {

                            isPdf

                                ?

                                <FileText
                                    size={26}
                                    className="text-red-600"
                                />

                                :

                                <ImageIcon
                                    size={26}
                                    className="text-blue-600"
                                />

                        }

                        <div>

                            <h2
                                className="
                                text-lg
                                font-bold
                                "
                            >

                                Document Preview

                            </h2>

                            <p
                                className="
                                text-sm
                                text-gray-500
                                "
                            >

                                {fileName}

                            </p>

                        </div>

                    </div>

                    <button

                        onClick={onClose}

                        className="
                        p-2
                        rounded-full
                        hover:bg-red-100
                        hover:text-red-600
                        transition
                        "

                    >

                        <X size={22}/>

                    </button>

                </div>

                {/* Viewer */}

                <div
                    className="
                    flex-1
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    overflow-auto
                    "
                >

                    {

                        isPdf && (

                            <iframe

                                src={documentUrl}

                                title="PDF Viewer"

                                className="
                                w-full
                                h-full
                                border-0
                                "

                            />

                        )

                    }

                    {

                        isImage && (

                            <img

                                src={documentUrl}

                                alt="Preview"

                                className="
                                max-w-full
                                max-h-full
                                object-contain
                                "

                            />

                        )

                    }

                    {

                        !isPdf && !isImage && (

                            <div
                                className="
                                text-center
                                p-10
                                "
                            >

                                <FileText
                                    size={70}
                                    className="
                                    mx-auto
                                    text-gray-400
                                    "
                                />

                                <h3
                                    className="
                                    mt-4
                                    text-lg
                                    font-semibold
                                    "
                                >

                                    Preview not available

                                </h3>

                                <p
                                    className="
                                    text-gray-500
                                    mt-2
                                    "
                                >

                                    This file type cannot be previewed.

                                </p>

                            </div>

                        )

                    }

                </div>

                {/* Footer */}

                <div
                    className="
                    border-t
                    bg-white
                    px-6
                    py-4
                    flex
                    justify-end
                    gap-3
                    "
                >

                    <a

                        href={documentUrl}

                        download={fileName}

                        className="
                        flex
                        items-center
                        gap-2
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-2
                        rounded-lg
                        transition
                        "

                    >

                        <Download size={18}/>

                        Download

                    </a>

                    <button

                        onClick={onClose}

                        className="
                        bg-gray-200
                        hover:bg-gray-300
                        px-5
                        py-2
                        rounded-lg
                        transition
                        "

                    >

                        Close

                    </button>

                </div>

            </div>

        </div>

    );

}