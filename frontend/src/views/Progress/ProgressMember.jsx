// ProgressMember.js
import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client";

function ProgressMember({ projectId }) {
  const [taskProgress, setTaskProgress] = useState([]);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        // Charger les tâches du projet
        const taskResponse = await axiosClient.get(
          `/tasks/project/${projectId}`
        );
        setSelectedProjectTasks(taskResponse.data);

        // Calculer le progrès des tâches
        const statuses = { "To Do": 0, Doing: 0, Done: 0, Closed: 0 };
        taskResponse.data.forEach((task) => {
          statuses[task.status]++;
        });
        const totalTasks = taskResponse.data.length;
        const progress = Object.keys(statuses).map((status) => ({
          status,
          percentage:
            totalTasks > 0
              ? ((statuses[status] / totalTasks) * 100).toFixed(2)
              : 0,
        }));
        setTaskProgress(progress);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading project data:", error);
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  const hasTasks = selectedProjectTasks && selectedProjectTasks.length > 0;

  return (
    <div className="dark:text-gray-300 ">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {taskProgress.length > 0 && (
            <div className="flex flex-wrap justify-around w-full">
              {taskProgress.map((statusProgress) => (
                <div key={statusProgress.status} className="w-full mt-4 mb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs dark:text-gray-300 text-center">
                      {statusProgress.status} {statusProgress.percentage}%
                    </p>
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${statusProgress.percentage}%`,
                          backgroundColor: getStatusColor(
                            statusProgress.status
                          ),
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {hasTasks && (
            <div className="tasks-table mt-4 w-full">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 bg-opacity-30 dark:bg-black dark:bg-opacity-30">
                  <tr>
                    <th className="py-2 px-4 text-left">Title</th>
                    <th className="py-2 px-4 text-left">Deadline</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProjectTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50 hover:bg-opacity-30 dark:hover:bg-black dark:hover:bg-opacity-30"
                    >
                      <td className="py-3 px-4">{task.title}</td>
                      <td className="py-3 px-4">{task.due_date}</td>
                      <td className="py-3 px-4">{task.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!hasTasks && (
            <p className="text-center mt-4">
              No tasks existed for this project.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgressMember;
function getStatusColor(status) {
  switch (status) {
    case "To Do":
      return "#F87171"; // Rouge pour "To Do"
    case "Doing":
      return "#60A5FA"; // Bleu pour "Doing"
    case "Done":
      return "#34D399"; // Vert pour "Done"
    case "Closed":
      return "#6B7280"; // Gris pour "Closed"
    default:
      return "#000000"; // Noir par défaut
  }
}
