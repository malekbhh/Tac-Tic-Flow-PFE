import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import axiosClient from "../../axios-client";
import { FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const EditProject = ({ projectId, onClose, onUpdate }) => {
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    deadline: null,
  });
  const [loading, setLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Charger les données du projet à éditer
    const loadProjectData = async () => {
      try {
        const response = await axiosClient.get(`/projects/${projectId}`);
        setProjectData({
          title: response.data.title,
          description: response.data.description,
          deadline: response.data.deadline
            ? new Date(response.data.deadline)
            : null,
        });
        setUserAvatar(response.data.chef_avatar);
        setUserName(response.data.chef_name);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données du projet :",
          error
        );
      }
    };

    loadProjectData();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setProjectData((prevData) => ({
      ...prevData,
      deadline: date,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.put(`/projects/${projectId}`, {
        ...projectData,
        deadline: projectData.deadline
          ? projectData.deadline.toISOString().split("T")[0]
          : null,
      });
      toast.success("Project updated successfully!");
      onUpdate(response.data.project); // Mettre à jour le projet dans l'état local
      onClose(); // Fermer le formulaire après une mise à jour réussie
    } catch (error) {
      toast.error("Error updating project!");
      console.error("Erreur lors de la mise à jour du projet :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-70 z-50">
      <div className="bg-white dark:bg-gray-900  rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">
            Edit Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col  dark:text-gray-300 text-gray-700 gap-4"
        >
          <div className="relative">
            <label htmlFor="title" className="block text-sm font-medium  ">
              Title
            </label>
            <input
              id="title"
              name="title"
              className="mt-1 p-2 block w-full shadow-sm sm:text-sm dark:bg-transparent dark:border-b border-gray-300 rounded-md"
              type="text"
              value={projectData.title}
              onChange={handleInputChange}
              placeholder="Enter title"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="description"
              className="block text-sm font-medium t"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="mt-1 p-2 block w-full shadow-sm sm:text-sm dark:bg-transparent dark:border-b border-gray-300 rounded-md"
              value={projectData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              required
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium ">
              Deadline
            </label>
            <DatePicker
              id="deadline"
              selected={projectData.deadline}
              onChange={handleDateChange}
              className="mt-1 p-2 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm dark:bg-transparent dark:border-b border-gray-300 rounded-md"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Project"}
            </button>
          </div>
        </form>
        {userName && (
          <div className="mt-6 flex items-center">
            {userAvatar ? (
              <img
                className="w-10 h-10 rounded-full"
                src={userAvatar}
                alt="User Avatar"
              />
            ) : (
              <FaUserCircle className="w-10 h-10 text-gray-400" />
            )}
            <p className="ml-4 text-gray-700 dark:text-gray-300">{userName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProject;
