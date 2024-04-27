import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";

import toast, { Toaster } from "react-hot-toast";

import edittask from "../../assets/edittask.png";

function AddMemberTask({ projectId, tasks, members }) {
  const [showTable, setShowTable] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [selectedTaskTitle, setSelectedTaskTitle] = useState(""); // Ajout du state pour stocker le titre de la tâche sélectionnée

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  const handleTaskChange = (memberId, taskId, taskTitle) => {
    setSelectedTasks({ ...selectedTasks, [memberId]: taskId });
    setSelectedTaskTitle(taskTitle); // Mise à jour du titre de la tâche sélectionnée lors du changement
  };

  const handleAddMember = async (memberId, taskId) => {
    try {
      await axiosClient.put(`/projects/${projectId}/tasks/${taskId}/assign`, {
        user_id: memberId,
      });
      toast.success("Task assigned successfully!");
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("Error assigning task. Please try again.");
    }
  };

  return (
    <div className="">
      <button
        onClick={toggleTable}
        className="bg-white   flex p-2 rounded-full gap-2 dark:bg-gray-800"
      >
        <img className="h-6" src={edittask} alt="edit icon " />
        <p className="text-[#9CA3AF]">Tasks</p>
      </button>
      {showTable && (
        <div
          onClick={(e) => {
            if (e.target !== e.currentTarget) {
              return;
            }
            setShowTable(false);
          }}
          className="fixed right-0  left-0 top-0 bottom-0 px-2 py-4 overflow-scroll z-50 justify-center items-center flex bg-[#00000080] scrollbar-hide"
        >
          {members.length > 0 ? (
            <div
              className={` flex justify-center w-fit items-start table-container mx-0  rounded-lg h-fit shadow-md bg-white    dark:bg-slate-900 p-6 `}
            >
              <table className="table-container ">
                <thead className="table-header">
                  <tr>
                    <th className="px-4 py-2 text-midnightblue dark:text-white">
                      Name
                    </th>
                    <th className="px-4 py-2 text-midnightblue dark:text-white">
                      Email
                    </th>
                    <th className="px-4 py-2 text-midnightblue dark:text-white">
                      Task
                    </th>
                    <th className="px-4 py-2 text-midnightblue dark:text-white">
                      Add member
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {members.map((member, index) => (
                    <tr key={index}>
                      {" "}
                      {/* Utilisation de l'index comme clé */}
                      <td className="px-4 py-2">{member.name}</td>
                      <td className="px-4 py-2">{member.email}</td>
                      <td className="px-4 py-2">
                        <select
                          value={selectedTasks[member.id] || ""}
                          onChange={(e) =>
                            handleTaskChange(
                              member.id,
                              e.target.value,
                              e.target.options[e.target.selectedIndex].text
                            )
                          }
                          className="bg-transparent outline-none px-4 py-2 rounded-md text-sm border border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
                        >
                          <option value="">Select a task</option>
                          {tasks.map((task) => (
                            <option key={task.id} value={task.id}>
                              {task.title}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() =>
                            handleAddMember(member.id, selectedTasks[member.id])
                          } // Passer taskId en paramètre
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className={` flex justify-center w-fit items-start table-container mx-0  rounded-lg h-fit shadow-md bg-white    dark:bg-slate-900 p-6 `}
            >
              no users added
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AddMemberTask;
