import React from "react";
import { motion } from "framer-motion";

function ProjectCard({ project, onClick, isSelected }) {
  return (
    <div className="h-full">
      <motion.div
        onClick={onClick}
        className="w-[200px] h-[100px] m-1 justify-center p-1 dark:bg-black dark:bg-opacity-25  bg-white  bg-opacity-30 shadow-md rounded-xl flex flex-col items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <h3 className="text-lg dark:text-gray-300 font-semibold mb-2">
          {project.title}
        </h3>
        <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">
          {project.description}
        </p>
        {/*  <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">
          {project.deadline}
        </p> */}
      </motion.div>
    </div>
  );
}

export default ProjectCard;
