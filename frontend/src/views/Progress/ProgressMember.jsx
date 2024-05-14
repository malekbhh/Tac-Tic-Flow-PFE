import React, { useState, useEffect, useRef } from "react";
import axiosClient from "../../axios-client";
import Chart from "chart.js/auto"; // Importez Chart.js

function ProgressMember({ projectId }) {
  const [taskProgress, setTaskProgress] = useState([]);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTasks, setShowTasks] = useState(false);
  const chartRef = useRef(null); // Créez une référence pour le canvas

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
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Percentage",
                color: "#4B5563", // Couleur du titre de l'axe Y
                font: {
                  size: 14, // Taille de police du titre de l'axe Y
                },
              },
              ticks: {
                color: "#4B5563", // Couleur des étiquettes de l'axe Y
              },
            },
            x: {
              title: {
                display: true,
                text: "Task Status", // Titre de l'axe X
                color: "#4B5563", // Couleur du titre de l'axe X
                font: {
                  size: 14, // Taille de police du titre de l'axe X
                },
              },
              ticks: {
                color: "#4B5563", // Couleur des étiquettes de l'axe X
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Your task's progress ",
            },

            legend: {
              display: false, // Masquer la légende
            },
          },
        },
      });

      // Réglez la taille du canvas pour être la même que celle de son parent
      chartRef.current.style.width = "100%";
      chartRef.current.style.height = "100%"; // Hauteur du graphique
      chartRef.current.width = chartRef.current.offsetWidth;
      chartRef.current.height = chartRef.current.offsetHeight;
    }
  }, [taskProgress]);

  const toggleTasks = () => {
    setShowTasks(!showTasks);
  };

  const hasTasks = selectedProjectTasks && selectedProjectTasks.length > 0;

  // Fonction pour obtenir la classe CSS en fonction du statut de la tâche
  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-red-500 text-red-500";
      case "Doing":
        return "bg-blue-500 text-blue-500";
      case "Done":
        return "bg-green-500 text-green-500";
      case "Closed":
        return "bg-gray-500 text-gray-500";
      default:
        return "bg-gray-500 text-gray-500 ";
    }
  };

  return (
    <div className="flex justify-center items-center  w-[85%] flex-col gap-4  px-4 ">
      {taskProgress.length > 0 && (
        <div className="w-[80%] h-[80%]">
          <canvas ref={chartRef}></canvas>{" "}
          {/* Utilisez la référence pour le canvas */}
        </div>
      )}
      {showTasks && (
        <div className="w-full mt-6">
          {hasTasks && (
            <table className="w-full dark:text-gray-300 border-collapse border border-gray-300 rounded-lg overflow-hidden">
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
                    <td
                      className={`py-3 px-4 text-${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!hasTasks && (
            <p className="text-center mt-4">
              No tasks existed for this project.
            </p>
          )}
        </div>
      )}
      <div className=" flex justify-end ml-2 w-full">
        <button
          className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-full transition duration-300"
          onClick={toggleTasks}
        >
          {showTasks ? "Hide Tasks" : "Show Tasks"}
        </button>
      </div>
    </div>
  );
}

export default ProgressMember;
