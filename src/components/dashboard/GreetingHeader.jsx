import {
  CloudSun,
  Moon,
  Sunrise
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function GreetingHeader() {

  const { user } = useAuth();

  const hour = new Date().getHours();

  let greeting = "Good Evening";
  let Icon = Moon;

  if (hour >= 5 && hour < 12) {

    greeting = "Good Morning";
    Icon = Sunrise;

  }
  else if (hour >= 12 && hour < 18) {

    greeting = "Good Afternoon";
    Icon = CloudSun;

  }

  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long"
      }
    );

  const userName =
    user?.username || "User";

  return (

    <div
      className="
        w-full
        rounded-2xl
        bg-gradient-to-r
        from-violet-600
        via-indigo-600
        to-purple-600
        text-white
        shadow-lg
        overflow-hidden
        relative
      "
    >

      {/* Decorative background */}

      <div
        className="
          absolute
          -right-10
          -top-16
          w-48
          h-48
          rounded-full
          bg-white/10
          blur-2xl
        "
      />

      <div
        className="
          absolute
          right-1/4
          bottom-0
          w-32
          h-20
          rounded-full
          bg-white/5
          blur-xl
        "
      />

      {/* Main Content */}

      <div
        className="
          relative
          px-4 py-3 sm:px-6 sm:py-5
          flex
          items-center
          justify-between
          gap-5
        "
      >

        {/* Greeting */}

        <div
          className="
            flex
            items-center
            gap-4
            min-w-0
          "
        >

          {/* Icon */}

          <div
            className="
              w-10 h-10 sm:w-14 sm:h-14
              shrink-0
              rounded-2xl
              bg-white/15
              border
              border-white/20
              flex
              items-center
              justify-center
              backdrop-blur-sm
            "
          >

            <Icon
              size={30}
              strokeWidth={1.8}
            />

          </div>


          {/* Text */}

          <div className="min-w-0">

            <h1
              className="
                text-base sm:text-2xl md:text-3xl
                font-bold
                tracking-tight
                sm:truncate leading-snug
              "
            >

              {greeting}, {userName}

            </h1>

            <div
              className="
                flex
                items-center
                gap-2
                mt-1
                text-violet-100
              "
            >

              <span className="text-sm">
                Welcome back to LeaveX 👋
              </span>

            </div>

          </div>

        </div>


        {/* Today */}

        <div
          className="
            hidden
            sm:flex
            items-center
            px-5
            py-3
            rounded-xl
            bg-white/10
            border
            border-white/15
            backdrop-blur-sm
            shrink-0
          "
        >

          <div className="text-right">

            <p
              className="
                text-[10px]
                uppercase
                tracking-wider
                text-violet-200
              "
            >
              Today
            </p>

            <p
              className="
                text-base
                font-semibold
              "
            >
              {today}
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}