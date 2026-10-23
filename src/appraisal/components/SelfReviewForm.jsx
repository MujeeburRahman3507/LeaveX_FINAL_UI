import { useEffect, useState } from "react";
import {
    Star,
    Save,
    Send,
    Loader2
} from "lucide-react";

import {
    getEmployeeReview,
    saveEmployeeReview,
    submitEmployeeReview
} from "../services/appraisalService";

const SelfReviewForm = ({
    appraisalId,
    onSubmitted
}) => {

    const [rating, setRating] = useState("");
    const [comments, setComments] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadReview = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getEmployeeReview(
                    appraisalId
                );

            if (data) {

                setRating(
                    data.overallRating ?? ""
                );

                setComments(
                    data.overallComments || ""
                );
            }

        } catch (err) {

            if (
                err?.response?.status !== 404
            ) {

                console.error(err);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load self review."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadReview();
    }, [appraisalId]);

    const handleSave = async () => {

        setError("");
        setSuccess("");

        if (!rating) {
            setError(
                "Please select an overall rating."
            );
            return;
        }

        if (!comments.trim()) {
            setError(
                "Please enter your overall comments."
            );
            return;
        }

        try {

            setSaving(true);

            await saveEmployeeReview({
                appraisalId,
                overallRating:
                    Number(rating),
                overallComments:
                    comments.trim()
            });

            setSuccess(
                "Self review saved successfully."
            );

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to save self review."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleSubmit = async () => {

        if (!rating) {
            setError(
                "Please provide an overall rating."
            );
            return;
        }

        if (!comments.trim()) {
            setError(
                "Please provide your comments."
            );
            return;
        }

        const confirmed =
            window.confirm(
                "Once submitted, your self review will be sent to your manager. Continue?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            /*
             * Save latest changes first.
             */
            await saveEmployeeReview({
                appraisalId,
                overallRating:
                    Number(rating),
                overallComments:
                    comments.trim()
            });

            await submitEmployeeReview(
                appraisalId
            );

            setSuccess(
                "Self review submitted successfully."
            );

            onSubmitted?.();

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to submit self review."
            );

        } finally {

            setSaving(false);

        }
    };

    if (loading) {

        return (
            <div className="flex justify-center py-10">
                <Loader2 className="w-7 h-7 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">

                <div className="flex items-center gap-3">

                    <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">

                        <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />

                    </div>

                    <div>

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Self Review
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Reflect on your performance during this appraisal cycle.
                        </p>

                    </div>

                </div>

            </div>


            <div className="p-4 sm:p-5 space-y-6">

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 rounded-lg bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 text-sm">
                        {success}
                    </div>
                )}


                {/* Rating */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Overall Performance Rating *
                    </label>

                    <div className="flex items-center gap-2">

                        {[1, 2, 3, 4, 5].map(value => (

                            <button
                                key={value}
                                type="button"
                                onClick={() =>
                                    setRating(value)
                                }
                                className="p-2"
                                title={`${value} out of 5`}
                            >

                                <Star
                                    className={`w-8 h-8 ${
                                        Number(rating) >= value
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                    }`}
                                />

                            </button>

                        ))}

                        {rating && (
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {rating} / 5
                            </span>
                        )}

                    </div>

                </div>


                {/* Comments */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Overall Comments *
                    </label>

                    <textarea
                        value={comments}
                        onChange={(e) =>
                            setComments(
                                e.target.value
                            )
                        }
                        rows={7}
                        placeholder="Summarize your achievements, contributions, challenges, and areas for improvement..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                </div>


                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/20 disabled:opacity-50"
                    >

                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}

                        Save Draft

                    </button>


                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
                    >

                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}

                        Submit Self Review

                    </button>

                </div>

            </div>

        </div>
    );
};

export default SelfReviewForm;