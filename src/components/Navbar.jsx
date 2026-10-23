import {
  Bell,
  Moon,
  Sun,
  Menu,
  LogOut,
  Search
} from "lucide-react";

import {
 useTheme
}
from "../context/ThemeContext";

import { useEffect } from "react";
import notificationService
from "../services/notificationService";

import { useState }
from "react";

import { useAuth }
from "../context/AuthContext";

import profileService from "../services/profileService";

export default function Navbar({
  setSidebarOpen
}) {

  const {
 darkMode,
 toggleTheme
} = useTheme();

const [showNotifications,
setShowNotifications]
=
useState(false);

const [notifications,
setNotifications]
=
useState([]);

const [unreadCount,
setUnreadCount]
=
useState(0);

useEffect(() => {

  const loadProfile =
async () => {

  try {

    const response =
      await profileService
        .getProfile();

    setProfileImage(
      response.data.profileImage
    );

  } catch(error) {

    console.error(error);

  }
};

loadProfile();

  loadNotifications();

  const interval =
    setInterval(() => {

      loadNotifications();

    }, 5000);

  return () =>
    clearInterval(interval);

}, []);

const loadNotifications =
async () => {

  try {

    const notificationResponse =
      await notificationService
        .getNotifications();

    const countResponse =
      await notificationService
        .getUnreadCount();

    setNotifications(
      notificationResponse.data
    );

    setUnreadCount(
      countResponse.data
    );

  } catch(error) {

    console.error(error);

  }
};

const handleMarkRead =
async (id) => {

  try {

    await notificationService
      .markAsRead(id);

    setNotifications(prev =>
      prev.filter(
        n => n.id !== id
      )
    );

    const countResponse =
      await notificationService
        .getUnreadCount();

    setUnreadCount(
      countResponse.data
    );

  } catch(error) {

    console.error(error);

  }
};

const handleMarkAllRead =
async () => {

  try {

    await notificationService
      .markAllAsRead();

    setNotifications([]);

    setUnreadCount(0);

  } catch(error) {

    console.error(error);

  }
};

const [profileImage,
setProfileImage] =
useState(null);

  const {
    user,
    logout
  } = useAuth();

  return (

    <header
className="
h-[72px]
flex
items-center
justify-between
px-8
bg-white
dark:bg-slate-800
border-b
border-slate-200
dark:border-slate-700
"
>

      <div className="
        flex
        items-center
        gap-4
      ">

        <button
          className="lg:hidden"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          <Menu />
        </button>

        <div className="
          relative
          hidden
          md:block
        ">

          {/* <Search
            size={18}
            className="
              absolute
              left-3
              top-3
              text-slate-400
            "
          />

          <input
            placeholder="Search..."
            className="
              pl-10
              h-11
              w-80
              rounded-xl
              border
              border-slate-200
              bg-slate-50
            "
          /> */}

        </div>

      </div>

      <div className="
        flex
        items-center
        gap-6
      ">

        {/* <Bell
          className="
            text-slate-500
          "
        /> */}

   <div className="relative">

  <button
    onClick={() =>
      setShowNotifications(
        !showNotifications
      )
    }
  >

    <Bell />

  </button>

{
 unreadCount > 0 && (

  <span
   className="
   absolute
   -top-1
   -right-1
   bg-red-500
   text-white
   text-xs
   rounded-full
   w-5
   h-5
   flex
   items-center
   justify-center
   "
  >

   {unreadCount}

  </span>

 )
}

  {showNotifications && (

    <div
      className="
      notif-dropdown
      absolute
      right-0
      mt-3
      w-72
      bg-white
      dark:bg-slate-800
      rounded-xl
      shadow-lg
      border
      z-50
      "
    >

      <div className="p-4">

    <div className="flex justify-between mb-3">

  <h3 className="font-semibold">

    Notifications

  </h3>

  {
    notifications.length > 0 && (

      <button
        onClick={handleMarkAllRead}
        className="
        text-blue-600
        text-sm
        "
      >
        Mark All Read
      </button>

    )
  }

</div>

{
notifications.length === 0
? (

<div className="text-sm text-slate-500">
  No Notifications
</div>

)
: (

notifications.map(
(notification) => (

<div
key={notification.id}
className="
border-b
p-3
"
>

<div className="font-semibold">
  {notification.title}
</div>

<div className="text-sm text-slate-500 mb-2">
  {notification.message}
</div>

<button
  onClick={() =>
    handleMarkRead(
      notification.id
    )
  }
  className="
  text-violet-600
  text-xs
  font-medium
  hover:underline
  "
>
  Mark as Read
</button>

</div>

))
)
}

      </div>

    </div>

  )}

</div>

        <div className="
          flex
          items-center
          gap-3
        ">

          <button
 onClick={
   toggleTheme
 }
className="
p-2
rounded-full
bg-slate-100
dark:bg-slate-700
text-slate-700
dark:text-slate-200
hover:bg-slate-200
dark:hover:bg-slate-600
transition
"
>
 {darkMode
   ? <Sun size={18}/>
   : <Moon size={18}/>
 }
</button>

 <div
 className="
 hidden lg:block w-10
 h-10
 rounded-full
 overflow-hidden
 "
>

 {profileImage ? (

   <img
     src={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"}${profileImage}`}
     onError={(e) => { e.currentTarget.style.display = "none"; }}
     alt="Profile"
     className="
     w-full
     h-full
     object-cover
     "
   />

 ) : (

   <div
     className="
     w-full
     h-full
     bg-violet-600
     text-white
     flex
     items-center
     justify-center
     font-semibold
     "
   >
     {user?.username?.charAt(0)}
   </div>

 )}

</div>

          <span className="
            hidden lg:inline font-medium
        text-slate-700
dark:text-slate-200
          ">
            {user?.username}
          </span>

        </div>

        <button
          onClick={logout}
        >
          <LogOut
            className="
              text-red-500
            "
          />
        </button>

      </div>

    </header>
  );
}