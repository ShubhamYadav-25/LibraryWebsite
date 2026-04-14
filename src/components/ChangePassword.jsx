import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";

const ChangePasswordPopup = ({ isOpen, onClose}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
        const response = await api.put(
        "/auth/password",
        {
          currentpassword: currentPassword,
          updatedpassword: newPassword,
        },
        { withCredentials: true }
      );
      console.log(response.status);
      if (response.status === 200) {
       toast.success("Password updated successfully!");
       setCurrentPassword("");
       setNewPassword("");
       setConfirmPassword("");
       onClose();
      }
    } catch (error) {
        toast.error(" Profile updated unsuccessfully!")
    }
    
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-80">
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            type="password"
            placeholder="Re-enter New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;