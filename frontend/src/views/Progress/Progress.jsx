import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import axiosClient from "../../axios-client";
import { motion } from "framer-motion";

function Progress() {
  const [projects, setProjects] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [taskProgress, setTaskProgress] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axiosClient.get("/projects");
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleProjectClick = async (projectId) => {
    setSelectedProjectId(projectId);
    try {
      const response = await axiosClient.get(`/tasks/project/${projectId}`);
      const projectTasks = response.data;
      setSelectedProjectTasks(projectTasks);

      const statuses = { "To Do": 0, Doing: 0, Done: 0, Closed: 0 }; // Initialisation avec 0 tâche pour chaque statut
      projectTasks.forEach((task) => {
        statuses[task.status]++; // Incrémenter le compteur de chaque statut
      });
      const totalTasks = projectTasks.length;
      const progress = Object.keys(statuses).map((status) => ({
        status,
        percentage:
          totalTasks > 0
            ? ((statuses[status] / totalTasks) * 100).toFixed(2)
            : 0, // Calcul du pourcentage si totalTasks > 0, sinon 0
      }));
      setTaskProgress({ projectId, progress });

      setIsSelected(true);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches du projet :", error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="project-progress-container h-screen w-full mt-6">
      <div className="progress-title flex w-fit dark:bg-indigo-500 dark:text-gray-300  bg-midnightblue text-white py-2 px-6 rounded-2xl">
        <p className="text-lg font-semibold">Your Progress Towards Success</p>
      </div>

      <div className="flex -translate-y-8 absolute right-24 justify-end ">
        <input
          className="rounded-2xl   py-2 pl-2"
          type="text"
          placeholder="Search for a project"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
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
              taskProgress={
                selectedProjectId === project.id ? taskProgress.progress : []
              }
              onClick={() => handleProjectClick(project.id)}
              isSelected={selectedProjectId === project.id}
              selectedProjectTasks={selectedProjectTasks} // Passer isSelected en fonction de la comparaison
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default Progress;
