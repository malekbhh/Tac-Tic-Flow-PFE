import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import axiosClient from "../axios-client";
import SelectPriority from "./test/SelectPriority";
import { FiX } from "react-icons/fi";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

function EditTask({
  task,
  handleCloseEdit,
  setTasks,
  userAvatar,
  isChef,
  userName,
}) {
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDueDate, setEditedDueDate] = useState(new Date(task.due_date));
  const [priority, setPriority] = useState(task.priority);
  const [linkUrl, setLinkUrl] = useState("");
  const [taskLinks, setTaskLinks] = useState([]);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleRemoveMember = async () => {
    try {
      const response = await axiosClient.put(`/tasks/${task.id}/remove-member`);

      if (response.status === 200) {
        setTasks((prevTasks) => {
          const updatedTasks = [...prevTasks];
          const index = updatedTasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            updatedTasks[index] = {
              ...updatedTasks[index],
              user_id: null,
            };
          }
          return updatedTasks;
        });

        toast.success("Member removed successfully!");
      } else {
        toast.error("Error removing member.");
      }
    } catch (error) {
      console.error("Error removing member:", error.message);
      toast.error(`Error removing member: ${error.message}`);
    }
  };

  useEffect(() => {
    console.log(userName);
    const fetchTaskLinks = async () => {
      try {
        const linksResponse = await axiosClient.get(`/tasks/${task.id}/links`);
        setTaskLinks(linksResponse.data.links || []);
      } catch (error) {
        console.error("Error fetching task links:", error);
        toast.error("Failed to fetch task links.");
      }
    };
    fetchTaskLinks();
  }, [task.id]);

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editedTitle);

      const formattedDueDate =
        editedDueDate instanceof Date
          ? editedDueDate.toISOString().split("T")[0]
          : null;

      if (formattedDueDate !== task.due_date) {
        formData.append("due_date", formattedDueDate);
      }

      if (priority !== task.priority) {
        formData.append("priority", priority);
      }
      if (editedDescription !== task.description) {
        formData.append("description", editedDescription);
      }

      const response = await axiosClient.post(
        `/tasksUpdate/${task.id}`,
        formData
      );

      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        const index = updatedTasks.findIndex(
          (t) => t.id === response.data.task.id
        );
        if (index !== -1) {
          updatedTasks[index] = response.data.task;
        } else {
          updatedTasks.push(response.data.task);
        }
        return updatedTasks;
      });

      toast.success("Task updated successfully!");
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task. Please try again.");
    }
  };

  const handleLinkUrlSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post(
        `/tasks/${task.id}/add-link-url`,
        {
          linkUrl,
        }
      );
      setTaskLinks((prevLinks) => [...prevLinks, response.data.link]);
      setLinkUrl("");
      toast.success("Link added successfully!");
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to add link.");
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      const response = await axiosClient.delete(`/links/${linkId}`);

      if (response.status === 200) {
        setTaskLinks((prevLinks) =>
          prevLinks.filter((link) => link.id !== linkId)
        );
        toast.success("Link deleted successfully!");
      } else {
        toast.error("Error deleting link.");
      }
    } catch (error) {
      console.error("Error deleting link:", error.message);
      toast.error(`Error deleting link: ${error.message}`);
    }
  };

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-70 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">
            Edit Task
          </h2>
          <button
            onClick={handleCloseEdit}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>
        {isChef ? (
          <>
            <form onSubmit={handleEditTask} className="flex flex-col gap-4">
              <div className="text-gray-700 dark:text-gray-300">
                <label htmlFor="title" className="block text-sm font-medium ">
                  Title
                </label>
                <input
                  id="title"
                  className="mt-1 p-2 block w-full shadow-sm sm:text-sm dark:bg-transparent dark:border-b border-gray-300 rounded-md"
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium "
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="mt-1 p-2 block w-full shadow-sm sm:text-sm dark:bg-transparent dark:border-b border-gray-300 rounded-md"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label
                  htmlFor="due_date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Due Date
                </label>
                <div className="w-full">
                  <DatePicker
                    id="due_date"
                    className="mt-1 p-2 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm dark:bg-transparent dark:border-b border-gray-300 rounded-md"
                    selected={editedDueDate}
                    onChange={(date) => setEditedDueDate(date)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </label>
                <SelectPriority priority={priority} setPriority={setPriority} />
                <span
                  className={`h-6 w-6 rounded-full ${
                    priority === "low"
                      ? "bg-green-400"
                      : priority === "medium"
                      ? "bg-orange"
                      : "bg-red-500"
                  } border border-gray-300`}
                ></span>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition-colors"
                >
                  Edit
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-center items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name: {task.title}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Deadline: {task.due_date}
              </p>
              <div className="flex justify-center items-center gap-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority: {task.priority}
                </p>
                <span
                  className={`h-6 w-6 rounded-full ${
                    priority === "low"
                      ? "bg-green-400"
                      : priority === "medium"
                      ? "bg-orange"
                      : "bg-red-500"
                  } border border-gray-300`}
                ></span>
              </div>
              <p
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                style={{ maxWidth: "300px", wordWrap: "break-word" }}
              >
                Description: {task.description}
              </p>
            </div>

            <form onSubmit={handleLinkUrlSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="linkUrl"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Link URL
                </label>
                <div className="flex justify-center items-center gap-2 mt-2">
                  <input
                    id="linkUrl"
                    type="text"
                    className="flex-grow px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-full"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Enter link URL"
                  />
                  <button
                    type="submit"
                    className="black:text-indigo-500 dark:text-gray-200 text-midnightblue px-4 py-2 rounded-full hover:text-white hover:bg-midnightblue hover:dark:bg-indigo-600 transition-colors"
                  >
                    <BsFileEarmarkPlus className="inline-block" />
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {taskLinks && taskLinks.length > 0 && (
          <div className="my-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Links
            </label>
            <ul>
              {taskLinks.map((link) => (
                <li
                  key={link.id}
                  className="flex items-center
                      justify-between"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline"
                  >
                    {link.url}
                  </a>
                  {!isChef && (
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-300 my-4">
          Assigned To
        </p>
        <div className="flex items-center">
          <div className="flex items-center">
            {userName ? (
              <div className="flex justify-between items-center">
                {userAvatar ? (
                  <div className="flex items-center justify-center gap-4 text-gray-700 dark:text-gray-300">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={userAvatar}
                      alt="user avatar"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4 text-gray-700 dark:text-gray-300">
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                {isChef ? (
                  <button
                    onClick={handleRemoveMember}
                    className="text-red-500 mt-1 font-bold pl-4"
                  >
                    Remove {userName}
                  </button>
                ) : (
                  <p className="text-red-500  font-bold pl-4">{userName}</p>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-400">No one</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
