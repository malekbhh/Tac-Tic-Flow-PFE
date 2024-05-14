import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import axiosClient from "../../axios-client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons"; // Importation des icônes Font Awesome
import ProgressMember from "./ProgressMember";
import ProgressChef from "./ProgressChef";

function Progress() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isLoadingUserRole, setIsLoadingUserRole] = useState(false);
  const [isChef, setIsChef] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axiosClient.get(`/projects?page=${currentPage}`);
        setProjects(response.data.projects);
        setTotalPages(Math.ceil(response.data.totalProjectsCount / 5));
        setIsLoadingProjects(false);
      } catch (error) {
        console.error("Error loading projects:", error);
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, [currentPage]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (selectedProjectId) {
        setIsLoadingUserRole(true);
        try {
          const responseProjectRole = await axiosClient.post(
            "/check-user-role",
            {
              projectId: selectedProjectId,
            }
          );
          setIsChef(responseProjectRole.data.isProjectLeader);
          setIsLoadingUserRole(false);
        } catch (error) {
          console.error("Error fetching user role for project:", error);
          setIsLoadingUserRole(false);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mr-2 mt-8">
      <div className="fixed top-6 flex mt-2 items-center border-2 opacity-70 justify-between px-2 py-1 rounded-2xl w-80 gap-4">
        <input
          type="text"
          className="bg-transparent w-80 focus:outline-none text-white"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="h-4 text-slate-500" />{" "}
        {/* Utilisation de l'icône de recherche Font Awesome */}
      </div>

      {isLoadingProjects ? (
        <FontAwesomeIcon icon={faSpinner} className="mt-11" spin />
      ) : (
        <motion.div
          className="project-cards mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex mt-16 mb-10 flex-wrap gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project.id)}
                isSelected={selectedProjectId === project.id}
              />
            ))}
          </div>
          {totalPages > 1 && ( // Condition pour vérifier s'il y a plus d'une page
            <div className="flex ml-[65%] justify-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`mx-2 py-2 px-4 rounded-full ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
      {selectedProjectId && !isLoadingUserRole && (
        <>
          {isChef ? (
            <ProgressChef projectId={selectedProjectId} />
          ) : (
            <ProgressMember projectId={selectedProjectId} />
          )}
        </>
      )}
      {isLoadingUserRole && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin />{" "}
          {/* Utilisation de l'icône de chargement Font Awesome */}
        </div>
      )}
    </div>
  );
}

export default Progress;
