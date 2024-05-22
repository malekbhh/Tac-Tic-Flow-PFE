import React, { useState, useEffect, useRef } from "react";
import axiosClient from "../../axios-client";
import Chart from "chart.js/auto";
import ProgressProject from "../Progress/ProgressProject";

function ProgressMember({ projectId }) {
  const [taskProgress, setTaskProgress] = useState([]);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTasks, setShowTasks] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const taskResponse = await axiosClient.get(
          `/tasks/project/${projectId}`
        );
        setSelectedProjectTasks(taskResponse.data);

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

  useEffect(() => {
    if (chartRef.current && taskProgress.length > 0) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartRef.current.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: taskProgress.map((progress) => progress.status),
          datasets: [
            {
              label: "Percentage",
              data: taskProgress.map((progress) => progress.percentage),
              backgroundColor: ["#F87171", "#60A5FA", "#34D399", "#6B7280"],
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Percentage",
                color: "#4B5563",
                font: {
                  size: 18,
                },
              },
              ticks: {
                color: "#4B5563",
              },
            },
            x: {
              title: {
                display: true,
                text: "Task Status",
                padding: 15,
                color: "#4B5563",
                font: {
                  size: 18,
                },
              },
              ticks: {
                color: "#4B5563",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });

      chartRef.current.style.width = "500px"; // Taille fixe en pixels
      chartRef.current.style.height = "400px"; // Taille fixe en pixels
    }
  }, [taskProgress]);

  const toggleTasks = () => {
    setShowTasks(!showTasks);
  };

  const hasTasks = selectedProjectTasks && selectedProjectTasks.length > 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "text-red-500";
      case "Doing":
        return "text-blue-500";
      case "Done":
        return "text-green-500";
      case "Closed":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex flex-col items-center w-full justify-center gap-4 pr-8 py-6">
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 w-full rounded-xl">
        <div className="shadow-lg bg-white flex flex-col justify-between items-center dark:bg-gray-900 bg-opacity-30 dark:bg-opacity-35 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mt-4">
            Project's progress
          </h2>
          <div className="flex justify-center items-center">
            <ProgressProject projectId={projectId} />
          </div>
        </div>
        {taskProgress.length > 0 && (
          <div className="flex flex-col w-full  justify-between items-center  py-3 shadow-lg rounded-lg bg-white dark:bg-gray-900 bg-opacity-30 dark:bg-opacity-35">
            <h2 className="text-2xl font-bold  ml-2 text-gray-800 dark:text-gray-300 md:mr-6">
              Task Progress Chart
            </h2>
            <div className="" style={{ width: "500px", height: "400px" }}>
              <canvas
                ref={chartRef}
                style={{ width: "100%", height: "100%" }}
              ></canvas>
            </div>
          </div>
        )}
      </div>
      {showTasks && (
        <div className="w-full mt-6 rounded-lg overflow-hidden shadow-xl dark:text-gray-200">
          {hasTasks ? (
            <table className="w-full text-center">
              <thead className="bg-gray-100 dark:bg-black bg-opacity-30 dark:bg-opacity-30">
                <tr>
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Deadline</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedProjectTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 hover:bg-opacity-30 dark:hover:bg-black   hover:dark:bg-opacity-30"
                  >
                    <td className="py-3 px-4">{task.title}</td>
                    <td className="py-3 px-4">{task.due_date}</td>
                    <td className={`py-3 px-4 ${getStatusColor(task.status)}`}>
                      {task.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center mt-4 text-gray-500 dark:text-gray-300">
              No tasks exist for this project.
            </p>
          )}
        </div>
      )}
      <button
        className="mt-4 text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-full transition duration-300"
        onClick={toggleTasks}
      >
        {showTasks ? "Hide Tasks" : "Show Tasks"}
      </button>
    </div>
  );
}

export default ProgressMember;
