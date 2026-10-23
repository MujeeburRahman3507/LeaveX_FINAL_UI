import React, { useEffect, useState } from "react";
import { saveBlob, isNativeApp } from "../../utils/fileDownload";
import {
  uploadAppraisalDocument,
  getAppraisalDocuments,
  deleteAppraisalDocument,
} from "../services/appraisalService";

import { FileText } from "lucide-react";
import api from "../../services/api";

const AppraisalDocuments = ({
  appraisalId,
  goalId = null,
  title = "Supporting Documents",
  canDelete = true,
  canUpload = true,
}) => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const data = goalId
        ? await getGoalDocuments(goalId)
        : await getAppraisalDocuments(appraisalId);

      setDocuments(data || []);
    } catch (error) {
      console.error(
        "Failed to load appraisal documents:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appraisalId || goalId) {
      loadDocuments();
    }
  }, [appraisalId, goalId]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    // Backend currently allows a maximum of 10 MB.
    if (file.size > 10 * 1024 * 1024) {
      alert("File size cannot exceed 10 MB.");
      return;
    }

    try {
      setUploading(true);

      await uploadAppraisalDocument({
        appraisalId: Number(appraisalId),
        goalId: goalId ? Number(goalId) : null,
        file,
        documentType: documentType.trim() || null,
        remarks: remarks.trim() || null,
      });

      setFile(null);
      setDocumentType("");
      setRemarks("");

      // Reset file input
      const fileInput =
        document.getElementById(
          `appraisal-document-file-${appraisalId}-${goalId || "appraisal"}`
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await loadDocuments();

      alert("Document uploaded successfully.");
    } catch (error) {
      console.error(
        "Failed to upload document:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleView = async (documentId) => {
  try {
    const response = await api.get(
      `/appraisal/documents/${documentId}/view`,
      {
        responseType: "blob",
      }
    );

    const contentType =
      response.headers["content-type"] ||
      "application/octet-stream";

    const blob = new Blob(
      [response.data],
      { type: contentType }
    );

    if (isNativeApp()) {
      await saveBlob(blob, `appraisal-document-${documentId}`);
      return;
    }

    const url = window.URL.createObjectURL(blob);

    window.open(url, "_blank");

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 60000);

  } catch (error) {
    console.error(
      "Failed to view document:",
      error
    );

    alert(
      error?.response?.data?.message ||
        "Unable to view document."
    );
  }
};

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(documentId);

      await deleteAppraisalDocument(documentId);

      await loadDocuments();

      alert("Document deleted successfully.");
    } catch (error) {
      console.error(
        "Failed to delete document:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (size) => {
    if (!size) {
      return "-";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  return (
    <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
            {documents.length > 0 && (
              <span className="ml-2 align-middle rounded-full bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
                {documents.length}
              </span>
            )}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload supporting documents related to this appraisal.
          Maximum file size: 10 MB.
        </p>
      </div>

   {/* Upload Form - Employee Only */}
{canUpload && (
  <form
    onSubmit={handleUpload}
    className="mb-6 rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30"
  >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* File */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Document
            </label>

            <input
              id={`appraisal-document-file-${appraisalId}-${goalId || "appraisal"}`}
              type="file"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              disabled={uploading}
              className="block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:file:bg-gray-600"
            />

            <p className="mt-1 text-xs text-gray-500">
              Supported documents are subject to the backend's
              configured file-type validation.
            </p>
          </div>

          {/* Document Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Document Type
            </label>

            <input
              type="text"
              value={documentType}
              onChange={(e) =>
                setDocumentType(e.target.value)
              }
              placeholder="e.g. Certificate, Achievement"
              disabled={uploading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Remarks
            </label>

            <input
              type="text"
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              placeholder="Optional remarks"
              disabled={uploading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full sm:w-auto rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : "Upload Document"}
          </button>
        </div>
     </form>
)}

      {/* Document List */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Uploaded Documents
        </h3>

        {loading ? (
          <div className="py-6 text-center text-sm text-gray-500">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 sm:p-6 text-center text-sm text-gray-500 dark:border-gray-600">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="space-y-3">

            {documents.map((document) => (
              <div
                key={document.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white break-words">
                      {document.originalFileName || document.fileName || "Document"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {document.documentType && (
                        <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 font-medium text-gray-700 dark:text-gray-200">
                          {document.documentType}
                        </span>
                      )}
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatFileSize(document.fileSize)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatDate(document.createdAt)}
                      </span>
                    </div>

                    {document.remarks && (
                      <p className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-700/40 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 break-words">
                        {document.remarks}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => handleView(document.id)}
                    className="flex-1 md:flex-none rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    View
                  </button>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(document.id)}
                      disabled={deletingId === document.id}
                      className="flex-1 md:flex-none rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-900/20"
                    >
                      {deletingId === document.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default AppraisalDocuments;