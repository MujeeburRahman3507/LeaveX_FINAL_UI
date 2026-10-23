import { useState } from "react";

import {
  Bot,
  Send,
  Trash2,
  Loader2,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  WalletCards
} from "lucide-react";

import api from "../services/api";

export default function AiLeaveAssistant({
  onPopulate
}) {

  const [text, setText] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [response, setResponse] =
    useState(null);


  /*
   * =====================================================
   * SEND QUESTION
   * =====================================================
   */

  const handleSend = async () => {

    if (!text.trim() || loading) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await api.post(
          "/ai/employee-assistant",
          {
            prompt: text
          }
        );

      setResponse(
        response.data
      );

    } catch (error) {

      console.error(
        "Employee AI Error:",
        error
      );

      setResponse({
        intent: "ERROR",
        answer:
          "Unable to process your request. Please try again.",
        count: 0,
        items: []
      });

    } finally {

      setLoading(false);

    }

  };


  /*
   * =====================================================
   * GENERATE LEAVE
   *
   * Existing functionality
   * =====================================================
   */

  const handleGenerateLeave = async () => {

    if (!text.trim() || loading) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await api.post(
          "/ai/parse-leave",
          {
            prompt: text
          }
        );

      if (onPopulate) {

        onPopulate(
          response.data
        );

      }

      setText("");

    } catch (error) {

      console.error(
        "Leave generation failed:",
        error
      );

      setResponse({

        intent: "ERROR",

        answer:
          "Unable to generate leave request. Please try again.",

        count: 0,

        items: []

      });

    } finally {

      setLoading(false);

    }

  };


  /*
   * =====================================================
   * CLEAR
   * =====================================================
   */

  const handleClear = () => {

    setText("");

    setResponse(null);

  };


  /*
   * =====================================================
   * QUICK PROMPTS
   * =====================================================
   */

  const quickPrompts = [

    {
      label: "Leave Balance",
      prompt: "Show my leave balance",
      icon: WalletCards
    },

    {
      label: "Pending Leaves",
      prompt: "Show my pending leaves",
      icon: Clock
    },

    {
      label: "Leave History",
      prompt: "Show my leave history",
      icon: FileText
    },

    {
      label: "Upcoming Leave",
      prompt: "When is my next leave?",
      icon: CalendarDays
    },

  {
    label: "Apply Medical Leave",
    prompt:
      "I want to apply medical leave. Please help me fill the leave form.",
    icon: FileText
  },

  {
    label: "Apply Casual Leave",
    prompt:
      "I want to apply casual leave. Please help me fill the leave form.",
    icon: CalendarDays
  },

  {
    label: "Apply Earned Leave",
    prompt:
      "I want to apply earned leave. Please help me fill the leave form.",
    icon: WalletCards
  },

  {
    label: "Apply Leave",
    prompt:
      "I want to apply leave. Please help me fill the leave form.",
    icon: Send
  }

  ];


  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (

    <div
      className="
      bg-white
      dark:bg-slate-800
      border
      border-slate-200
      dark:border-slate-700
      rounded-3xl
      shadow-sm
      overflow-hidden
      mb-6
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
        px-6
        py-5
        border-b
        border-slate-200
        dark:border-slate-700
        flex
        items-center
        justify-between
        "
      >

        <div
          className="
          flex
          items-center
          gap-3
          "
        >

          <div
            className="
            w-11
            h-11
            rounded-xl
            bg-violet-100
            dark:bg-violet-900/30
            flex
            items-center
            justify-center
            "
          >

            <Bot
              size={24}
              className="
              text-violet-600
              dark:text-violet-400
              "
            />

          </div>

          <div>

            <h2
              className="
              text-xl
              font-bold
              text-slate-900
              dark:text-white
              "
            >
              AI Leave Assistant
            </h2>

            <p
              className="
              text-sm
              text-slate-500
              dark:text-slate-400
              mt-1
              "
            >
              Ask questions or create a leave request using natural language.
            </p>

          </div>

        </div>


        {/* CLEAR */}

        {(text || response) && (

          <button
            onClick={handleClear}
            className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-lg
            text-sm
            font-medium
            text-slate-500
            hover:text-red-600
            hover:bg-red-50
            dark:hover:bg-red-900/20
            transition
            "
          >

            <Trash2 size={16} />

            Clear

          </button>

        )}

      </div>


      {/* =================================================
          BODY
      ================================================= */}

      <div className="p-6">


        {/* QUICK PROMPTS */}

        <div className="mb-5">

          <p
            className="
            text-sm
            font-medium
            text-slate-600
            dark:text-slate-300
            mb-3
            "
          >
            Quick questions
          </p>

          <div
            className="
            flex
            flex-wrap
            gap-2
            "
          >

            {quickPrompts.map(
              (item) => {

                const Icon =
                  item.icon;

                return (

                  <button
                    key={item.label}
                    onClick={() => {

                      setText(
                        item.prompt
                      );

                    }}
                    className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    border
                    border-slate-200
                    dark:border-slate-600
                    text-sm
                    text-slate-600
                    dark:text-slate-300
                    hover:border-violet-400
                    hover:text-violet-600
                    dark:hover:text-violet-400
                    transition
                    "
                  >

                    <Icon size={15} />

                    {item.label}

                  </button>

                );

              }
            )}

          </div>

        </div>


        {/* TEXT AREA */}

        <textarea

          rows="4"

          value={text}

          onChange={(e) =>
            setText(
              e.target.value
            )
          }

          onKeyDown={(e) => {

            if (
              e.key === "Enter"
              &&
              !e.shiftKey
            ) {

              e.preventDefault();

              handleSend();

            }

          }}

          placeholder="
Ask something like:
'How many leaves do I have remaining?'
or
'Show my leave history'
"

          className="
          w-full
          min-h-[130px]
          border
          border-slate-300
          dark:border-slate-600
          bg-white
          dark:bg-slate-900
          text-slate-900
          dark:text-white
          placeholder:text-slate-400
          rounded-2xl
          p-4
          resize-none
          focus:ring-2
          focus:ring-violet-500
          focus:border-violet-500
          outline-none
          transition
          "

        />


        {/* BUTTONS */}

        <div
          className="
          flex
          flex-wrap
          gap-3
          mt-4
          "
        >

          {/* ASK AI */}

          <button

            disabled={
              loading ||
              !text.trim()
            }

            onClick={
              handleSend
            }

            className="
            flex
            items-center
            justify-center
            gap-2
            bg-violet-600
            hover:bg-violet-700
            disabled:bg-violet-300
            dark:bg-violet-500
            dark:hover:bg-violet-600
            text-white
            font-semibold
            px-5
            py-3
            rounded-xl
            shadow-sm
            transition
            "
          >

            {loading ? (

              <Loader2
                size={18}
                className="animate-spin"
              />

            ) : (

              <Send size={18} />

            )}

            {loading
              ? "Thinking..."
              : "Ask AI"
            }

          </button>


          {/* GENERATE LEAVE */}

          <button

            disabled={
              loading ||
              !text.trim()
            }

            onClick={
              handleGenerateLeave
            }

            className="
            flex
            items-center
            justify-center
            gap-2
            bg-emerald-600
            hover:bg-emerald-700
            disabled:bg-emerald-300
            text-white
            font-semibold
            px-5
            py-3
            rounded-xl
            shadow-sm
            transition
            "
          >

            <CalendarDays
              size={18}
            />

            Generate Leave

          </button>

        </div>


        {/* =================================================
            AI RESPONSE
        ================================================= */}

        {response && (

          <div
            className="
            mt-6
            rounded-2xl
            border
            border-violet-200
            dark:border-violet-800
            bg-violet-50
            dark:bg-violet-900/20
            p-5
            "
          >

            {/* ANSWER */}

            <div
              className="
              flex
              gap-3
              "
            >

              <div
                className="
                shrink-0
                w-9
                h-9
                rounded-lg
                bg-violet-100
                dark:bg-violet-900/40
                flex
                items-center
                justify-center
                "
              >

                <Bot
                  size={19}
                  className="
                  text-violet-600
                  "
                />

              </div>

              <div>

                <p
                  className="
                  text-sm
                  font-medium
                  text-violet-700
                  dark:text-violet-300
                  mb-1
                  "
                >
                  AI Assistant
                </p>

                <p
                  className="
                  text-slate-700
                  dark:text-slate-200
                  leading-relaxed
                  "
                >
                  {response.answer}
                </p>

              </div>

            </div>


            {/* RESULTS */}

            {response.items &&
              response.items.length > 0 && (

              <div
                className="
                mt-5
                space-y-3
                "
              >

                {response.items.map(
                  (item, index) => (

                    <EmployeeLeaveItem
                      key={
                        item.requestId ||
                        index
                      }
                      item={item}
                    />

                  )
                )}

              </div>

            )}

          </div>

        )}


        {/* =================================================
            EXAMPLES
        ================================================= */}

        {!response && (

          <div
            className="
            mt-6
            rounded-2xl
            bg-slate-50
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-700
            p-4
            "
          >

            <p
              className="
              text-sm
              font-medium
              text-slate-600
              dark:text-slate-300
              "
            >
              💡 Try asking:
            </p>

            <div
              className="
              mt-3
              grid
              sm:grid-cols-2
              gap-2
              "
            >

              <Example text="Show my leave history" />

              <Example text="How many leaves do I have remaining?" />

              <Example text="When is my next leave?" />

              <Example text="Show my pending leave requests" />

              <Example text="How many leaves did I take this year?" />

              <Example text="Give me my leave summary" />

            </div>

          </div>

        )}

      </div>

    </div>

  );

}


