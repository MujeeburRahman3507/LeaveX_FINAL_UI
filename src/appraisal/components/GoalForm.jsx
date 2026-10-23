import { useEffect, useState } from "react";
import {
    X,
    Save,
    Loader2
} from "lucide-react";

const GoalForm = ({
    goal,
    onSave,
    onClose,
    saving
}) => {

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        target: "",
        measurement: "",
        weight: "",
        startDate: "",
        endDate: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {

        if (goal) {

            setForm({
                title: goal.title || "",
                description: goal.description || "",
                category: goal.category || "",
                target: goal.target || "",
                measurement: goal.measurement || "",
                weight: goal.weight ?? "",
                startDate: goal.startDate || "",
                endDate: goal.endDate || ""
            });

        } else {

            setForm({
                title: "",
                description: "",
                category: "",
                target: "",
                measurement: "",
                weight: "",
                startDate: "",
                endDate: ""
            });
        }

    }, [goal]);

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("Goal title is required.");
            return;
        }

        if (
            form.weight === "" ||
            Number(form.weight) < 0 ||
            Number(form.weight) > 100
        ) {
            setError(
                "Weight must be between 0 and 100."
            );
            return;
        }

        if (
            form.startDate &&
            form.endDate &&
            form.endDate < form.startDate
        ) {
            setError(
                "End date cannot be before start date."
            );
            return;
        }

        await onSave({
            title: form.title.trim(),
            description:
                form.description.trim() || null,
            category:
                form.category.trim() || null,
            target:
                form.target.trim() || null,
            measurement:
                form.measurement.trim() || null,
            weight: Number(form.weight),
            startDate:
                form.startDate || null,
            endDate:
                form.endDate || null
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {goal
                                ? "Edit Goal"
                                : "Add Performance Goal"}
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Define a measurable objective for your appraisal.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="p-4 sm:p-5 space-y-5"
                >

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 text-sm">
                            {error}
                        </div>
                    )}


                    {/* Title */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Goal Title *
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Improve production support efficiency"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />

                    </div>


                    {/* Description */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe the goal..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />

                    </div>


                    {/* Category + Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="Project Delivery"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />

                        </div>


                        <div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Weight (%) *
                            </label>

                            <input
                                type="number"
                                name="weight"
                                value={form.weight}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="30"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />

                        </div>

                    </div>


                    {/* Target */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Target
                        </label>

                        <textarea
                            name="target"
                            value={form.target}
                            onChange={handleChange}
                            rows={2}
                            placeholder="What should be achieved?"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />

                    </div>


                    {/* Measurement */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Measurement / KPI
                        </label>

                        <textarea
                            name="measurement"
                            value={form.measurement}
                            onChange={handleChange}
                            rows={2}
                            placeholder="How will success be measured?"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />

                    </div>


                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />

                        </div>


                        <div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Date
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />

                        </div>

                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium"
                        >

                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}

                            {goal
                                ? "Update Goal"
                                : "Save Goal"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default GoalForm;