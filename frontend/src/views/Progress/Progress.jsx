import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import axiosClient from "../../axios-client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faFilter,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
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
  const [hasTasks, setHasTasks] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axiosClient.get(`/projects?page=${currentPage}`);
        const projectsWithRoles = await Promise.all(
          response.data.projects.map(async (project) => {
            const responseProjectRole = await axiosClient.post(
              "/check-user-role",
              {
                projectId: project.id,
              }
            );
            return {
              ...project,
              isLeader: responseProjectRole.data.isProjectLeader,
            };
          })
        );
        setProjects(projectsWithRoles);
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
    const fetchUserRoleAndTasks = async () => {
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

          const tasksResponse = await axiosClient.get(
            `/projects/${selectedProjectId}/tasks`
          );
          setHasTasks(tasksResponse.data.length > 0);

          setIsLoadingUserRole(false);
        } catch (error) {
          console.error(
            "Error fetching user role and tasks for project:",
            error
          );
          setIsLoadingUserRole(false);
        }
      }
    };

    fetchUserRoleAndTasks();
  }, [selectedProjectId]);

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchInput.toLowerCase());
    if (roleFilter === "all") return matchesSearch;
    if (roleFilter === "leader" && project.isLeader) return matchesSearch;
    if (roleFilter === "member" && !project.isLeader) return matchesSearch;
    return false;
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleFilterChange = (filter) => {
    setRoleFilter(filter);
    setIsDropdownVisible(false);
  };

  const getFilterLabel = () => {
    switch (roleFilter) {
      case "leader":
        return "Project Leader";
      case "member":
        return "Member";
      default:
        return "All Projects";
    }
  };

  return (
    <div className="mr-2 mt-8">
      <div className="fixed top-6 flex mt-2 text-gray-500 dark:text-gray-300 items-center border-2 opacity-70 justify-between px-2 py-1 rounded-2xl w-96 shadow-md">
        <input
          type="text"
          className="bg-transparent focus:outline-none placeholder-gray-600 dark:placeholder-gray-300"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="h-4" />
        <button
          onClick={toggleDropdown}
          className="relative focus:outline-none ml-2"
        >
          <div className="flex justify-center items-center gap-2">
            {getFilterLabel()}{" "}
            <FontAwesomeIcon icon={faFilter} className="h-4" />
          </div>
          {isDropdownVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-white  dark:bg-black dark:bg-opacity-30 border rounded shadow-lg z-10"
            >
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-black dark:hover:bg-opacity-50  justify-between items-center"
                onClick={() => handleFilterChange("all")}
              >
                All Projects{" "}
                {roleFilter === "all" && <FontAwesomeIcon icon={faCheck} />}
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-black dark:hover:bg-opacity-50  justify-between items-center"
                onClick={() => handleFilterChange("leader")}
              >
                Project Leader{" "}
                {roleFilter === "leader" && <FontAwesomeIcon icon={faCheck} />}
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-black dark:hover:bg-opacity-50  justify-between items-center"
                onClick={() => handleFilterChange("member")}
              >
                Member{" "}
                {roleFilter === "member" && <FontAwesomeIcon icon={faCheck} />}
              </button>
            </motion.div>
          )}
        </button>
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
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => handleProjectClick(project.id)}
                    isSelected={selectedProjectId === project.id}
                  />
                </motion.div>
              ))
            ) : (
              <div className="w-full text-center mt-10">
                {roleFilter === "leader" ? (
                  <p className="text-gray-500 text-lg">
                    Projects You Own - No projects found.
                  </p>
                ) : roleFilter === "member" ? (
                  <p className="text-gray-500 text-lg">
                    Projects Invited - You have not received an invitation to
                    take part in any projects.
                  </p>
                ) : (
                  <p className="text-gray-500 text-lg">No projects found.</p>
                )}
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center">
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
        <div className="mt-8">
          {!hasTasks ? (
            <p className="text-center text-gray-500">No tasks found.</p>
          ) : isChef ? (
            <ProgressChef projectId={selectedProjectId} />
          ) : (
            <ProgressMember projectId={selectedProjectId} />
          )}
        </div>
      )}
      {isLoadingUserRole && (
        <div className="flex justify-center mt-8">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      )}
    </div>
  );
}

export default Progress;