/*
 * =========================================================
 * RESULT ITEM
 * =========================================================
 */

function EmployeeLeaveItem({
  item
}) {

  const status =
    item.status?.toUpperCase();


  return (

    <div
      className="
      bg-white
      dark:bg-slate-800
      rounded-xl
      border
      border-slate-200
      dark:border-slate-700
      p-4
      "
    >

      <div
        className="
        flex
        flex-wrap
        justify-between
        gap-3
        "
      >

        <div>

          <p
            className="
            font-semibold
            text-slate-800
            dark:text-white
            "
          >
            {item.leaveType || "Leave"}
          </p>

          <p
            className="
            text-sm
            text-slate-500
            dark:text-slate-400
            mt-1
            "
          >
            {item.startDate}
            {" → "}
            {item.endDate}
          </p>

        </div>


        {status && (

          <StatusBadge
            status={status}
          />

        )}

      </div>


      <div
        className="
        grid
        grid-cols-2
        md:grid-cols-3
        gap-3
        mt-4
        "
      >

        <Info
          label="Days"
          value={
            item.totalDays ??
            "-"
          }
        />

        <Info
          label="Reason"
          value={
            item.reason ||
            "-"
          }
        />

        <Info
          label="Document"
          value={
            item.documentStatus ||
            (
              item.documentRequested
                ? "Requested"
                : "Not Required"
            )
          }
        />

      </div>

    </div>

  );

}


