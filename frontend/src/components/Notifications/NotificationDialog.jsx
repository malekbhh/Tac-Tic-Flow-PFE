// NotificationDialog.jsx
import React from "react";
import NotificationComponent from "./NotificationComponent";
import axiosClient from "../../axios-client";
import { useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
const NotificationDialog = ({ isOpen, onClose }) => {
  const { setUser, setUnreadNotifications } = useStateContext(); // Modifiez cette ligne

  const updateUnreadNotifications = async () => {
    try {
      await axiosClient.post("/notifications/update-unread", {
        unreadNotifications: 0,
      });
      // Mettre à jour l'état de l'utilisateur pour refléter le changement
      setUser((prevUser) => ({
        ...prevUser,
        unreadNotifications: 0,
      }));
      setUnreadNotifications(0);
    } catch (error) {
      console.error("Error updating unread notifications:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateUnreadNotifications();
    }
  }, [isOpen]);
  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed inset-0 overflow-y-auto z-50`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center ">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>
        <div
          className="inline-block align-bottom bg-white rounded-lg p-8 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <NotificationComponent />
        </div>
      </div>
    </div>
  );
};

export default NotificationDialog;
