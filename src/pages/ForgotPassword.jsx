import { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await authService
          .forgotPassword(email);

        toast.success(
          "OTP sent successfully"
        );

        navigate(
          "/verify-otp",
          {
            state: { email }
          }
        );

      } catch(err) {

        toast.error(
          err?.response?.data ||
          "Failed to send OTP"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h2 className="text-2xl font-bold mb-6">

          Forgot Password

        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="border p-3 w-full rounded mb-4"
            required
          />

          <button
            disabled={loading}
            className="
            bg-violet-600
            text-white
            w-full
            p-3
            rounded
            "
          >
            {
              loading
              ? "Sending..."
              : "Send OTP"
            }
          </button>

        </form>

      </div>

    </div>
  );
}