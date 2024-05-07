import React from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import axiosClient from "../axios-client";
import SelectPriority from "./test/SelectPriority";
function EditTask({ task, handleCloseEdit, setTasks }) {
  const [editedTitle, setEditedTitle] = useState(task.title); // Pré-remplissez avec le titre initial
  const [editedDueDate, setEditedDueDate] = useState(task.due_date); // Pré-remplissez avec la date d'échéance initiale
  const [priority, setPriority] = useState(task.priority); // Pré-remplissez avec la priorité initiale
  const [selectedFile, setSelectedFile] = useState(null); // État pour stocker le fichier sélectionné
  const [taskFiles, setTaskFiles] = useState([]);

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Ajouter uniquement les champs modifiés au formData
      formData.append("title", editedTitle);

      // Assurez-vous que editedDueDate est un objet Date valide avant d'appeler toISOString()
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

      const response = await axiosClient.post(
        `/tasksUpdate/${task.id}`,
        formData
      );

      console.log(response.data);
      setTasks((prevTasks) => {
        // Créez une copie de prevTasks
        const updatedTasks = [...prevTasks];
        // Recherchez la tâche à mettre à jour dans la liste des tâches en fonction de son ID
        const index = updatedTasks.findIndex(
          (t) => t.id === response.data.task.id
        );
        // Si l'index est trouvé, mettez à jour la tâche, sinon, ajoutez-la à la liste
        if (index !== -1) {
          updatedTasks[index] = response.data.task;
        } else {
          updatedTasks.push(response.data.task);
        }
        return updatedTasks;
      });

      // Afficher un message de succès
      toast.success("Task updated successfully!");

      // Fermer le formulaire d'édition
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task. Please try again.");
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      setSelectedFile(file);
    } else {
      toast.error("Please select an image file.");
    }
  };

  const handleUploadAttachment = async (e) => {
    e.preventDefault(); // Empêche le formulaire de se soumettre par défaut

    try {
      if (!selectedFile) {
        toast.error("Please select an image to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axiosClient.post(
        `/tasks/${task.id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTaskFiles((prevFiles) => [...prevFiles, response.data.file]);
      setSelectedFile(null);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    }
  };

  const handleDeleteAttachment = async (fileId) => {
    try {
      await axiosClient.delete(`/tasks/${task.id}/files/${fileId}`);
      setTaskFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      );
      toast.success("Attachment deleted successfully!");
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast.error("Error deleting attachment. Please try again.");
    }
  };

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Edit Task
        </h2>
        <form onSubmit={handleEditTask} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="title"
              className="block  text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              id="title"
              className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block pl-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Enter title"
            />
            <input
              id="fileInput"
              type="file"
              className="hidden" // Cacher l'input de fichier
              onChange={handleFileChange} // Gérer la sélection de fichier
            />
            {/* <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={handleAttachments}
            >
              Attachements
              <FontAwesomeIcon className="ml-1" icon={faPaperclip} />
            </button> */}
          </div>
          <div>
            <label
              htmlFor="due_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Due Date
            </label>
            <DatePicker
              id="due_date"
              className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
              selected={editedDueDate}
              onChange={(date) => setEditedDueDate(date)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <SelectPriority priority={priority} setPriority={setPriority} />
          </div>
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCloseEdit}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update
            </button>
          </div>{" "}
        </form>
        <form onSubmit={handleUploadAttachment}>
          <div className="space-y-2">
            <div>
              <button
                type="button"
                onClick={() => document.getElementById("fileInput").click()}
                className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FontAwesomeIcon icon={faPaperclip} className="mr-1" /> Add
                Attachment
              </button>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {selectedFile && (
              <div className="flex items-center space-x-2">
                <p className="text-sm">{selectedFile.name}</p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUploadAttachment}
                  className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Upload
                </button>
              </div>
            )}
            {/* Display Uploaded Images */}
            {taskFiles.map((file) => (
              <div key={file.id} className="flex items-center space-x-2">
                {file.name && <img src={file.name} alt="Attachment" />}
                <button
                  type="button"
                  onClick={() => handleDeleteAttachment(file.id)}
                  className="text-sm text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;
