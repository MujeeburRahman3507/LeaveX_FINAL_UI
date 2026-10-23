import {
    useEffect,
    useState
} from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BirthdayPopup from "../components/BirthdayPopup";
import MobileBottomNav from "../components/MobileBottomNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import birthdayService from "../services/birthdayService";


export default function EnterpriseLayout({
    children
}) {


    

    const [
        sidebarOpen,
        setSidebarOpen
    ] = useState(false);


    const { user } = useAuth();

    
const location = useLocation();
const navigate = useNavigate();

// close the slide-in sidebar whenever the route changes (mobile)
useEffect(() => {
    setSidebarOpen(false);
}, [location.pathname]);

const rawRole =
    user?.role ||
    user?.roles?.[0] ||
    user?.authorities?.[0]?.authority ||
    "";

const role = String(rawRole)
    .replace("ROLE_", "")
    .toUpperCase();

const dashboardPath = {
    EMPLOYEE: "/employee",
    MANAGER: "/manager",
    ADMIN: "/admin",
}[role] || "/login";

const isDashboard = [
    "/employee",
    "/manager",
    "/admin",
].includes(location.pathname);

const fallbackRoutes = {
    "/admin/sla-management": "/admin",
    "/admin/backdated-leave": "/admin",
    "/admin/appraisal-cycles": "/admin",
    "/admin/appraisals": "/admin",
    "/admin/notification-templates": "/admin",
    "/admin/reports": "/admin",
    "/admin/audit-logs": "/admin",
    "/admin/holidays": "/admin",
    "/admin/leave-policies": "/admin",
    "/admin/employees": "/admin",
    "/admin/approvals": "/admin",
    "/admin/document-review": "/admin",
    "/manager/appraisals": "/manager",
    "/manager/calendar": "/manager",
    "/manager/my-leaves": "/manager",
    "/manager/apply-leave": "/manager",
    "/employee/appraisal": "/employee",
};

const handleBack = () => {
    const fallback =
        fallbackRoutes[location.pathname] || dashboardPath;

    if (window.history.state?.idx > 0) {
        navigate(-1);
    } else {
        navigate(fallback, { replace: true });
    }
};


    const [
        birthdayPopupOpen,
        setBirthdayPopupOpen
    ] = useState(false);


    const [
        birthdayGreeting,
        setBirthdayGreeting
    ] = useState(null);


    // =========================================================
    // CHECK LOGGED-IN USER BIRTHDAY
    // =========================================================

  useEffect(() => {

    console.log("BIRTHDAY LAYOUT USER:", user);

    if (!user) {
        console.log("No logged-in user yet");
        return;
    }

    loadBirthdayGreeting();

}, [user]);


   const loadBirthdayGreeting = async () => {

    try {

        const rawRole =
            user?.role ||
            user?.roles?.[0] ||
            user?.authorities?.[0]?.authority ||
            "";

        const role =
            String(rawRole)
                .replace("ROLE_", "")
                .toUpperCase();

        console.log(
            "BIRTHDAY ROLE:",
            rawRole,
            "=>",
            role
        );


  if (
    role !== "EMPLOYEE" &&
    role !== "MANAGER" &&
    role !== "ADMIN"
) {
    console.log(
        "Birthday popup skipped. Unsupported role:",
        role
    );
    return;
}


        let response;


        if (role === "MANAGER") {

            console.log(
                "Calling MANAGER birthday API..."
            );

            response =
                await birthdayService
                    .getManagerBirthdayGreeting();

        } else {

            console.log(
                "Calling EMPLOYEE birthday API..."
            );

            response =
                await birthdayService
                    .getBirthdayGreeting();

        }


        console.log(
            "BIRTHDAY API RESPONSE:",
            response
        );


        const data =
            response.data?.data ||
            response.data ||
            null;


        if (!data) {

            console.log(
                "Birthday API returned no data"
            );

            return;

        }


        console.log(
            "BIRTHDAY DATA:",
            data
        );


        setBirthdayGreeting(data);


        if (data.birthday !== true) {

            console.log(
                "Today is not this user's birthday."
            );

            return;

        }


        const userKey =
            user?.id ||
            user?.userId ||
            user?.username ||
            user?.email ||
            "user";


        const popupKey =
            `birthday-popup-${userKey}`;


        const alreadyShown =
            sessionStorage.getItem(popupKey);


        if (alreadyShown) {

            console.log(
                "Birthday popup already shown:",
                popupKey
            );

            return;

        }


        setBirthdayPopupOpen(true);


        sessionStorage.setItem(
            popupKey,
            "true"
        );


    } catch (error) {

        console.error(
            "Birthday API failed:",
            error
        );

    }

};


    return (

        <div className="
            app-layout
            min-h-screen
            bg-slate-50
            dark:bg-slate-900
            text-slate-900
            dark:text-slate-100
        ">

            {/* dark backdrop behind the mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[45] bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <MobileBottomNav
                onMenu={() => setSidebarOpen(true)}
            />


            <div className="
                page-content
                min-h-screen
                bg-slate-50
                dark:bg-slate-900
                flex
                flex-col
            ">

                <Navbar
                    setSidebarOpen={setSidebarOpen}
                />


                <div className="
                    page-scroll
                    flex-1
                    overflow-auto
                    bg-slate-50
                    dark:bg-slate-900
                ">

   {!isDashboard && (
    <div className="mb-4 flex items-center">
        <button
            type="button"
            onClick={handleBack}
            className="
                inline-flex items-center gap-2
                rounded-lg border border-slate-200
                bg-white px-4 py-2
                text-sm font-medium text-slate-700
                shadow-sm transition-all
                hover:border-violet-300
                hover:bg-violet-50
                hover:text-violet-700
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-200
                dark:hover:bg-slate-700
            "
        >
            <ArrowLeft size={17} />
            <span>Back</span>
        </button>
    </div>
)}
                 

                    <div className="
                        page-wrapper
                        min-h-full
                        bg-slate-50
                        dark:bg-slate-900
                    ">

                        {children}

                    </div>

                </div>

            </div>


            {/* =================================================
                PERSONAL BIRTHDAY POPUP
            ================================================= */}

            {birthdayGreeting && (

                <BirthdayPopup

                    open={birthdayPopupOpen}

                    employeeName={
                        birthdayGreeting.employeeName ||
                        user?.username ||
                        "User"
                    }

                    message={
                        birthdayGreeting.message ||
                        "Wishing you a very Happy Birthday!"
                    }

                    onClose={() =>
                        setBirthdayPopupOpen(false)
                    }

                />

            )}

        </div>

    );

}