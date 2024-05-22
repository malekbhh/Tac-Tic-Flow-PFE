import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

function Profile() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { user } = useStateContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setPhotoPreview(user.avatar);
      setName(user.name);
      setEmail(user.email);
    };

    fetchUser();
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(file);
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (photo) {
      formData.append("avatar", photo);
    }
    formData.append("name", name);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
      formData.append("password_confirmation", confirmPassword);
    }

    try {
      const response = await axiosClient.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        const responseData = response.data;
        setPhotoPreview(responseData.user.avatar);
        console.log("Profile updated successfully!");
        window.location.reload();
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, and one symbol."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    if (event.target.value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className=" w-[90%]  flex mt-4 justify-center items-center">
      <form
        onSubmit={handleFormSubmit}
        className="flex w-[400px] flex-col justify-center items-center px-4 pt-4 pb-8 shadow-lg rounded-2xl dark:bg-black dark:bg-opacity-30 bg-white bg-opacity-10"
      >
        <div className="p-6 flex items-center">
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Profile Picture"
              className="profile-picture h-20 w-20 rounded-full mr-4 object-cover"
            />
          )}
          <div className="flex-grow">
            <h2 className="text-xl font-semibold dark:text-white text-gray-800 mb-2">
              Profile Information
            </h2>
          </div>
        </div>
        <div className=" py-2">
          <div className="mb-3 mx-6">
            <label
              htmlFor="name"
              className="block text-sm dark:text-gray-300 font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="bg-white bg-opacity-80 dark:bg-black dark:bg-opacity-40 dark:text-gray-300 shadow-md rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
              value={name}
              placeholder="Change new name"
              onChange={handleNameChange}
            />
          </div>
          <div className="mb-3 mx-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium dark:text-gray-300 text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-white bg-opacity-80 dark:bg-black dark:bg-opacity-40  dark:text-gray-300 shadow-md rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
              value={email}
              placeholder="change new email"
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-3 mx-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium dark:text-gray-300 text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="bg-white bg-opacity-80 dark:bg-black dark:bg-opacity-40 dark:text-gray-300 shadow-md rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
              value={password}
              placeholder="change new password"
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className=" mx-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium dark:text-gray-300 text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="bg-white bg-opacity-80 dark:bg-black dark:bg-opacity-40 dark:text-gray-300 shadow-md rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
              value={confirmPassword}
              placeholder="confirm new password"
              onChange={handleConfirmPasswordChange}
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>
          <div className="p-6">
            <div>
              <label
                htmlFor="photo"
                className="block text-sm dark:text-gray-300 font-medium text-gray-700"
              >
                Photo
              </label>
              <div className="flex items-center mt-1">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <label className="ml-4 shadow-m rounded-xl px-4 py-3 dark:text-gray-300 cursor-pointer bg-white bg-opacity-80 dark:bg-black dark:bg-opacity-40 text-sm font-medium shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Upload
                  <input
                    id="file-upload"
                    name="avatar"
                    type="file"
                    className="sr-only"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="border-t pt-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white py-2 px-4 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014.01 12H0c0 3.042 1.135 5.824 2.998 7.956l3.003-2.665zM12 20c1.988 0 3.822-.73 5.22-1.936l-3.003-2.665A7.96 7.96 0 0112 20zm6.002-7.956A7.963 7.963 0 0120 12h-4c0 2.367-1.012 4.496-2.634 6.005l3.636 3.218z"
                  ></path>
                </svg>
              ) : (
                <button
                  type="submit"
                  className="dark:bg-indigo-600 bg-midnightblue py-2 px-4 text-center text-white rounded-xl shadow-sm sm:text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;
