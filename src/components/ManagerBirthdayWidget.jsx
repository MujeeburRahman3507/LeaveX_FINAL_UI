import {
    useEffect,
    useState
} from "react";

import {
    Cake,
    Mail,
    Briefcase,
    Gift
} from "lucide-react";

import birthdayService
from "../services/birthdayService";


export default function ManagerBirthdayWidget() {

    const [
        birthdays,
        setBirthdays
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);


    useEffect(() => {

        loadBirthdays();

    }, []);


    const loadBirthdays =
        async () => {

            try {

                const response =
                    await birthdayService
                        .getTodaysBirthdays();

                setBirthdays(
                    response.data?.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load birthdays:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


    const getInitials = (
        name
    ) => {

        if (!name)
            return "?";

        return name
            .split(" ")
            .map(word =>
                word.charAt(0)
            )
            .join("")
            .substring(0, 2)
            .toUpperCase();

    };


    if (loading) {

        return (

            <div
                className="
                bg-white
                dark:bg-slate-800
                rounded-2xl
                shadow-sm
                dark:shadow-slate-950/30
                border
                border-slate-100
                dark:border-slate-700
                p-6
                "
            >

                <div className="text-center py-12">

                    Loading Birthdays...

                </div>

            </div>

        );

    }


    return (

        <div
            className="
            bg-white
            dark:bg-slate-800
            rounded-2xl
            shadow-sm
            dark:shadow-slate-950/30
            border
            border-slate-100
            dark:border-slate-700
            p-6
            hover:shadow-lg
            transition
            "
        >

            {/* Header */}

            <div
                className="
                flex
                justify-between
                items-center
                mb-6
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
                        bg-pink-100
                        flex
                        items-center
                        justify-center
                        "
                    >

                        <Cake
                            size={22}
                            className="text-pink-600"
                        />

                    </div>


                    <div>

                        <h2
                            className="
                            text-lg
                            font-bold
                            text-slate-800
                            dark:text-white
                            "
                        >

                            Today's Birthdays

                        </h2>


                        <p
                            className="
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                            "
                        >

                            Celebrate your team 🎉

                        </p>

                    </div>

                </div>


                <span
                    className="
                    bg-pink-50
                    text-pink-600
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    "
                >

                    {birthdays.length}

                </span>

            </div>


            {/* No Birthdays */}

            {
                birthdays.length === 0

                    ?

                    (

                        <div
                            className="
                            text-center
                            py-12
                            "
                        >

                            <div
                                className="
                                w-20
                                h-20
                                mx-auto
                                rounded-full
                                bg-slate-100
                                dark:bg-slate-700
                                flex
                                items-center
                                justify-center
                                mb-4
                                "
                            >

                                <Gift
                                    size={36}
                                    className="text-slate-400"
                                />

                            </div>


                            <p
                                className="
                                font-semibold
                                text-slate-600
                                dark:text-slate-200
                                "
                            >

                                No Birthdays Today

                            </p>


                            <p
                                className="
                                text-sm
                                text-slate-400
                                mt-2
                                "
                            >

                                Nobody is celebrating today.

                            </p>

                        </div>

                    )

                    :

                    (

                        <div
                            className="
                            space-y-4
                            max-h-[360px]
                            overflow-y-auto
                            "
                        >

                            {

                                birthdays.map(

                                    employee => (

                                        <div

                                            key={employee.id}

                                            className="
                                            flex
                                            items-center
                                            justify-between
                                            rounded-xl
                                            border
                                            border-slate-100
                                            dark:border-slate-700
                                            p-4
                                            hover:bg-violet-50
                                            dark:hover:bg-slate-700/50
                                            transition
                                            "
                                        >

                                            <div
                                                className="
                                                flex
                                                items-center
                                                gap-4
                                                "
                                            >

                                                {

                                                    employee.profileImage

                                                        ?

                                                        (

                                                            <img

                                                                src={
                                                                    employee.profileImage
                                                                }

                                                                alt="profile"

                                                                className="
                                                                w-14
                                                                h-14
                                                                rounded-full
                                                                object-cover
                                                                border
                                                                "

                                                            />

                                                        )

                                                        :

                                                        (

                                                            <div
                                                                className="
                                                                w-14
                                                                h-14
                                                                rounded-full
                                                                bg-gradient-to-r
                                                                from-violet-500
                                                                to-indigo-600
                                                                text-white
                                                                font-bold
                                                                flex
                                                                items-center
                                                                justify-center
                                                                text-lg
                                                                "
                                                            >

                                                                {
                                                                    getInitials(
                                                                        employee.fullName
                                                                    )
                                                                }

                                                            </div>

                                                        )

                                                }


                                                <div>

                                                    <h3
                                                        className="
                                                        font-semibold
                                                        text-slate-800
                                                        dark:text-white
                                                        "
                                                    >

                                                        {
                                                            employee.fullName
                                                        }

                                                    </h3>


                                                    <div
                                                        className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-sm
                                                        text-slate-500
                                                        dark:text-slate-400
                                                        mt-1
                                                        "
                                                    >

                                                        <Briefcase
                                                            size={14}
                                                        />

                                                        {
                                                            employee.department
                                                        }

                                                    </div>


                                                    <div
                                                        className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-sm
                                                        text-slate-500
                                                        dark:text-slate-400
                                                        mt-1
                                                        "
                                                    >

                                                        <Mail
                                                            size={14}
                                                        />

                                                        {
                                                            employee.email
                                                        }

                                                    </div>

                                                </div>

                                            </div>


                                            <div
                                                className="
                                                text-right
                                                "
                                            >

                                                <div
                                                    className="
                                                    bg-pink-100
                                                    text-pink-600
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-xs
                                                    font-semibold
                                                    "
                                                >

                                                    🎂 Happy Birthday

                                                </div>

                                            </div>

                                        </div>

                                    )

                                )

                            }

                        </div>

                    )

            }


            {/* Footer */}

            <div
                className="
                mt-6
                rounded-xl
                bg-pink-50
                dark:bg-pink-900/20
                text-pink-600
                dark:text-pink-300
                text-center
                py-3
                font-medium
                "
            >

                🎉 BOIT GLOBAL wishes everyone a Happy Birthday!

            </div>

        </div>

    );

}