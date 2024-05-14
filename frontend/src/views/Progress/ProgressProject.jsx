import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import useDarkMode from "../../Hooks/useDarkMode"; // Importez votre hook useDarkMode

function ProgressProject({ projectId, showMore, setShowMore }) {
  const [tasks, setTasks] = useState([]);
  const [taskProgress, setTaskProgress] = useState([]);
  const [closedTasksPercentage, setClosedTasksPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [colorTheme] = useDarkMode(); // Utilisez le hook useDarkMode pour obtenir le thème actuel

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
      count: statuses[status],
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

  useEffect(() => {
    if (taskProgress.length > 0) {
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
                backgroundColor: [
                  "#F87171", // Rouge pour "To Do"
                  "#60A5FA", // Bleu pour "Doing"
                  "#34D399", // Vert pour "Done"
                  "#6B7280", // Gris pour "Closed"
                ],
              },
            ],
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: "Your project's progress",
              },
              legend: {
                display: true,
                position: "bottom",
              },
            },
            layout: {
              padding: {
                bottom: 15, // Réduit l'espace en bas du graphique
              },
            },
            aspectRatio: 2, // Définit le rapport hauteur / largeur pour que le graphique soit un cercle parfait
          },
        });

        return () => {
          doughnutChart.destroy();
        };
      }
    }
  }, [taskProgress]);

  return (
    <div className="w-full  flex-col justify-center items-center">
      <div className="mb-4">
        {isLoading ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <>
            <div className="">
              <canvas id="doughnutChart"></canvas>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowMore(!showMore)}
                className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300"
              >
                {showMore ? "Hide More" : "Show More"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProgressProject;
