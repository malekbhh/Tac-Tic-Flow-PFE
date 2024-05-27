import React, { useState } from "react";
import axiosClient from "../../axios-client";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import plus2 from "./plus2.png";
import { XIcon, CheckIcon } from "@heroicons/react/solid";
import SelectPriority from "./SelectPriority";

function CreateTask({ projectId, setTasks }) {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [deadlineError, setDeadlineError] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [useDescription, setUseDescription] = useState(false);

  const handleShowInput = () => {
    setShowInput(true);
  };
  const handleCreateTask = async (e) => {
    e.preventDefault();
    const today = new Date(); // Obtient la date d'aujourd'hui
    // Vérifie si la date limite est antérieure à aujourd'hui
    if (dueDate && dueDate < today) {
      setDeadlineError("Deadline must be from today or later.");
      return;
    } else {
      setDeadlineError("");
      try {
        const response = await axiosClient.post(
          `/projects/${projectId}/tasks`,
          {
            title: taskName,
            dueDate: dueDate ? dueDate.toISOString().split("T")[0] : null, // Convertir la date au format YYYY-MM-DD
            priority: priority,
            description: useDescription ? description : null,
          }
        );
        toast.success("Task created successfully!");
        setTaskName("");
        setDueDate(null);
        setPriority("medium");
        setTasks((prevTasks) => [...prevTasks, response.data]);
        setShowInput(false);
        setDescription("");
        setUseDescription(false);
        setShowInput(false);
      } catch (error) {
        console.error("Error creating task:", error);
        toast.error("Error creating task. Please try again.");
      }
    }
  };

  const handleCloseInput = () => {
    setTaskName("");
    setDueDate(null);
    setPriority("medium");
    setDescription("");
    setUseDescription(false);
    setShowInput(false);
  };

  return (
    <div className="">
      {" "}
      {!showInput && (
        <button
          onClick={handleShowInput}
          className=" text-[#9CA3AF] px-4 py-2 rounded-xl dark:hover:bg-gray-900 hover:bg-gray-300 w-40 focus:outline-none"
        >
          {" "}
          <div className="flex items-center justify-center gap-2">
            <img className="h-4" src={plus2} alt="icon" />
            <p>Add Task</p>
          </div>
        </button>
      )}
      {showInput && (
        <form
          onSubmit={handleCreateTask}
          className=" p-5  bg-white dark:bg-gray-900 dark:bg-opacity-70 shadow-xl dark:shadow-gray-950 dark:shadow-2xl rounded-md cursor-grab 
            "
        >
          <div className="mb-1">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Title"
              className="border-b-2 w-full py-1 px-3 border-gray-300 focus:outline-none  dark:focus:border-indigo-500"
            />
          </div>
          {useDescription && (
            <div className="mb-1">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border-b-2 w-full py-1 px-2 border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
          <div className="mb-1 ">
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              placeholderText="Deadline"
              className="border-b-2 w-full py-1 px-3 border-gray-300 focus:outline-none focus:border-indigo-500"
            />
          </div>{" "}
          <div className="mb-1 flex items-center space-x-2">
            <SelectPriority setPriority={setPriority} priority={priority} />
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
          {deadlineError && (
            <p className="text-sm text-red-500">{deadlineError}</p>
          )}
          <div className="flex justify-between mt-4">
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={useDescription}
                onChange={() => setUseDescription(!useDescription)}
                className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label
                htmlFor="useDescription"
                className="text-sm text-gray-700 font-semibold"
              >
                Description
              </label>
            </div>
          </div>{" "}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleCloseInput}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-xl flex items-center focus:outline-none"
            >
              <XIcon className="h-4 mr-1" />
            </button>
            <button
              type="submit"
              className="dark:bg-indigo-600 bg-midnightblue dark:hover:bg-indigo-700 text-white  py-2 px-4 rounded-xl flex items-center focus:outline-none"
            >
              <CheckIcon className="h-4 mr-1" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreateTask;