/*
 * =========================================================
 * STATUS
 * =========================================================
 */

function StatusBadge({
  status
}) {

  let Icon =
    Clock;

  let className =
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";


  if (status === "APPROVED") {

    Icon = CheckCircle2;

    className =
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

  }

  if (status === "REJECTED") {

    Icon = XCircle;

    className =
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

  }


  return (

    <span
      className={`
      inline-flex
      items-center
      gap-1.5
      px-3
      py-1.5
      rounded-full
      text-xs
      font-semibold
      ${className}
      `}
    >

      <Icon size={14} />

      {status}

    </span>

  );

}


/*
 * =========================================================
 * INFO
 * =========================================================
 */

function Info({
  label,
  value
}) {

  return (

    <div>

      <p
        className="
        text-xs
        text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
        text-sm
        font-medium
        text-slate-700
        dark:text-slate-200
        mt-1
        truncate
        "
      >
        {value}
      </p>

    </div>

  );

}


/*
 * =========================================================
 * EXAMPLE
 * =========================================================
 */

function Example({
  text
}) {

  return (

    <button

      onClick={() => {

        // This component cannot directly
        // modify parent's text state.
        // The examples remain visual hints.

        navigator.clipboard
          ?.writeText(text);

      }}

      className="
      text-left
      text-sm
      text-slate-500
      dark:text-slate-400
      hover:text-violet-600
      dark:hover:text-violet-400
      transition
      "
    >

      • {text}

    </button>

  );

}