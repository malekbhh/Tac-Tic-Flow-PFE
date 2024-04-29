import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client";

function ProgressProject({ projectId, showMore, setShowMore }) {
  const [tasks, setTasks] = useState([]);
  const [taskProgress, setTaskProgress] = useState([]);
  const [closedTasksPercentage, setClosedTasksPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axiosClient.get(
          `/projects/${projectId}/tasks`
        );
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    setTaskProgress(calculateTaskProgress(tasks));
    setClosedTasksPercentage(calculateClosedTasksPercentage(tasks));
  }, [tasks]);

  const calculateTaskProgress = (tasks) => {
    const statuses = { "To Do": 0, Doing: 0, Done: 0, Closed: 0 };
    tasks.forEach((task) => {
      statuses[task.status]++;
    });
    const totalTasks = tasks.length;
    return Object.keys(statuses).map((status) => ({
      status,
      percentage:
        totalTasks > 0 ? ((statuses[status] / totalTasks) * 100).toFixed(2) : 0,
    }));
  };

  const calculateClosedTasksPercentage = (tasks) => {
    const closedTasksCount = tasks.filter(
      (task) => task.status === "Closed"
    ).length;
    const totalTasks = tasks.length;
    return totalTasks > 0
      ? ((closedTasksCount / totalTasks) * 100).toFixed(2)
      : 0;
  };

  return (
    <div className="w-3/4">
      <h2 className="my-3 text-xl dark:text-gray-300 font-bold">
        Progress Project:
      </h2>
      <div className="mb-4  ">
        <div className="flex justify-between items-center gap-3">
          {" "}
          <p className="text-sm  dark:text-gray-300">
            Total Closed Tasks Percentage: {closedTasksPercentage}%
          </p>
          <button
            onClick={() => setShowMore(!showMore)}
            className="dark:bg-indigo-500 dark:text-gray-300 bg-midnightblue text-white py-2 px-6 rounded-2xl"
          >
            Show More{" "}
          </button>
        </div>
        {taskProgress.length > 0 && (
          <div className="flex flex-wrap justify-around ">
            {taskProgress.map((statusProgress) => (
              <div
                key={statusProgress.status}
                className=" mt-4 mx-6 w-full mb-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs dark:text-gray-300 text-center">
                    {statusProgress.status} {statusProgress.percentage}%
                  </p>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${statusProgress.percentage}%`,
                        backgroundColor: getStatusColor(statusProgress.status),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}

export default ProgressProject;

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
