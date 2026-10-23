import React, { useState } from "react";

const HrReviewForm = ({
  review,
  onSave,
  onSubmit,
  onFinalize,
  saving,
  submitting,
  finalizing,
}) => {
  const [rating, setRating] = useState(
    review?.finalRating ?? ""
  );

  const [performanceCategory, setPerformanceCategory] =
    useState(review?.performanceCategory ?? "");

  const [comments, setComments] = useState(
    review?.comments ?? ""
  );

  const handleSave = () => {
    if (!rating) {
      alert("Please select a final rating.");
      return;
    }

    if (!performanceCategory.trim()) {
      alert("Please enter the performance category.");
      return;
    }

    onSave({
      finalRating: Number(rating),
      performanceCategory: performanceCategory.trim(),
      comments: comments.trim(),
    });
  };

  const handleSubmit = () => {
    if (!rating) {
      alert("Please select a final rating.");
      return;
    }

    if (!performanceCategory.trim()) {
      alert("Please enter the performance category.");
      return;
    }

    if (!comments.trim()) {
      alert("Please enter HR comments.");
      return;
    }

    onSubmit({
      finalRating: Number(rating),
      performanceCategory: performanceCategory.trim(),
      comments: comments.trim(),
    });
  };

  return (
    <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          HR / Admin Final Review
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review the employee's appraisal and provide the final
          performance assessment.
        </p>
      </div>

      <div className="space-y-5">

        {/* Final Rating */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Final Rating
          </label>

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            disabled={review?.status === "SUBMITTED" || finalizing}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Rating</option>
            <option value="1">1 - Needs Improvement</option>
            <option value="2">2 - Below Expectations</option>
            <option value="3">3 - Meets Expectations</option>
            <option value="4">4 - Exceeds Expectations</option>
            <option value="5">5 - Outstanding</option>
          </select>
        </div>

        {/* Performance Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Performance Category
          </label>

          <input
            type="text"
            value={performanceCategory}
            onChange={(e) =>
              setPerformanceCategory(e.target.value)
            }
            placeholder="e.g. Meets Expectations"
            disabled={
              review?.status === "SUBMITTED" || finalizing
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Comments */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            HR / Admin Comments
          </label>

          <textarea
            rows={5}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter final appraisal comments..."
            disabled={
              review?.status === "SUBMITTED" || finalizing
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Actions */}
        {review?.status !== "SUBMITTED" &&
          review?.status !== "FINALIZED" && (
            <div className="flex flex-wrap gap-3 pt-2">

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit HR Review"}
              </button>

            </div>
          )}

        {/* Finalize */}
        {review?.status === "SUBMITTED" && (
          <div className="border-t pt-5 dark:border-gray-700">
            <button
              type="button"
              onClick={onFinalize}
              disabled={finalizing}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {finalizing
                ? "Finalizing..."
                : "Finalize Appraisal"}
            </button>
          </div>
        )}

        {review?.status === "FINALIZED" && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            This appraisal has been finalized.
          </div>
        )}
      </div>
    </div>
  );
};

export default HrReviewForm;