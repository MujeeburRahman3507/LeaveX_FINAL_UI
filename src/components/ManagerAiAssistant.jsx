import { useState } from "react";

import {
    Bot,
    Send,
    Sparkles,
    X,
    Trash2,
    Clock,
    FileText,
    Users,
    CalendarDays,
    CheckCircle2
} from "lucide-react";

import api from "../services/api";


export default function ManagerAiAssistant() {

    const [open, setOpen] =
        useState(false);

    const [input, setInput] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [messages, setMessages] =
        useState([
            {
                id: 1,
                role: "assistant",
                text:
                    "Hello! I'm your Manager AI Assistant. I can help you understand team leave requests, pending approvals, employee leave status and document reviews."
            }
        ]);


    const suggestions = [

        {
            icon: Clock,
            text: "Show pending approvals"
        },

        {
            icon: FileText,
            text: "Documents waiting for review"
        },

        {
            icon: Users,
            text: "Who is on leave today?"
        },

        {
            icon: CalendarDays,
            text: "Give me a team leave summary"
        }

    ];


    const generateDemoResponse = (question) => {

        const lower =
            question.toLowerCase();


        if (
            lower.includes("pending") &&
            lower.includes("approval")
        ) {

            return `
You currently have pending leave approvals that require your attention.

I can provide the employee name, leave type, requested dates and reason for each request.

Once the AI backend is connected, I will retrieve the live approval data directly from the system.
            `.trim();

        }


        if (
            lower.includes("document") ||
            lower.includes("verification") ||
            lower.includes("review")
        ) {

            return `
There are documents waiting for manager verification.

I can summarize:
• Employee name
• Document type
• Upload date
• Priority
• AI document analysis
• Verification status

The live document information will be connected in the next step.
            `.trim();

        }


        if (
            lower.includes("leave today") ||
            lower.includes("on leave")
        ) {

            return `
I can check which employees are currently on leave today and provide their leave type and dates.

This will be connected to the Manager Dashboard leave data when the AI backend is implemented.
            `.trim();

        }


        if (
            lower.includes("summary") ||
            lower.includes("team")
        ) {

            return `
Here is the type of team summary I can provide:

• Pending leave requests
• Approved requests
• Rejected requests
• Employees currently on leave
• Upcoming leaves
• Documents waiting for verification
• High-priority manager actions

The next step will connect this summary to your actual database.
            `.trim();

        }


        return `
I understand your question:

"${question}"

Manager AI will be able to answer this using your organization's leave, employee, approval, calendar and document data once the AI backend is connected.
        `.trim();

    };


    // const sendMessage = async (messageText = input) => {

    //     const question =
    //         messageText.trim();

    //     if (!question || loading) {
    //         return;
    //     }


    //     const userMessage = {

    //         id: Date.now(),

    //         role: "user",

    //         text: question

    //     };


    //     setMessages(prev => [

    //         ...prev,

    //         userMessage

    //     ]);


    //     setInput("");

    //     setLoading(true);


    //     /*
    //      * DEMO RESPONSE
    //      *
    //      * Later this section will call:
    //      *
    //      * POST /api/ai/manager-assistant
    //      *
    //      * and send:
    //      *
    //      * {
    //      *   "prompt": question
    //      * }
    //      *
    //      */


    //     setTimeout(() => {

    //         const response =
    //             generateDemoResponse(question);


    //         setMessages(prev => [

    //             ...prev,

    //             {
    //                 id: Date.now() + 1,
    //                 role: "assistant",
    //                 text: response
    //             }

    //         ]);


    //         setLoading(false);

    //     }, 900);

    // };

    const sendMessage = async (messageText = input) => {

    const question = messageText.trim();

    if (!question || loading) {
        return;
    }

    const userMessage = {
        id: Date.now(),
        role: "user",
        text: question
    };

    setMessages(prev => [
        ...prev,
        userMessage
    ]);

    setInput("");
    setLoading(true);

    try {

        const response = await api.post(
            "/ai/manager-assistant",
            {
                prompt: question
            }
        );

        const data = response.data;

        setMessages(prev => [
            ...prev,
    {
        id: Date.now() + 1,
        role: "assistant",

        text:
            data.answer ||
            "I could not find an answer.",

        items:
            data.items ||
            data.data ||
            [],

        count:
            data.count ?? 0,

        intent:
            data.intent || null
    }
        ]);

    } catch (error) {

        console.error(
            "Manager AI error:",
            error
        );

        setMessages(prev => [
            ...prev,
            {
                id: Date.now() + 1,
                role: "assistant",
                text:
                    "Sorry, I was unable to retrieve the requested information."
            }
        ]);

    } finally {

        setLoading(false);

    }
};


    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    };


    const clearChat = () => {

        setMessages([
            {
                id: Date.now(),
                role: "assistant",
                text:
                    "Chat cleared. How can I help you with your team today?"
            }
        ]);

    };


    return (

        <>

            {/* Floating AI Button */}

            {!open && (

                <button

                    type="button"

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
                    shadow-xl
                    hover:scale-105
                    transition-all
                    duration-200
                    flex
                    items-center
                    justify-center
                    "

                    title="Manager AI Assistant"

                >

                    <Bot size={30}/>

                </button>

            )}


            {/* AI Chat Window */}

            {open && (

                <div

                    className="
                    fixed
                    bottom-6
                    right-6
                    z-50
                    w-[420px]
                    max-w-[calc(100vw-32px)]
                    h-[650px]
                    max-h-[calc(100vh-32px)]
                    bg-white
                    dark:bg-slate-900
                    rounded-3xl
                    shadow-2xl
                    border
                    border-slate-200
                    dark:border-slate-700
                    overflow-hidden
                    flex
                    flex-col
                    "

                >

                    {/* Header */}

                    <div
                        className="
                        bg-gradient-to-r
                        from-violet-600
                        to-indigo-600
                        text-white
                        px-5
                        py-4
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
                                w-10
                                h-10
                                rounded-xl
                                bg-white/20
                                flex
                                items-center
                                justify-center
                                "
                            >

                                <Bot size={23}/>

                            </div>

                            <div>

                                <h3
                                    className="
                                    font-bold
                                    text-lg
                                    "
                                >
                                    Manager AI Assistant
                                </h3>

                                <p
                                    className="
                                    text-xs
                                    text-violet-100
                                    "
                                >
                                    Team & approval intelligence
                                </p>

                            </div>

                        </div>


                        <div
                            className="
                            flex
                            items-center
                            gap-1
                            "
                        >

                            <button
                                type="button"
                                onClick={clearChat}
                                className="
                                p-2
                                rounded-lg
                                hover:bg-white/10
                                transition
                                "
                                title="Clear chat"
                            >

                                <Trash2 size={17}/>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setOpen(false)
                                }
                                className="
                                p-2
                                rounded-lg
                                hover:bg-white/10
                                transition
                                "
                                title="Close"
                            >

                                <X size={20}/>

                            </button>

                        </div>

                    </div>


                    {/* Suggested Questions */}

                    {messages.length === 1 && (

                        <div
                            className="
                            p-4
                            border-b
                            border-slate-200
                            dark:border-slate-700
                            bg-slate-50
                            dark:bg-slate-800
                            "
                        >

                            <div
                                className="
                                flex
                                items-center
                                gap-2
                                mb-3
                                "
                            >

                                <Sparkles
                                    size={16}
                                    className="text-violet-600"
                                />

                                <span
                                    className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    dark:text-slate-200
                                    "
                                >
                                    Suggested questions
                                </span>

                            </div>


                            <div
                                className="
                                grid
                                grid-cols-2
                                gap-2
                                "
                            >

                                {suggestions.map(
                                    (item) => {

                                        const Icon =
                                            item.icon;

                                        return (

                                            <button

                                                key={
                                                    item.text
                                                }

                                                type="button"

                                                onClick={() =>
                                                    sendMessage(
                                                        item.text
                                                    )
                                                }

                                                className="
                                                text-left
                                                p-3
                                                rounded-xl
                                                border
                                                border-slate-200
                                                dark:border-slate-600
                                                bg-white
                                                dark:bg-slate-900
                                                hover:border-violet-400
                                                hover:bg-violet-50
                                                dark:hover:bg-violet-900/20
                                                transition
                                                "

                                            >

                                                <Icon
                                                    size={17}
                                                    className="
                                                    text-violet-600
                                                    mb-2
                                                    "
                                                />

                                                <span
                                                    className="
                                                    text-xs
                                                    font-medium
                                                    text-slate-700
                                                    dark:text-slate-300
                                                    "
                                                >
                                                    {item.text}
                                                </span>

                                            </button>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    )}


                    {/* Messages */}

                    <div
                        className="
                        flex-1
                        overflow-y-auto
                        p-5
                        space-y-4
                        bg-slate-50/50
                        dark:bg-slate-950/40
                        "
                    >

                        {messages.map(
                            message => (

                                <div

                                    key={
                                        message.id
                                    }

                                    className={`
                                    flex
                                    ${
                                        message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }
                                    `}

                                >

                                    <div
                                        className={`
                                        max-w-[85%]
                                        rounded-2xl
                                        px-4
                                        py-3
                                        text-sm
                                        leading-relaxed
                                        whitespace-pre-line

                                        ${
                                            message.role === "user"

                                            ?

                                            `
                                            bg-violet-600
                                            text-white
                                            rounded-br-md
                                            `

                                            :

                                            `
                                            bg-white
                                            dark:bg-slate-800
                                            text-slate-700
                                            dark:text-slate-200
                                            border
                                            border-slate-200
                                            dark:border-slate-700
                                            rounded-bl-md
                                            shadow-sm
                                            `
                                        }

                                        `}
                                    >

                                        {message.role === "assistant" && (

                                            <div
                                                className="
                                                flex
                                                items-center
                                                gap-2
                                                mb-2
                                                "
                                            >

                                                <Bot
                                                    size={15}
                                                    className="text-violet-600"
                                                />

                                                <span
                                                    className="
                                                    text-xs
                                                    font-semibold
                                                    text-violet-600
                                                    "
                                                >
                                                    Manager AI
                                                </span>

                                            </div>

                                        )}

                                 <div>

    {message.text}

    {message.role === "assistant" &&
        message.items &&
        message.items.length > 0 && (

            <div className="mt-3">

                {message.items.map(
                    (item, index) => (

                        <ManagerLeaveItem
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

                                    </div>

                                </div>

                            )
                        )}


                        {/* Loading */}

                        {loading && (

                            <div
                                className="
                                flex
                                justify-start
                                "
                            >

                                <div
                                    className="
                                    bg-white
                                    dark:bg-slate-800
                                    border
                                    border-slate-200
                                    dark:border-slate-700
                                    rounded-2xl
                                    rounded-bl-md
                                    px-4
                                    py-3
                                    "
                                >

                                    <div
                                        className="
                                        flex
                                        items-center
                                        gap-1
                                        "
                                    >

                                        <span
                                            className="
                                            w-2
                                            h-2
                                            bg-violet-500
                                            rounded-full
                                            animate-bounce
                                            "
                                        />

                                        <span
                                            className="
                                            w-2
                                            h-2
                                            bg-violet-500
                                            rounded-full
                                            animate-bounce
                                            [animation-delay:150ms]
                                            "
                                        />

                                        <span
                                            className="
                                            w-2
                                            h-2
                                            bg-violet-500
                                            rounded-full
                                            animate-bounce
                                            [animation-delay:300ms]
                                            "
                                        />

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* Input */}

                    <div
                        className="
                        p-4
                        border-t
                        border-slate-200
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-900
                        "
                    >

                        <div
                            className="
                            flex
                            items-end
                            gap-2
                            "
                        >

                            <textarea

                                rows={2}

                                value={input}

                                onChange={(event) =>
                                    setInput(
                                        event.target.value
                                    )
                                }

                                onKeyDown={
                                    handleKeyDown
                                }

                                placeholder="
                                Ask about approvals,
                                team leave or documents...
                                "

                                className="
                                flex-1
                                resize-none
                                rounded-xl
                                border
                                border-slate-300
                                dark:border-slate-600
                                bg-slate-50
                                dark:bg-slate-800
                                text-slate-900
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

                                type="button"

                                onClick={() =>
                                    sendMessage()
                                }

                                disabled={
                                    !input.trim() ||
                                    loading
                                }

                                className="
                                w-11
                                h-11
                                rounded-xl
                                bg-violet-600
                                hover:bg-violet-700
                                disabled:bg-slate-300
                                dark:disabled:bg-slate-700
                                text-white
                                flex
                                items-center
                                justify-center
                                transition
                                "

                            >

                                <Send size={18}/>

                            </button>

                        </div>


                        <div
                            className="
                            flex
                            items-center
                            justify-center
                            gap-1
                            mt-2
                            text-[11px]
                            text-slate-400
                            "
                        >

                            <CheckCircle2
                                size={12}
                            />

                            AI responses will be connected
                            to live system data

                        </div>

                    </div>

                </div>

            )}

        </>

    );

    function ManagerLeaveItem({ item }) {

    if (!item) {
        return null;
    }

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date)
                .toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        } catch {

            return date;

        }
    };

    const statusClass = {

        PENDING:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",

        APPROVED:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",

        REJECTED:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",

        CANCELLED:
            "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"

    };

    return (

        <div
            className="
            mt-3
            rounded-xl
            border
            border-slate-200
            dark:border-slate-700
            bg-slate-50
            dark:bg-slate-900
            p-4
            "
        >

            {/* Employee */}

            <div
                className="
                flex
                items-center
                justify-between
                gap-3
                mb-3
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
                        w-9
                        h-9
                        rounded-full
                        bg-violet-100
                        dark:bg-violet-900/40
                        text-violet-700
                        dark:text-violet-300
                        flex
                        items-center
                        justify-center
                        font-semibold
                        text-sm
                        "
                    >

                        {item.employeeName
                            ?.split(" ")
                            .map(
                                name =>
                                    name.charAt(0)
                            )
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()
                        }

                    </div>

                    <div>

                        <p
                            className="
                            font-semibold
                            text-slate-800
                            dark:text-white
                            "
                        >
                            {item.employeeName || "Unknown Employee"}
                        </p>

                        <p
                            className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                            "
                        >
                            Request #{item.requestId}
                        </p>

                    </div>

                </div>

                {item.status && (

                    <span
                        className={`
                        px-2.5
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                            statusClass[
                                item.status
                            ] ||
                            "bg-slate-100 text-slate-600"
                        }
                        `}
                    >

                        {item.status}

                    </span>

                )}

            </div>


            {/* Leave Type */}

            <div
                className="
                flex
                items-center
                gap-2
                text-sm
                mb-3
                "
            >

                <span
                    className="
                    text-slate-500
                    dark:text-slate-400
                    "
                >
                    Leave Type:
                </span>

                <span
                    className="
                    font-semibold
                    text-slate-800
                    dark:text-slate-200
                    "
                >
                    {item.leaveType || "-"}
                </span>

            </div>


            {/* Dates */}

            <div
                className="
                grid
                grid-cols-2
                gap-3
                mb-3
                "
            >

                <div>

                    <p
                        className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                        "
                    >
                        From
                    </p>

                    <p
                        className="
                        text-sm
                        font-semibold
                        text-slate-800
                        dark:text-slate-200
                        "
                    >
                        {formatDate(item.startDate)}
                    </p>

                </div>


                <div>

                    <p
                        className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                        "
                    >
                        To
                    </p>

                    <p
                        className="
                        text-sm
                        font-semibold
                        text-slate-800
                        dark:text-slate-200
                        "
                    >
                        {formatDate(item.endDate)}
                    </p>

                </div>

            </div>


            {/* Total Days */}

            {item.totalDays !== undefined && (

                <div
                    className="
                    flex
                    justify-between
                    text-sm
                    border-t
                    border-slate-200
                    dark:border-slate-700
                    pt-3
                    "
                >

                    <span
                        className="
                        text-slate-500
                        dark:text-slate-400
                        "
                    >
                        Total Days
                    </span>

                    <span
                        className="
                        font-semibold
                        text-slate-800
                        dark:text-white
                        "
                    >
                        {item.totalDays}
                    </span>

                </div>

            )}


            {/* Reason */}

            {item.reason && (

                <div
                    className="
                    mt-3
                    "
                >

                    <p
                        className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                        mb-1
                        "
                    >
                        Reason
                    </p>

                    <p
                        className="
                        text-sm
                        text-slate-700
                        dark:text-slate-300
                        "
                    >
                        {item.reason}
                    </p>

                </div>

            )}

        </div>

    );
}

}