import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Moon,
  Sun,
  ShieldCheck,
  Users,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import { motion } from "framer-motion";

import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);


  /* =====================================================
     FORM CHANGE
     ===================================================== */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

    if (error) {
      setError("");
    }
  };


  /* =====================================================
     LOGIN LOGIC
     NO CHANGE TO EXISTING AUTHENTICATION
     ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");

      const response =
        await authService.login(form);

      const authData =
        response.data;

      login(authData);

      const roles =
        authData.authorities;

      if (
        roles.includes("ROLE_ADMIN")
      ) {

        navigate("/admin");

      } else if (
        roles.includes("ROLE_MANAGER")
      ) {

        navigate("/manager");

      } else {

        navigate("/employee");

      }

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Invalid email or password. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div
      className={`
        min-h-screen
        flex
        ${
          darkMode
          ? "bg-[#0b0f19]"
          : "bg-slate-50"
        }
        transition-colors
        duration-300
      `}
    >

      {/* =====================================================
          LEFT CORPORATE PANEL
          ===================================================== */}

      <div
        className="
          hidden
          lg:flex
          lg:w-[55%]
          xl:w-[58%]
          relative
          overflow-hidden
          bg-gradient-to-br
          from-violet-700
          via-purple-700
          to-indigo-800
          text-white
        "
      >

        {/* Background decoration */}

        <div
          className="
            absolute
            -top-32
            -left-32
            w-96
            h-96
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-20
            w-[500px]
            h-[500px]
            rounded-full
            bg-indigo-400/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            top-1/3
            right-20
            w-40
            h-40
            rounded-full
            bg-purple-300/10
            blur-2xl
          "
        />


        <div
          className="
            relative
            z-10
            w-full
            max-w-2xl
            mx-auto
            px-12
            xl:px-20
            py-12
            flex
            flex-col
            justify-center
          "
        >

          {/* Company Logo */}

          <div
            className="
              flex
              items-center
              gap-4
              mb-10
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-white
                flex
                items-center
                justify-center
                shadow-xl
                p-2
              "
            >

              <img
                src="/boit-logo.png"
                alt="BOIT GLOBAL"
                className="
                  max-w-full
                  max-h-full
                  object-contain
                "
              />

            </div>

            <div>

              <h2
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                "
              >
                BOIT GLOBAL
              </h2>

              <p
                className="
                  text-violet-200
                  text-sm
                  mt-1
                "
              >
                LeaveX
              </p>

            </div>

          </div>


          {/* Illustration */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              flex
              justify-center
              mb-8
            "
          >

            <img
              src="/hr-illustration.png"
              alt="Leave Management"
              className="
                w-full
                max-w-md
                h-64
                object-contain
                drop-shadow-2xl
              "
            />

          </motion.div>


          {/* Heading */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >

            <h1
              className="
                text-4xl
                xl:text-5xl
                font-bold
                tracking-tight
                leading-tight
              "
            >
              Smarter Leave
              <br />
              Management
            </h1>

            <p
              className="
                mt-5
                text-violet-100
                text-lg
                leading-8
                max-w-xl
              "
            >
              Manage employee leave requests,
              approvals, balances and workforce
              planning from one centralized platform.
            </p>

          </motion.div>


          {/* Feature Cards */}

          <div
            className="
              grid
              grid-cols-3
              gap-4
              mt-10
            "
          >

            {/* Feature 1 */}

            <div
              className="
                bg-white/10
                backdrop-blur-md
                border
                border-white/10
                rounded-2xl
                p-4
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-white/15
                  flex
                  items-center
                  justify-center
                  mb-3
                "
              >

                <CalendarDays
                  size={20}
                />

              </div>

              <p
                className="
                  font-semibold
                  text-sm
                "
              >
                Easy Leave
              </p>

              <p
                className="
                  text-xs
                  text-violet-200
                  mt-1
                "
              >
                Simple requests
              </p>

            </div>


            {/* Feature 2 */}

            <div
              className="
                bg-white/10
                backdrop-blur-md
                border
                border-white/10
                rounded-2xl
                p-4
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-white/15
                  flex
                  items-center
                  justify-center
                  mb-3
                "
              >

                <Users
                  size={20}
                />

              </div>

              <p
                className="
                  font-semibold
                  text-sm
                "
              >
                Team Management
              </p>

              <p
                className="
                  text-xs
                  text-violet-200
                  mt-1
                "
              >
                Better visibility
              </p>

            </div>


            {/* Feature 3 */}

            <div
              className="
                bg-white/10
                backdrop-blur-md
                border
                border-white/10
                rounded-2xl
                p-4
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-white/15
                  flex
                  items-center
                  justify-center
                  mb-3
                "
              >

                <ShieldCheck
                  size={20}
                />

              </div>

              <p
                className="
                  font-semibold
                  text-sm
                "
              >
                Secure
              </p>

              <p
                className="
                  text-xs
                  text-violet-200
                  mt-1
                "
              >
                Protected access
              </p>

            </div>

          </div>


          {/* Bottom */}

          <div
            className="
              flex
              items-center
              gap-2
              mt-10
              text-sm
              text-violet-200
            "
          >

            <CheckCircle2
              size={16}
            />

            <span>
              BOIT family
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          RIGHT LOGIN PANEL
          ===================================================== */}

      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          px-5
          sm:px-8
          py-10
          relative
        "
      >

        {/* Theme button */}

        <button
          type="button"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className={`
            absolute
            top-6
            right-6
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center
            transition
            ${
darkMode
  ? "bg-[#182235] text-yellow-300 border border-slate-700/60 hover:bg-[#202c40] shadow-lg shadow-black/20"
  : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
            }
          `}
        >

          {darkMode
            ? <Sun size={19}/>
            : <Moon size={19}/>
          }

        </button>


        {/* Login Card */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className={`
            w-full
            max-w-md
            ${
darkMode
  ? "bg-[#111827] border-slate-700/60"
  : "bg-white border-slate-200"
            }
            border
            rounded-3xl
            shadow-2xl
            p-7
            sm:p-9
          `}
        >

          {/* Mobile Logo */}

          <div
            className="
              flex
              lg:hidden
              items-center
              justify-center
              mb-8
            "
          >

            <img
              src="/boit-logo.png"
              alt="BOIT GLOBAL"
              className="
                h-16
                object-contain
              "
            />

          </div>


          {/* Header */}

          <div
            className="
              text-center
              mb-8
            "
          >

            <div
              className="
                inline-flex
                items-center
                justify-center
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-br
                from-violet-600
                to-indigo-600
                text-white
                shadow-lg
                shadow-violet-500/25
                mb-5
              "
            >

              <ShieldCheck
                size={27}
              />

            </div>


            <h2
              className={`
                text-3xl
                font-bold
                tracking-tight
                ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }
              `}
            >
              Welcome Back
            </h2>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Sign in to your BOIT GLOBAL account
            </p>

          </div>


          {/* Error */}

          {error && (

            <motion.div
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mb-5
                rounded-xl
                border
border-red-200
dark:border-red-500/30
bg-red-50
dark:bg-red-500/10
text-red-600
dark:text-red-300
                px-4
                py-3
                text-sm
                text-red-600
              "
            >

              {error}

            </motion.div>

          )}


          {/* Login Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-slate-300
                  mb-2
                "
              >
                Email Address
              </label>

              <div
                className="
                  relative
                  group
                "
              >

                <Mail
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    group-focus-within:text-violet-600
                    transition
                  "
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`
                    w-full
                    pl-12
                    pr-4
                    py-3.5
                    rounded-xl
                    border
                    outline-none
                    transition
                    ${
darkMode
  ? "bg-[#182235] border-slate-600/60 text-white placeholder:text-slate-500"
  : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    }
                    focus:border-violet-500
                    focus:ring-4
                    focus:ring-violet-500/10
                  `}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-slate-300
                  mb-2
                "
              >
                Password
              </label>

              <div
                className="
                  relative
                  group
                "
              >

                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    group-focus-within:text-violet-600
                    transition
                  "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`
                    w-full
                    pl-12
                    pr-12
                    py-3.5
                    rounded-xl
                    border
                    outline-none
                    transition
                    ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    }
                    focus:border-violet-500
                    focus:ring-4
                    focus:ring-violet-500/10
                  `}
                  required
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    hover:text-violet-600
                    transition
                  "
                >

                  {showPassword
                    ? <EyeOff size={18}/>
                    : <Eye size={18}/>
                  }

                </button>

              </div>

            </div>


            {/* REMEMBER / FORGOT */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <label
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-slate-600
                  dark:text-slate-400
                  cursor-pointer
                "
              >

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() =>
                    setRememberMe(
                      !rememberMe
                    )
                  }
                  className="
                    w-4
                    h-4
                    rounded
                    accent-violet-600
                  "
                />

                Remember me

              </label>


              <Link
                to="/forgot-password"
                className="
                  text-sm
                  font-semibold
                  text-violet-600
                  hover:text-violet-700
                  hover:underline
                  transition
                "
              >
                Forgot Password?
              </Link>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3.5
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-indigo-600
                hover:from-violet-700
                hover:to-indigo-700
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                shadow-violet-500/20
                hover:shadow-xl
                transition-all
                duration-300
              "
            >

              {loading
                ? (
                  <>
                    <span
                      className="
                        w-5
                        h-5
                        border-2
                        border-white/40
                        border-t-white
                        rounded-full
                        animate-spin
                      "
                    />

                    Signing In...
                  </>
                )
                : (
                  <>
                    Sign In

                    <ArrowRight
                      size={18}
                    />

                  </>
                )
              }

            </button>

          </form>


          {/* Security Information */}

          <div
            className={`
              mt-7
              rounded-2xl
              p-4
              flex
              items-start
              gap-3
              ${
darkMode
  ? "bg-violet-500/10 border border-violet-400/10"
  : "bg-violet-50"
              }
            `}
          >

            <div
              className="
                w-9
                h-9
                rounded-lg
dark:bg-violet-500/15
dark:text-violet-300
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >

              <ShieldCheck
                size={18}
              />

            </div>

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-slate-200
                "
              >
                Secure Access
              </p>

              <p
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                  mt-1
                  leading-5
                "
              >
                Your account and leave information
                are protected with secure authentication.
              </p>

            </div>

          </div>


          {/* Footer */}

          <div
            className="
              mt-8
              text-center
            "
          >

            <p
              className="
                text-xs
                text-slate-400
              "
            >
              © 2026 BOIT GLOBAL
            </p>

            <p
              className="
                text-[11px]
                text-slate-400
                mt-1
              "
            >
              Leave Management System
            </p>

          </div>

        </motion.div>

      </div>

    </div>

  );
}