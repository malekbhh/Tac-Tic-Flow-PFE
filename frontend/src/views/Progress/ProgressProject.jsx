import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function ProgressProject({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [taskProgress, setTaskProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axiosClient.get(
          `/projects/${projectId}/tasks`
        );
        setTasks(tasksResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    setTaskProgress(calculateTaskProgress(tasks));
  }, [tasks]);

  useEffect(() => {
    if (taskProgress.length > 0) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const doughnutCanvas = document.getElementById("doughnutChart");
      if (doughnutCanvas) {
        const doughnutCtx = doughnutCanvas.getContext("2d");

        const doughnutChart = new Chart(doughnutCtx, {
          type: "doughnut",
          data: {
            labels: taskProgress.map(
              (progress) => `${progress.status} (${progress.percentage}%)`
            ),
            datasets: [
              {
                label: "Task Status",
                data: taskProgress.map((progress) => progress.count),
                backgroundColor: ["#F87171", "#60A5FA", "#34D399", "#6B7280"],
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false, // Hide the legend
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.raw;
                    return `${label}: ${value} tasks (${
                      taskProgress[context.dataIndex].percentage
                    }%)`;
                  },
                },
              },
            },
            layout: {
              padding: {
                bottom: 8,
              },
            },
            aspectRatio: 1,
          },
        });

        setChartInstance(doughnutChart);
      }
    }
  }, [taskProgress]);

  useEffect(() => {
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  const calculateTaskProgress = (tasks) => {
    const statuses = {
      "To Do": "#F87171",
      Doing: "#60A5FA",
      Done: "#34D399",
      Closed: "#6B7280",
    };
    const progressData = Object.keys(statuses).map((status) => ({
      status,
      count: 0,
      percentage: 0,
      backgroundColor: statuses[status],
    }));
    tasks.forEach((task) => {
      progressData.forEach((progress) => {
        if (progress.status === task.status) {
          progress.count++;
        }
      });
    });
    const totalTasks = tasks.length;
    return progressData.map((progress) => ({
      ...progress,
      percentage:
        totalTasks > 0 ? ((progress.count / totalTasks) * 100).toFixed(2) : 0,
    }));
  };

  return (
    <div className="w-full flex items-center justify-center">
      {isLoading ? (
        <FontAwesomeIcon icon={faSpinner} spin />
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="flex flex-col items-center mt-6 justify-center">
          <canvas id="doughnutChart"></canvas>
          <div className="flex my-4">
            {taskProgress.map((progress, index) => (
              <div key={index} className="mr-4 flex items-center">
                <div
                  className="w-11 h-4 mr-2   rounded-xl"
                  style={{ backgroundColor: progress.backgroundColor }}
                ></div>
                <span className="dark:text-gray-300">{progress.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressProject;
