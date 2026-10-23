import React, { useEffect, useState } from "react";
import {
  Bot,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  ShieldCheck,
  Stamp,
  QrCode,
  PenLine,
  Eye,
  Loader2,
  X,
} from "lucide-react";

import leaveDocumentService
from "../../services/leaveDocumentService";

export default function DocumentAiAnalysis({ documentId, fileName, onClose }) {
 
const [loading, setLoading] = useState(true);
const [analysis, setAnalysis] = useState(null);
const [status, setStatus] = useState("PENDING");
const [error, setError] = useState("");

useEffect(() => {
    let cancelled = false;
    let timerId;

    const fetchAnalysis = async () => {
        try {
            const response =
                await leaveDocumentService.getAiAnalysis(documentId);

            const result = response?.data?.data;

            if (cancelled) return;

            if (!result) {
                setError("No analysis status was returned by the server.");
                setLoading(false);
                return;
            }

            setStatus(result.status || "PENDING");
            setError("");

            if (result.status === "COMPLETED") {
                setAnalysis(result.analysis || null);
                setLoading(false);
            } else if (result.status === "FAILED") {
                setAnalysis(null);
                setError(
                    result.errorMessage ||
                    "AI analysis failed. Please check the backend logs."
                );
                setLoading(false);
            } else {
                setAnalysis(null);
                setLoading(true);

                timerId = setTimeout(fetchAnalysis, 3000);
            }
        } catch (err) {
            if (cancelled) return;

            console.error("Failed to fetch AI analysis:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to retrieve AI analysis status."
            );
            setLoading(false);
        }
    };

    fetchAnalysis();

    return () => {
        cancelled = true;
        clearTimeout(timerId);
    };
}, [documentId]);


  const getConfidenceClass = (score) => {
    if (score >= 80) {
      return "text-green-600 dark:text-green-400";
    }

    if (score >= 50) {
      return "text-yellow-600 dark:text-yellow-400";
    }

    return "text-red-600 dark:text-red-400";
  };

  const getRiskClass = (severity) => {
    switch (severity?.toUpperCase()) {
      case "HIGH":
        return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400";

      case "MEDIUM":
        return "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-400";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Document Analysis
              </h2>

              <p className="max-w-xl truncate text-sm text-gray-500 dark:text-gray-400">
                {fileName || "Uploaded document"}
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Content */}
        <div className="p-6">

{!analysis && !loading && !error && (
    <div className="rounded-xl border border-gray-200 p-8 text-center dark:border-gray-700">
        <FileSearch className="mx-auto h-10 w-10 text-purple-600" />

        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
            Analysis not available
        </h3>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No completed AI analysis is available for this document.
        </p>
    </div>
)}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">

              <Loader2 className="h-10 w-10 animate-spin text-purple-600" />

              <p className="mt-4 font-medium text-gray-900 dark:text-white">
               {status === "PENDING"
    ? "AI analysis is waiting to start..."
    : "AI is analyzing the document..."}
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please wait while AI reviews the uploaded document.
              </p>

            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">

              <div className="flex gap-3">

                <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">
                    Analysis failed
                  </p>

                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* Analysis Result */}
          {analysis && (
            <div className="space-y-6">

              {/* Summary */}
              <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">

                <div className="mb-4 flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <FileSearch className="h-5 w-5 text-purple-600" />

                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Document Summary
                    </h3>
                  </div>

                  <span
                    className={`text-lg font-bold ${getConfidenceClass(
                      analysis.confidenceScore
                    )}`}
                  >
                    {analysis.confidenceScore}%
                  </span>

                </div>

                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {analysis.summary || "No summary available."}
                </p>

              </div>

              {/* Document information */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-xs text-gray-500">
                    Document Type
                  </p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {analysis.documentType || "Unknown"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-xs text-gray-500">
                    Readable
                  </p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    {analysis.readable ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Yes
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        No
                      </>
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-xs text-gray-500">
                    Blur Level
                  </p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {analysis.blurLevel || "Unknown"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-xs text-gray-500">
                    Confidence
                  </p>
                  <p
                    className={`mt-1 font-semibold ${getConfidenceClass(
                      analysis.confidenceScore
                    )}`}
                  >
                    {analysis.confidenceScore}%
                  </p>
                </div>

              </div>

              {/* Detection */}
              <div>

                <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                  Document Detection
                </h3>

                <div className="grid gap-3 sm:grid-cols-3">

                  <DetectionCard
                    icon={<PenLine className="h-5 w-5" />}
                    label="Signature"
                    detected={analysis.signatureFound}
                  />

                  <DetectionCard
                    icon={<Stamp className="h-5 w-5" />}
                    label="Stamp"
                    detected={analysis.stampFound}
                  />

                  <DetectionCard
                    icon={<QrCode className="h-5 w-5" />}
                    label="QR Code"
                    detected={analysis.qrCodeFound}
                  />

                </div>

              </div>

              {/* Extracted Fields */}
              {analysis.extractedFields?.length > 0 && (
                <div>

                  <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Extracted Information
                  </h3>

                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">

                    <table className="w-full text-sm">

                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                            Field
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                            Value
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">
                            Confidence
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

                        {analysis.extractedFields.map((field, index) => (
                          <tr key={index}>

                            <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                              {field.fieldName}
                            </td>

                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              {field.value || "-"}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {Math.round(field.confidence)}%
                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>
              )}

              {/* Risks */}
              {analysis.risks?.length > 0 && (
                <div>

                  <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Risk Indicators
                  </h3>

                  <div className="space-y-2">

                    {analysis.risks.map((risk, index) => (
                      <div
                        key={index}
                        className={`rounded-xl border p-4 ${getRiskClass(
                          risk.severity
                        )}`}
                      >
                        <div className="flex items-start gap-3">

                          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                          <div>
                            <p className="font-semibold">
                              {risk.severity || "INFO"}
                            </p>

                            <p className="mt-1 text-sm">
                              {risk.message}
                            </p>
                          </div>

                        </div>
                      </div>
                    ))}

                  </div>

                </div>
              )}

              {/* Recommendation */}
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/20">

                <div className="flex items-start gap-3">

                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />

                  <div>

                    <h3 className="font-semibold text-purple-900 dark:text-purple-300">
                      AI Recommendation
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-purple-800 dark:text-purple-300">
                      {analysis.recommendation ||
                        "No recommendation provided."}
                    </p>

                  </div>

                </div>

              </div>

              {/* Disclaimer */}
              <div className="flex gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">

                <Eye className="h-4 w-4 shrink-0" />

                <p>
                  AI analysis is provided as decision-support information.
                  It does not verify document authenticity and does not
                  replace the manager's final review and decision.
                </p>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

function DetectionCard({ icon, label, detected }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-700">

      <div className="flex items-center gap-3">

        <div className="text-gray-500 dark:text-gray-400">
          {icon}
        </div>

        <span className="font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>

      </div>

      {detected ? (
        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          Found
        </span>
      ) : (
        <span className="text-sm text-gray-400">
          Not detected
        </span>
      )}

    </div>
  );
}