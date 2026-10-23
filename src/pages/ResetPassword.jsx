import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import toast from "react-hot-toast";

export default function ResetPassword() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const { email, otp } =
    location.state;

  const [password,
    setPassword] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await authService
          .resetPassword(
            email,
            otp,
            password
          );

        toast.success(
          "Password Reset Successful"
        );

        navigate("/login");

      } catch(err) {

        toast.error(
          "Failed to reset password"
        );
      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h2 className="text-2xl font-bold mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="border p-3 w-full rounded mb-4"
            required
          />

          <button
            className="
            bg-violet-600
            text-white
            w-full
            p-3
            rounded
            "
          >
            Reset Password
          </button>

        </form>

      </div>

    </div>
  );
}