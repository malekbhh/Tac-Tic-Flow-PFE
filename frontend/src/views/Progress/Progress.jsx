import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import axiosClient from "../../axios-client";
import { motion } from "framer-motion";
import ProgressMember from "./ProgressMember";
import ProgressChef from "./ProgressChef";

function Progress() {
  const [projects, setProjects] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isChef, setIsChef] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axiosClient.get("/projects");
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading projects:", error);
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (selectedProjectId) {
        try {
          const responseProjectRole = await axiosClient.post(
            "/check-user-role",
            {
              projectId: selectedProjectId,
            }
          );
          setIsChef(responseProjectRole.data.isProjectLeader);
        } catch (error) {
          console.error("Error fetching user role for project:", error);
        }
      }
    };

    fetchUserRole();
  }, [selectedProjectId]);

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className=" mr-2 mt-8 h-full w-full ">
      <div className="flex flex-col  sm:flex-row justify-between items-center">
        <p className="text-lg  max-md:text-sm font-semibold progress-title dark:bg-indigo-500 dark:text-gray-300 bg-midnightblue text-white py-2 px-6 rounded-2xl mb-2 sm:mb-0">
          Your Progress Towards Success
        </p>
        <div className="flex justify-end">
          <input
            className="rounded-2xl bg-gray-200 max-md:text-xs  text-white py-2 px-4  "
            type="text"
            placeholder="Search for a project"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <motion.div
          className="project-cards w-full mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project.id)}
              isSelected={selectedProjectId === project.id}
            />
          ))}
        </motion.div>
      )}
      {selectedProjectId && (
        <>
          {isChef ? (
            <ProgressChef projectId={selectedProjectId} />
          ) : (
            <ProgressMember projectId={selectedProjectId} />
          )}
        </>
      )}
    </div>
  );
}

export default Progress;
