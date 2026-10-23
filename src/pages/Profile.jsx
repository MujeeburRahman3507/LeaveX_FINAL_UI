import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import profileService from "../services/profileService";
import toast from "react-hot-toast";
import { Camera, UserRound } from "lucide-react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [profile, setProfile] = useState({
    employeeCode: "",
    fullName: "",
    email: "",
    role: "",
    department: "",
    managerName: "",
    phone: "",
    address: "",
    profileImage: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setProfile((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await profileService.updateProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
        department: profile.department,
      });

      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maximum image size is 5MB");
      e.target.value = "";
      return;
    }

    try {
      setUploadingPhoto(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await profileService.uploadPhoto(formData);

      setProfile((prev) => ({
        ...prev,
        profileImage: response.data,
      }));

      toast.success("Profile photo uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Photo upload failed");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-violet-400 dark:disabled:border-gray-700 dark:disabled:bg-gray-800/70 dark:disabled:text-gray-400";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-64 items-center justify-center rounded-xl bg-white text-gray-600 shadow dark:border dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
            Loading Profile...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6 pb-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage your personal and contact information.
          </p>
        </div>

        {/* Profile card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          {/* Profile banner */}
          <div className="h-2 bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500" />

          <div className="p-5 sm:p-8">
            {/* Photo section */}
            <div className="mb-8 flex flex-col items-center gap-4 border-b border-gray-200 pb-8 dark:border-gray-700 sm:flex-row sm:items-center">
              <div className="relative">
                {profile.profileImage ? (
                  <img
               src={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"}${profile.profileImage}`}
                    alt="Profile"
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-violet-500 dark:border-gray-900"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-violet-100 text-violet-700 shadow-md ring-2 ring-violet-500 dark:border-gray-900 dark:bg-violet-950 dark:text-violet-300">
                    <UserRound size={48} />
                  </div>
                )}

                <label
                  title="Upload profile photo"
                  className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-violet-600 text-white shadow transition hover:bg-violet-700 dark:border-gray-900 dark:bg-violet-500 dark:hover:bg-violet-400"
                >
                  <Camera size={17} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {profile.fullName || "Your Profile"}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {profile.employeeCode || "Employee"}
                  {profile.role ? ` • ${profile.role}` : ""}
                </p>
                <p className="mt-2 text-sm text-violet-600 dark:text-violet-400">
                  {uploadingPhoto
                    ? "Uploading photo..."
                    : "Click the camera icon to change your photo"}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  JPG, PNG or other supported image formats · Maximum 5MB
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Employment Information
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Employee Code */}
                  <div>
                    <label className={labelClass}>Employee Code</label>
                    <input
                      value={profile.employeeCode || ""}
                      disabled
                      className={inputClass}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      value={profile.email || ""}
                      disabled
                      className={inputClass}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className={labelClass}>Role</label>
                    <input
                      value={profile.role || ""}
                      disabled
                      className={inputClass}
                    />
                  </div>

                  {/* Manager */}
                  <div>
                    <label className={labelClass}>Reporting Manager</label>
                    <input
                      value={profile.managerName || ""}
                      disabled
                      className={inputClass}
                    />
                  </div>

                  {/* Department */}
                  <div className="md:col-span-2">
                    <label className={labelClass}>Department</label>
                    <select
                      name="department"
                      value={profile.department || ""}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Department</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="FINANCE">Finance</option>
                      <option value="OPERATIONS">Operations</option>
                      <option value="CLAIMS">Claims</option>
                      <option value="SUPPORT">Support</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      name="fullName"
                      value={profile.fullName || ""}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone || ""}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className={labelClass}>Address</label>
                    <textarea
                      rows={4}
                      name="address"
                      value={profile.address || ""}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900"
                >
                  {saving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {saving ? "Saving Changes..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}