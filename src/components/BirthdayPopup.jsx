import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { Gift, Cake, X } from "lucide-react";

export default function BirthdayPopup({

    open,

    employeeName,

    message,

    onClose

}) {

    const [showConfetti, setShowConfetti] =
        useState(true);

    useEffect(() => {

        if (!open)
            return;

        const timer =
            setTimeout(() => {

                setShowConfetti(false);

            }, 8000);

        return () =>
            clearTimeout(timer);

    }, [open]);

    if (!open)
        return null;

    return (

        <>

            {

                showConfetti &&

                <ReactConfetti
                    recycle={false}
                    numberOfPieces={350}
                />

            }

            <div
                className="
                fixed
                inset-0
                z-50
                bg-black/40
                backdrop-blur-sm
                flex
                items-center
                justify-center
                "
            >

                <div
                    className="
bg-white
dark:bg-slate-800
rounded-3xl
border
border-slate-200
dark:border-slate-700
shadow-2xl
p-10
w-[520px]
relative
overflow-hidden
animate-fadeIn
transition-colors
duration-300
"
                >

                    <button

                        onClick={onClose}

                        className="
absolute
right-5
top-5
text-slate-400
dark:text-slate-500
hover:text-red-500
transition
"

                    >

                        <X size={24}/>

                    </button>

                    <div className="text-center">

                        <div
                            className="
                            w-24
                            h-24
                            rounded-full
                            mx-auto
                            bg-gradient-to-r
                            from-pink-500
                            to-violet-600
                            flex
                            items-center
                            justify-center
                            text-white
                            shadow-lg
                            "
                        >

                            <Cake size={46}/>

                        </div>

                        <h1
                            className="
                            text-4xl
                            font-extrabold
                            mt-8
                            text-violet-700
                            "
                        >

                            🎉 Happy Birthday!

                        </h1>

                        <h2
                            className="
text-2xl
font-bold
mt-4
text-slate-900
dark:text-white
"
                        >

                            {employeeName}

                        </h2>

                        <p
                  className="
mt-5
text-slate-600
dark:text-slate-300
leading-7
"
                        >

                            {message}

                        </p>

                        <div
                           className="
mt-8
rounded-2xl
bg-pink-50
dark:bg-pink-900/30
border
border-pink-200
dark:border-pink-700
p-5
text-pink-600
dark:text-pink-300
font-semibold
flex
items-center
justify-center
gap-3
transition-colors
"
                        >

                            <Gift size={22}/>

                            BOIT GLOBAL wishes you a fantastic year ahead!

                        </div>

                        <button

                            onClick={onClose}

                           className="
mt-8
bg-violet-600
hover:bg-violet-700
dark:bg-violet-500
dark:hover:bg-violet-600
text-white
font-semibold
px-8
py-3
rounded-xl
shadow-lg
hover:shadow-xl
hover:scale-105
transition-all
duration-300
"
                        >

                            Thank You ❤️

                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}