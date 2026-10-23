import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import toast from "react-hot-toast";

export default function VerifyOtp() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const email =
    location.state?.email;

  const [otp, setOtp] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await authService
            .verifyOtp(
              email,
              otp
            );

        if(response.data === true){

          toast.success(
            "OTP Verified"
          );

          navigate(
            "/reset-password",
            {
              state: {
                email,
                otp
              }
            }
          );

        } else {

          toast.error(
            "Invalid OTP"
          );
        }

      } catch(err) {

        toast.error(
          "OTP Verification Failed"
        );
      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h2 className="text-2xl font-bold mb-6">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
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
            Verify OTP
          </button>

        </form>

      </div>

    </div>
  );
}