import { useEffect, useState } from "react";
import { Save, Send, Loader2 } from "lucide-react";

const ManagerReviewForm = ({
    review,
    onSave,
    onSubmit,
    saving = false,
    submitting = false
}) => {

    const [rating, setRating] = useState("");
    const [comments, setComments] = useState("");

    useEffect(() => {
        if (review) {
            setRating(
                review.overallRating != null
                    ? String(review.overallRating)
                    : ""
            );

            setComments(
                review.overallComments || ""
            );
        }
    }, [review]);

    const handleSave = () => {

        if (!rating) {
            return;
        }

        onSave({
            overallRating: Number(rating),
            overallComments: comments.trim()
        });
    };

    const handleSubmit = () => {

        if (!rating || !comments.trim()) {
            return;
        }

        onSubmit({
            overallRating: Number(rating),
            overallComments: comments.trim()
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">

            <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Manager Assessment
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Review the employee's performance and provide your assessment.
                </p>
            </div>

            <div className="p-4 sm:p-5 space-y-5">

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Overall Rating
                    </label>

                    <select
                        value={rating}
                        onChange={(e) =>
                            setRating(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">
                            Select rating
                        </option>

                        <option value="1">
                            1 - Needs Significant Improvement
                        </option>

                        <option value="2">
                            2 - Needs Improvement
                        </option>

                        <option value="3">
                            3 - Meets Expectations
                        </option>

                        <option value="4">
                            4 - Exceeds Expectations
                        </option>

                        <option value="5">
                            5 - Outstanding
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Manager Comments
                    </label>

                    <textarea
                        value={comments}
                        onChange={(e) =>
                            setComments(e.target.value)
                        }
                        rows={6}
                        placeholder="Provide your assessment, achievements, improvement areas and recommendations..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={
                            saving ||
                            submitting ||
                            !rating
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}

                        {saving
                            ? "Saving..."
                            : "Save Draft"}
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            saving ||
                            submitting ||
                            !rating ||
                            !comments.trim()
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50"
                    >
                        {submitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}

                        {submitting
                            ? "Submitting..."
                            : "Submit Manager Review"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ManagerReviewForm;