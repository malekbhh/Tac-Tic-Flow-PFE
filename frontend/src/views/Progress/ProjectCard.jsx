import React from "react";
import { motion } from "framer-motion";

function ProjectCard({
  project,
  onClick,
  taskProgress,
  isSelected,
  selectedProjectTasks,
}) {
  const hasTasks = selectedProjectTasks && selectedProjectTasks.length > 0;

  return (
    <div className="h-full">
      <motion.div
        onClick={onClick}
        className="w-[200px] m-1 mt-5 p-1 border border-gray-300 rounded-lg shadow-md flex flex-col items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <h3 className="text-lg dark:text-gray-300 font-semibold mb-2">
          {project.title}
        </h3>
        <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">
          {project.description}
        </p>
        <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">
          {project.deadline}
        </p>
      </motion.div>
      {isSelected && taskProgress && taskProgress.length > 0 && (
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
                      backgroundColor: getStatusColor(statusProgress.status),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isSelected && hasTasks && (
        <div className="tasks-table w-full">
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 bg-opacity-30">
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
                  className="hover:bg-gray-50 hover:bg-opacity-30"
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
      {isSelected && !hasTasks && (
        <p className="text-center mt-4">No tasks existed for this project.</p>
      )}
    </div>
  );
}

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

export default ProjectCard;
