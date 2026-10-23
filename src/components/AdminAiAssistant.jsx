import { useState } from "react";

import {
    Bot,
    Send,
    Loader2,
    X,
    Users,
    CalendarDays,
    Clock,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";

import api from "../services/api";

export default function AdminAiAssistant() {

    const [open, setOpen] = useState(false);

    const [text, setText] = useState("");

    const [loading, setLoading] = useState(false);

    const [response, setResponse] = useState(null);


    /* =====================================================
       SUGGESTIONS
       ===================================================== */

    const suggestions = [

        "How many employees are on leave today?",

        "Who has the most leave this month?",

        "Show pending leave requests",

        "Give me this month's leave summary",

        "Which employees have pending documents?",

        "Show medical leave requests",

        "Find employee Mujeebur Rahman",

        "How many employees are there in each country?",

        "Who is going on leave tomorrow?",

        "Show Mujeebur Rahman's leave history",

        "How many active employees do we have?",

        "Give me an overall leave overview"

    ];


    /* =====================================================
       SEND QUESTION
       ===================================================== */

    const handleSend = async () => {

        if (!text.trim() || loading) {
            return;
        }

        try {

            setLoading(true);

            const result =
                await api.post(
                    "/ai/admin-assistant",
                    {
                        prompt: text
                    }
                );

            setResponse(result.data);

        } catch (error) {

            console.error(
                "Admin AI Error:",
                error
            );

            setResponse({

                intent: "ERROR",

                answer:
                    "Unable to process your request right now.",

                count: 0,

                items: []

            });

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       SUGGESTION CLICK
       ===================================================== */

    const handleSuggestion = (question) => {

        setText(question);

    };


    /* =====================================================
       CLEAR
       ===================================================== */

    const handleClear = () => {

        setText("");

        setResponse(null);

    };


    /* =====================================================
       ENTER KEY
       ===================================================== */

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSend();

        }

    };


    return (

        <>

            {/* =====================================================
               FLOATING BUTTON
               ===================================================== */}

            {!open && (

                <button

                    onClick={() =>
                        setOpen(true)
                    }

                    className="
                    fixed
                    bottom-6
                    right-6
                    z-50
                    w-16
                    h-16
                    rounded-full
                    bg-gradient-to-r
                    from-violet-600
                    to-indigo-600
                    text-white
                    shadow-2xl
                    hover:scale-105
                    transition-all
                    duration-300
                    flex
                    items-center
                    justify-center
                    "

                    title="Admin AI Assistant"

                >

                    <Bot size={30} />

                </button>

            )}


            {/* =====================================================
               AI PANEL
               ===================================================== */}

            {open && (

                <div

                    className="
                    fixed
                    bottom-6
                    right-6
                    z-50
                    w-[420px]
                    max-w-[calc(100vw-2rem)]
                    bg-white
                    dark:bg-slate-800
                    rounded-3xl
                    shadow-2xl
                    border
                    border-slate-200
                    dark:border-slate-700
                    overflow-hidden
                    "

                >

                    {/* =====================================================
                       HEADER
                       ===================================================== */}

                    <div

                        className="
                        bg-gradient-to-r
                        from-violet-600
                        to-indigo-600
                        text-white
                        px-5
                        py-4
                        flex
                        justify-between
                        items-center
                        "

                    >

                        <div className="
                        flex
                        items-center
                        gap-3
                        ">

                            <div className="
                            w-10
                            h-10
                            rounded-xl
                            bg-white/20
                            flex
                            items-center
                            justify-center
                            ">

                                <Bot size={23} />

                            </div>


                            <div>

                                <h3 className="
                                font-bold
                                text-lg
                                ">

                                    Admin AI Assistant

                                </h3>

                                <p className="
                                text-violet-100
                                text-xs
                                ">

                                    Organization Intelligence

                                </p>

                            </div>

                        </div>


                        <button

                            onClick={() =>
                                setOpen(false)
                            }

                            className="
                            hover:bg-white/20
                            rounded-lg
                            p-2
                            transition
                            "

                        >

                            <X size={20} />

                        </button>

                    </div>


                    {/* =====================================================
                       RESPONSE HEADER
                       ===================================================== */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        px-5
                        pt-4
                        "
                    >

                        <div>

                            <h3 className="
                                font-semibold
                                text-slate-800
                                dark:text-white
                            ">

                                🤖 AI Response

                            </h3>


                            <p className="
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                                mt-1
                            ">

                                Based on current employee and leave data

                            </p>

                        </div>


                        {/* CLEAR BUTTON */}

                        <button

                            type="button"

                            onClick={handleClear}

                            className="
                            px-3
                            py-2
                            rounded-lg
                            border
                            border-slate-300
                            dark:border-slate-600
                            text-slate-600
                            dark:text-slate-300
                            hover:bg-slate-100
                            dark:hover:bg-slate-700
                            transition
                            text-sm
                            font-medium
                            "

                        >

                            🗑️ Clear

                        </button>

                    </div>


                    {/* =====================================================
                       BODY
                       ===================================================== */}

                    <div className="
                        p-5
                        max-h-[600px]
                        overflow-y-auto
                    ">


                        {/* =====================================================
                           EMPTY STATE
                           ===================================================== */}

                        {!response && (

                            <>

                                <div className="
                                    text-center
                                    py-4
                                ">

                                    <div className="
                                        w-16
                                        h-16
                                        mx-auto
                                        rounded-2xl
                                        bg-violet-100
                                        dark:bg-violet-900/30
                                        flex
                                        items-center
                                        justify-center
                                        mb-4
                                    ">

                                        <Bot
                                            size={32}
                                            className="
                                                text-violet-600
                                            "
                                        />

                                    </div>


                                    <h3 className="
                                        font-bold
                                        text-slate-800
                                        dark:text-white
                                    ">

                                        Ask Admin AI

                                    </h3>


                                    <p className="
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                        mt-2
                                    ">

                                        Ask questions about
                                        employees, leaves,
                                        documents and
                                        organization data.

                                    </p>

                                </div>


                                {/* =====================================================
                                   SUGGESTIONS
                                   ===================================================== */}

                                <div className="
                                    mt-4
                                    space-y-2
                                ">

                                    {suggestions.map(
                                        (question, index) => (

                                            <button

                                                key={index}

                                                onClick={() =>
                                                    handleSuggestion(
                                                        question
                                                    )
                                                }

                                                className="
                                                w-full
                                                text-left
                                                text-sm
                                                bg-slate-50
                                                dark:bg-slate-900
                                                hover:bg-violet-50
                                                dark:hover:bg-violet-900/20
                                                border
                                                border-slate-200
                                                dark:border-slate-700
                                                rounded-xl
                                                px-4
                                                py-3
                                                transition
                                                "

                                            >

                                                💡 {question}

                                            </button>

                                        )
                                    )}

                                </div>

                            </>

                        )}


                        {/* =====================================================
                           RESPONSE
                           ===================================================== */}

                        {response && (

                            <AdminAiResult
                                response={response}
                            />

                        )}

                    </div>


                    {/* =====================================================
                       INPUT
                       ===================================================== */}

                    <div className="
                        border-t
                        border-slate-200
                        dark:border-slate-700
                        p-4
                    ">

                        <div className="
                            flex
                            items-end
                            gap-2
                        ">

                            <textarea

                                rows="2"

                                value={text}

                                onChange={(e) =>
                                    setText(
                                        e.target.value
                                    )
                                }

                                onKeyDown={
                                    handleKeyDown
                                }

                                placeholder="
                                    Ask Admin AI...
                                "

                                className="
                                flex-1
                                resize-none
                                rounded-xl
                                border
                                border-slate-300
                                dark:border-slate-600
                                bg-white
                                dark:bg-slate-900
                                text-slate-800
                                dark:text-white
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:ring-2
                                focus:ring-violet-500
                                "

                            />


                            <button

                                onClick={
                                    handleSend
                                }

                                disabled={
                                    loading ||
                                    !text.trim()
                                }

                                className="
                                w-11
                                h-11
                                rounded-xl
                                bg-violet-600
                                hover:bg-violet-700
                                disabled:bg-slate-300
                                text-white
                                flex
                                items-center
                                justify-center
                                transition
                                "

                            >

                                {loading

                                    ?

                                    <Loader2
                                        size={19}
                                        className="
                                            animate-spin
                                        "
                                    />

                                    :

                                    <Send
                                        size={19}
                                    />

                                }

                            </button>

                        </div>


                        <p className="
                            text-[11px]
                            text-slate-400
                            mt-2
                            text-center
                        ">

                            Press Enter to ask •
                            Shift + Enter for new line

                        </p>

                    </div>

                </div>

            )}

        </>

    );

}


/* =====================================================
   RESULT COMPONENT
   ===================================================== */

function AdminAiResult({ response }) {

    if (!response) {
        return null;
    }


    return (

        <div className="
            space-y-4
        ">


            {/* =====================================================
               INTENT
               ===================================================== */}

            <div className="
                flex
                items-center
                justify-between
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <Bot
                        size={18}
                        className="
                            text-violet-600
                        "
                    />

                    <span className="
                        text-sm
                        font-semibold
                        text-slate-700
                        dark:text-slate-200
                    ">

                        Admin AI

                    </span>

                </div>


                {response.count !== undefined && (

                    <span className="
                        bg-violet-100
                        dark:bg-violet-900/30
                        text-violet-700
                        dark:text-violet-300
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                    ">

                        {response.count} Result
                        {response.count === 1
                            ? ""
                            : "s"}

                    </span>

                )}

            </div>


            {/* =====================================================
               ANSWER
               ===================================================== */}

            <div className="
                rounded-2xl
                bg-violet-50
                dark:bg-violet-900/20
                border
                border-violet-200
                dark:border-violet-800
                p-4
            ">

                <p className="
                    text-sm
                    text-slate-700
                    dark:text-slate-200
                    leading-relaxed
                ">

                    {response.answer}

                </p>

            </div>


            {/* =====================================================
               DATA
               ===================================================== */}

            {response.items &&
                response.items.length > 0 && (

                    <div className="
                        space-y-3
                    ">


                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <Users
                                size={17}
                                className="
                                    text-violet-600
                                "
                            />

                            <h4 className="
                                font-semibold
                                text-slate-800
                                dark:text-white
                            ">

                                Details

                            </h4>

                        </div>


                        <div className="
                            max-h-[300px]
                            overflow-y-auto
                            space-y-2
                            pr-1
                        ">

                            {response.items.map(
                                (item, index) => (

                                    <AdminAiItem

                                        key={
                                            item.requestId ||
                                            item.employeeName ||
                                            index
                                        }

                                        item={item}

                                        intent={
                                            response.intent
                                        }

                                    />

                                )
                            )}

                        </div>

                    </div>

                )}


            {/* =====================================================
               ASK ANOTHER
               ===================================================== */}

            <div className="
                text-center
                pt-2
            ">

                <span className="
                    text-xs
                    text-slate-400
                ">

                    Ask another question below

                </span>

            </div>

        </div>

    );

}


/* =====================================================
   ITEM
   ===================================================== */

function AdminAiItem({
    item,
    intent
}) {

    /*
     * =====================================================
     * IMPORTANT
     *
     * totalDays is used differently by the backend:
     *
     * Leave-related intent:
     *     totalDays = leave duration
     *
     * Country intent:
     *     totalDays = employee count
     *
     * Therefore we must check intent before displaying it.
     * =====================================================
     */


    const isEmployeeSearch =
        intent === "EMPLOYEE_SEARCH";


    const isCountryEmployeeCount =
        intent === "EMPLOYEES_BY_COUNTRY";


    const isLeaveResult =
        !isEmployeeSearch &&
        !isCountryEmployeeCount;


    return (

        <div className="
            rounded-xl
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            p-4
            hover:border-violet-300
            transition
        ">


            {/* =====================================================
               TOP SECTION
               ===================================================== */}

            <div className="
                flex
                justify-between
                gap-3
            ">


                <div className="
                    min-w-0
                ">

                    <p className="
                        font-semibold
                        text-slate-800
                        dark:text-white
                        truncate
                    ">

                        {item.employeeName ||
                            "Employee"}

                    </p>


                    {/* LEAVE TYPE */}

                    {item.leaveType && (

                        <p className="
                            text-xs
                            text-violet-600
                            mt-1
                        ">

                            {item.leaveType}

                        </p>

                    )}

                </div>


                {/* STATUS */}

                {item.status && (

                    <StatusBadge
                        status={
                            item.status
                        }
                    />

                )}

            </div>


            {/* =====================================================
               LEAVE DATES
               ===================================================== */}

            {(
                item.startDate ||
                item.endDate
            ) && (

                <div className="
                    flex
                    items-center
                    gap-2
                    mt-3
                    text-xs
                    text-slate-500
                ">

                    <CalendarDays
                        size={14}
                    />

                    <span>

                        {item.startDate}

                        {item.endDate &&
                            ` → ${item.endDate}`}

                    </span>

                </div>

            )}


            {/* =====================================================
               COUNTRY EMPLOYEE COUNT
               ===================================================== */}

            {isCountryEmployeeCount && (

                <div className="
                    flex
                    items-center
                    gap-2
                    mt-3
                    text-xs
                    text-violet-600
                    dark:text-violet-400
                    font-medium
                ">

                    <Users
                        size={14}
                    />

                    <span>

                        {item.totalDays ?? 0} employee
                        {(item.totalDays ?? 0) === 1
                            ? ""
                            : "s"}

                    </span>

                </div>

            )}


            {/* =====================================================
               LEAVE DURATION
               ===================================================== */}

            {isLeaveResult &&
                item.totalDays !== undefined &&
                item.totalDays !== null && (

                    <div className="
                        flex
                        items-center
                        gap-2
                        mt-2
                        text-xs
                        text-slate-500
                    ">

                        <Clock
                            size={14}
                        />

                        <span>

                            {item.totalDays} day
                            {item.totalDays === 1
                                ? ""
                                : "s"}

                        </span>

                    </div>

                )}


            {/* =====================================================
               EMPLOYEE SEARCH - DEPARTMENT
               ===================================================== */}

            {isEmployeeSearch &&
                item.reason && (

                    <div className="
                        flex
                        items-center
                        gap-2
                        mt-3
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    ">

                        <span className="
                            font-medium
                            text-slate-600
                            dark:text-slate-300
                        ">

                            Department:

                        </span>

                        <span>

                            {item.reason}

                        </span>

                    </div>

                )}


            {/* =====================================================
               LEAVE REASON
               ===================================================== */}

            {isLeaveResult &&
                item.reason && (

                    <p className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                        mt-2
                    ">

                        Reason: {item.reason}

                    </p>

                )}

        </div>

    );

}


/* =====================================================
   STATUS
   ===================================================== */

function StatusBadge({ status }) {

    const normalized =
        status?.toUpperCase();


    let className =
        "bg-slate-100 text-slate-600";


    let Icon = AlertTriangle;


    if (
        normalized === "APPROVED"
    ) {

        className =
            "bg-green-100 text-green-700";

        Icon = CheckCircle2;

    }


    else if (
        normalized === "PENDING"
    ) {

        className =
            "bg-orange-100 text-orange-700";

        Icon = Clock;

    }


    else if (
        normalized === "REJECTED"
    ) {

        className =
            "bg-red-100 text-red-700";

    }


    else if (
        normalized === "ACTIVE"
    ) {

        className =
            "bg-green-100 text-green-700";

        Icon = CheckCircle2;

    }


    else if (
        normalized === "INACTIVE"
    ) {

        className =
            "bg-slate-100 text-slate-600";

    }


    return (

        <span className={`
            inline-flex
            items-center
            gap-1
            px-2
            py-1
            rounded-full
            text-[11px]
            font-semibold
            whitespace-nowrap
            ${className}
        `}>

            <Icon size={12} />

            {status}

        </span>

    );

}