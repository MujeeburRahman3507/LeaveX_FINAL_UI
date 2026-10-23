import { useState } from "react";
import axios from "axios";
import {
    Brain,
    ShieldCheck,
    AlertTriangle,
    Loader2,
    BadgeCheck
} from "lucide-react";

export default function AiDocumentPanel({ file, onAnalysisComplete }) {

    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    if (!file) return null;

    const analyzeDocument = async () => {

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append("file", file);

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/ai/analyze-document`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setAnalysis(response.data);

            if (onAnalysisComplete) {
                onAnalysisComplete(response.data);
            }

        } catch (e) {

            console.error(e);

            alert("AI Analysis failed.");

        } finally {

            setLoading(false);

        }

    };

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

            <div className="p-4 border-b flex items-center gap-2">

                <Brain className="text-indigo-600"/>

                <h3 className="font-semibold">

                    AI Document Intelligence

                </h3>

            </div>

            <div className="p-5">

                {!analysis && (

                    <button

                        onClick={analyzeDocument}

                        disabled={loading}

                 className="
w-full
bg-indigo-600
hover:bg-indigo-700
text-white
py-3
rounded-xl
font-semibold
flex
justify-center
items-center
gap-2
transition
"

                    >

                        {loading &&

                            <Loader2
                                className="animate-spin"
                                size={18}
                            />

                        }

                        Analyze Document

                    </button>

                )}

                {analysis && (

                    <>
<div
    className="
    space-y-4
    mt-2
    "
>

                   <InfoRow
    title="Document Type"
    value={analysis.documentType}
/>

<InfoRow
    title="Confidence"
    value={`${analysis.confidenceScore}%`}
/>

<InfoRow
    title="Readable"
    value={analysis.readable ? "Yes" : "No"}
/>

<InfoRow
    title="Blur Level"
    value={analysis.blurLevel}
/>
                        </div>

                        <div className="mt-5">

                            <h4 className="font-semibold mb-2">

                                Recommendation

                            </h4>
<div className="mt-6">

    <h4 className="font-semibold text-slate-800 dark:text-white mb-3">

        AI Recommendation

    </h4>

    <div
        className="
        rounded-xl
        border
        border-green-200
        bg-green-50
        dark:bg-green-900/20
        p-4
        "
    >

        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">

            {analysis.recommendation}

        </p>

    </div>

</div>

                        </div>

                        <div
className="
rounded-xl
border
p-4
mt-5
">

<h4 className="font-semibold mb-3">

Verification Results

</h4>

<div className="space-y-3">

    <Status
        ok={analysis.signatureFound}
        text="Doctor Signature"
    />

    <Status
        ok={analysis.stampFound}
        text="Official Stamp"
    />

    <Status
        ok={analysis.qrCodeFound}
        text="QR Code"
    />

</div>

</div>

                    </>

                )}

            </div>

        </div>

    );

}

function Info({ title, value }) {

    return (

        <div className="rounded-lg border p-3">

            <div className="text-sm text-slate-500">

                {title}

            </div>

            <div className="font-semibold mt-1">

                {value}

            </div>

        </div>

    );

}

function Status({ ok, text }) {

    return (
<div
    className="
    flex
    items-center
    justify-between
    rounded-lg
    bg-slate-50
    dark:bg-slate-900
    px-4
    py-3
    "
>

            {ok ? (

                <BadgeCheck
                    className="text-green-600"
                    size={18}
                />

            ) : (

                <AlertTriangle
                    className="text-yellow-600"
                    size={18}
                />

            )}
<span className="font-medium">

    {text}

</span>

<span
    className={
        ok
            ? "text-green-600 font-semibold"
            : "text-yellow-600 font-semibold"
    }
>

    {ok ? "Found" : "Not Found"}

</span>
        </div>

        

    );

 

}

   function InfoRow({ title, value }) {

    return (

  <div
    className="
    flex
    justify-between
    items-center
    py-3
    border-b
    last:border-0
    "
>

       <span className="text-slate-500 dark:text-slate-400">

                {title}

            </span>

  <span className="font-semibold text-slate-800 dark:text-white">

                {value}

            </span>

        </div>

    );

}