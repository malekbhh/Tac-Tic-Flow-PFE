// ProjectMembers.jsx
import React from "react";
import { Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axiosClient from "../../axios-client";
import toast, { Toaster } from "react-hot-toast";

const ProjectMembers = ({
  members,
  updateNotifications,
  setShowMembers,
  project,
  projectId,
  updateMembersList,
}) => {
  const handleRemoveMember = async (userId, memberName) => {
    try {
      // Effectuez une requête DELETE au serveur pour supprimer le membre du projet
      await axiosClient.delete(`/remove-member-from-project`, {
        data: { projectId, userId },
      });
      const updatedMembers = members.filter((member) => member.id !== userId);
      updateMembersList(updatedMembers);
      toast.success("Member removed successfully");
      sendNotificationToUser(userId);
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member. Please try again.");
    }
  };
  const sendNotificationToUser = (userId) => {
    const notificationMessage = `Vous avez été supprimé du projet ${project.title} par le chef de projet.`;

    axiosClient
      .post("/send-notification", {
        notification: notificationMessage,
        receiver_id: userId,
      })
      .then((response) => {
        console.log("Notification envoyée avec succès :", response);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de la notification :", error);
      });
  };
  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setShowMembers(false);
      }}
      className="  py-6 px-6 pb-40 fixed z-[100] overflow-y-scroll left-0 flex justify-center items-center right-0  bottom-0 top-0 bg-[#00000050]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={` flex flex-col justify-start pt-11 items-center  mx-0 overflow-y-auto  rounded-lg h-96 shadow-md bg-white    dark:bg-slate-900  w-[450px]`}
      >
        {" "}
        <p className="text-midnightblue dark:text-indigo-500 font-bold ">
          Members
        </p>
        <table className=" mt-4 dark:text-gray-400 text-midnightblue ">
          <thead>
            <tr>
              <th className=" py-2 ">Profil</th>
              <th className="py-2 ">Email</th>
              <th className=" py-2 ">Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {members.map((member) => (
              <tr
                className="border-t-2 border-b-2 border-indigo-300 "
                key={member.id}
              >
                <td className="pl-2 pr-5 py-2  flex items-end">
                  {member.avatar ? (
                    <img
                      className="w-8 h-8 rounded-full mr-2"
                      src={member.avatar}
                      alt="Avatar"
                    />
                  ) : (
                    <Avatar
                      className="w-8 h-8 rounded-full mr-2 "
                      icon={<UserOutlined />}
                    />
                  )}

                  {member.name}
                </td>
                <td className=" py-2 pl-6">{member.email}</td>
                <td className="px-4 flex items-center justify-center py-2">
                  <button
                    onClick={() => handleRemoveMember(member.id, member.name)}
                    className="dark:bg-blue-500 bg-midnightblue flex hover:bg-blue-700 text-gray-300 font-bold py-1 px-4 items-center justify-center rounded-full "
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectMembers;
