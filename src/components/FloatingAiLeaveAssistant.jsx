import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, X } from "lucide-react";
import AiLeaveAssistant from "./AiLeaveAssistant";

/**
 * Floating AI assistant button for employees (same idea as the
 * manager / admin assistants). Opens the existing AiLeaveAssistant
 * inside a floating panel.
 */
export default function FloatingAiLeaveAssistant({ onPopulate }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handlePopulate = (data) => {
    setOpen(false);
    if (onPopulate) {
      onPopulate(data);
    } else {
      // default: open the Apply Leave page with the AI-filled form
      navigate("/employee/apply-leave", { state: { aiLeaveData: data } });
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open AI Leave Assistant"
          className="ai-fab fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl flex items-center justify-center hover:scale-105 transition"
        >
          <Bot size={28} />
        </button>
      )}

      {open && (
        <div className="ai-panel fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-16px)] max-h-[80dvh] overflow-y-auto rounded-3xl shadow-2xl bg-white dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
            className="sticky top-2 float-right mr-2 mt-2 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center"
          >
            <X size={18} />
          </button>
          <AiLeaveAssistant onPopulate={handlePopulate} />
        </div>
      )}
    </>
  );
}
