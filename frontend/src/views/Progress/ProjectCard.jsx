import React from "react";
import { motion } from "framer-motion";

function ProjectCard({ project, onClick, isSelected }) {
  return (
    <div className="h-full">
      <motion.div
        onClick={onClick}
        className="w-[200px] m-1  p-1 border border-gray-300 rounded-lg shadow-md flex flex-col items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <h3 className="text-lg dark:text-gray-300 font-semibold mb-2">
          {project.title}
        </h3>
        {/* <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">
          {project.description}
        </p>
        <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">
          {project.deadline}
        </p> */}
      </motion.div>
    </div>
  );
}

export default ProjectCard;
