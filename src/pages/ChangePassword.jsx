import { useState } from "react";
import authService from "../services/authService";
import toast from "react-hot-toast";

export default function ChangePassword() {

  const [form, setForm] =
    useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value
      });
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await authService
          .changePassword(form);

        toast.success(
          "Password Changed Successfully"
        );

        setForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });

      } catch(err) {

        toast.error(
          err?.response?.data?.message ||
          "Failed to change password"
        );
      }
    };

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-6">
        Change Password
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={form.oldPassword}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        <button
          className="
          bg-violet-600
          text-white
          px-5
          py-3
          rounded
          "
        >
          Update Password
        </button>

      </form>

    </div>
  );
}