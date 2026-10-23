import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function LeaveActionPage() {

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [actionData, setActionData] = useState(null);

    // Supporting document fields
    const [documentType, setDocumentType] =
        useState("MEDICAL_CERTIFICATE");

    const [priority, setPriority] =
        useState("NORMAL");

    const [comments, setComments] =
        useState("");

    useEffect(() => {

        if (!token) {

            setError("Invalid action link.");
            setLoading(false);

            return;
        }

        validateToken();

    }, [token]);

    const validateToken = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/leave-action/validate?token=${encodeURIComponent(token)}`
            );

            setActionData(response.data);

        } catch (err) {

            console.error(
                "Token validation failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "This action link is invalid or has expired."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleApprove = async () => {

        try {

            setProcessing(true);
            setError("");

            const response = await api.post(
                `/leave-action/approve?token=${encodeURIComponent(token)}`
            );

            setSuccess(
                response.data?.message ||
                "Leave request approved successfully."
            );

            setActionData(null);

        } catch (err) {

            console.error(
                "Approve failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to approve the leave request."
            );

        } finally {

            setProcessing(false);

        }
    };

    const handleReject = async () => {

        try {

            setProcessing(true);
            setError("");

            const response = await api.post(
                `/leave-action/reject?token=${encodeURIComponent(token)}`
            );

            setSuccess(
                response.data?.message ||
                "Leave request rejected successfully."
            );

            setActionData(null);

        } catch (err) {

            console.error(
                "Reject failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to reject the leave request."
            );

        } finally {

            setProcessing(false);

        }
    };

    const handleRequestDocument = async () => {

        if (!comments.trim()) {

            setError(
                "Please enter comments for the supporting document request."
            );

            return;
        }

        try {

            setProcessing(true);
            setError("");
            setSuccess("");

            /*
             * The leave request ID must come
             * from the validated secure token.
             */
            const leaveRequestId =
                actionData?.leaveRequestId;

            if (!leaveRequestId) {

                setError(
                    "Leave request information is not available."
                );

                return;
            }

            const response = await api.post(
                `/leave-action/request-document?token=${encodeURIComponent(token)}`,
                {
                    leaveRequestId: leaveRequestId,
                    documentType: documentType,
                    priority: priority,
                    comments: comments.trim()
                }
            );

            setSuccess(
                response.data?.message ||
                "Supporting document request sent successfully."
            );

            /*
             * The REQUEST_DOCUMENT token is
             * single-use, so hide the form after
             * successful submission.
             */
            setActionData(null);

        } catch (err) {

            console.error(
                "Document request failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to request supporting document."
            );

        } finally {

            setProcessing(false);

        }
    };

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">

                <div className="bg-white rounded-xl shadow-md p-8 text-center">

                    <div className="text-lg font-semibold text-gray-800">
                        Validating action link...
                    </div>

                    <div className="text-sm text-gray-500 mt-2">
                        Please wait.
                    </div>

                </div>

            </div>
        );
    }

    if (error && !actionData) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

                <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">

                    <div className="text-4xl mb-4">
                        ⚠️
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">
                        Action Link Invalid
                    </h2>

                    <p className="text-gray-600 mt-3">
                        {error}
                    </p>

                    <p className="text-sm text-gray-400 mt-4">
                        The link may have expired or already been used.
                    </p>

                </div>

            </div>
        );
    }

    if (success && !actionData) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

                <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">

                    <div className="text-5xl mb-4">
                        ✅
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">
                        Action Completed
                    </h2>

                    <p className="text-gray-600 mt-3">
                        {success}
                    </p>

                    <p className="text-sm text-gray-400 mt-4">
                        You can close this page.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">

            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8">

                <div className="text-center mb-6">

                    <h1 className="text-2xl font-bold text-gray-800">
                        Leave Request Action
                    </h1>

                    <p className="text-gray-500 mt-2">
                        BOIT Global LeaveX
                    </p>

                </div>

                {actionData && (
                    <>

                        {/* Leave information */}

                        <div className="bg-gray-50 rounded-lg p-5 mb-6">

                            <div className="text-sm text-gray-500">
                                Employee
                            </div>

                            <div className="text-lg font-semibold text-gray-800">
                                {actionData.employeeName}
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                                Action
                            </div>

                            <div className="text-lg font-semibold text-gray-800">
                                {actionData.action}
                            </div>

                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4">
                                {error}
                            </div>
                        )}

                        {/* APPROVE */}

                        {actionData.action === "APPROVE" && (

                            <button
                                type="button"
                                disabled={processing}
                                onClick={handleApprove}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
                            >
                                {processing
                                    ? "Processing..."
                                    : "Approve Leave"}
                            </button>

                        )}

                        {/* REJECT */}

                        {actionData.action === "REJECT" && (

                            <button
                                type="button"
                                disabled={processing}
                                onClick={handleReject}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
                            >
                                {processing
                                    ? "Processing..."
                                    : "Reject Leave"}
                            </button>

                        )}

                        {/* REQUEST DOCUMENT */}

                        {actionData.action === "REQUEST_DOCUMENT" && (

                            <div>

                                <div className="mb-5">

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Document Type
                                    </label>

                                    <select
                                        value={documentType}
                                        onChange={(e) =>
                                            setDocumentType(
                                                e.target.value
                                            )
                                        }
                                        disabled={processing}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                                    >

                                        <option value="MEDICAL_CERTIFICATE">
                                            Medical Certificate
                                        </option>

                                        <option value="PRESCRIPTION">
                                            Prescription
                                        </option>

                                        <option value="HOSPITAL_BILL">
                                            Hospital Bill
                                        </option>

                                        <option value="LAB_REPORT">
                                            Lab Report
                                        </option>

                                        <option value="MATERNITY_DOCUMENT">
                                            Maternity Document
                                        </option>

                                        <option value="TRAVEL_DOCUMENT">
                                            Travel Document
                                        </option>

                                        <option value="OTHER">
                                            Other
                                        </option>

                                    </select>

                                </div>

                                <div className="mb-5">

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority
                                    </label>

                                    <select
                                        value={priority}
                                        onChange={(e) =>
                                            setPriority(
                                                e.target.value
                                            )
                                        }
                                        disabled={processing}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                                    >

                                        <option value="LOW">
                                            Low
                                        </option>

                                        <option value="NORMAL">
                                            Normal
                                        </option>

                                        <option value="HIGH">
                                            High
                                        </option>

                                        <option value="URGENT">
                                            Urgent
                                        </option>

                                    </select>

                                </div>

                                <div className="mb-5">

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Comments
                                    </label>

                                    <textarea
                                        value={comments}
                                        onChange={(e) =>
                                            setComments(
                                                e.target.value
                                            )
                                        }
                                        disabled={processing}
                                        rows={4}
                                        placeholder="Please provide the required supporting document..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                                    />

                                </div>

                                <button
                                    type="button"
                                    disabled={
                                        processing ||
                                        !comments.trim()
                                    }
                                    onClick={
                                        handleRequestDocument
                                    }
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
                                >
                                    {processing
                                        ? "Sending..."
                                        : "Request Supporting Document"}
                                </button>

                            </div>

                        )}

                    </>
                )}

            </div>

        </div>
    );
}