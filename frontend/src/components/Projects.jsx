import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import search from "../assets/search.png";
import toast from "react-hot-toast";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const { chefProjects, setChefProjects } = useStateContext();

  const [memberProjects, setMemberProjects] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredChefProjects, setFilteredChefProjects] = useState([]);
  const [filteredMemberProjects, setFilteredMemberProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [loadProjectsError, setLoadProjectsError] = useState(null);
  const navigate = useNavigate();

  const handleClick = (projectId, project) => {
    // Vérifie si le projet est dans la liste chefProjects
    const isChef = chefProjects.some((p) => p.id === projectId);
    navigate("/ProjectDetails", { state: { projectId, project, isChef } });
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filterProjects(value);
  };

  const filterProjects = (value) => {
    const chefFiltered = chefProjects.filter((project) =>
      project.title.toLowerCase().includes(value.toLowerCase())
    );
    const memberFiltered = memberProjects.filter((project) =>
      project.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredChefProjects(chefFiltered);
    setFilteredMemberProjects(memberFiltered);
  };

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await axiosClient.get("/projectsWithRole");
      const { chefProjects, memberProjects } = response.data;
      setChefProjects(chefProjects);
      setFilteredChefProjects(chefProjects);
      setMemberProjects(memberProjects);
      setFilteredMemberProjects(memberProjects);
      setLoadProjectsError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error loading projects:", error);
      setLoadProjectsError("Error loading projects. Please try again.");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Mettre à jour les projets du chef chaque fois que la liste change
  useEffect(() => {
    setFilteredChefProjects(chefProjects);
  }, [chefProjects]);

  const deleteProject = async (projectId) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
      )
    ) {
      try {
        await axiosClient.delete(`/projects/${projectId}`, {
          withCredentials: true,
        });
        toast.success("Project deleted successfully!");
        // Mettre à jour l'état local des projets après suppression
        setChefProjects((prevChefProjects) =>
          prevChefProjects.filter((project) => project.id !== projectId)
        );
        setMemberProjects((prevMemberProjects) =>
          prevMemberProjects.filter((project) => project.id !== projectId)
        );
        setFilteredChefProjects((prevFilteredChefProjects) =>
          prevFilteredChefProjects.filter((project) => project.id !== projectId)
        );
        setFilteredMemberProjects((prevFilteredMemberProjects) =>
          prevFilteredMemberProjects.filter(
            (project) => project.id !== projectId
          )
        );
      } catch (error) {
        toast.error("Error deleting project!");
        console.error(
          `Erreur lors de la suppression du projet : ${error.message}`
        );
      }
    }
  };

  return (
    <div className="w-full h-full pt-11 p-8 text-white">
      <div className="fixed top-6 flex mt-2 items-center border-2 opacity-70 justify-between px-2 py-1 rounded-2xl w-80 gap-4">
        <input
          type="text"
          className="bg-transparent w-80 focus:outline-none text-white"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchInputChange}
        />
        <img src={search} alt="search icon" className="h-4 text-slate-500" />
      </div>

      <div className="w-full mb-2">
        <div className="w-full mb-2">
          <div className="w-full mb-2">
            {loadProjectsError ? (
              <p className="text-red-500">{loadProjectsError}</p>
            ) : isLoadingProjects ? (
              <p>Loading projects...</p>
            ) : (
              <>
                <h3 className="text-gray-600 text-xl dark:text-white font-bold mb-2">
                  Projects
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-1 mb-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-5 gap-5">
                  {!filteredChefProjects || !filteredChefProjects.length ? (
                    <p className="ml-4">No projects found.</p>
                  ) : (
                    filteredChefProjects.map((project) => (
                      <div key={project.id} className="mb-4 w-72 h-300">
                        <div className="dark:bg-black relative dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden h-60 shadow-md flex flex-col">
                          <div className="p-4 flex-1 overflow-y-auto">
                            <button
                              onClick={() => handleClick(project.id, project)}
                            >
                              <h2
                                className="font-semibold text-gray-800 dark:text-white mb-2"
                                style={{ fontSize: "small" }}
                              >
                                {project.title}
                              </h2>
                            </button>
                            <p
                              className="text-gray-600 dark:text-gray-300 "
                              style={{ fontSize: "small" }}
                            >
                              {project.description}
                            </p>
                            {project.deadline && (
                              <p
                                className="text-gray-500 absolute bottom-4 flex items-end dark:text-gray-400 "
                                style={{ fontSize: "small" }}
                              >
                                Deadline:{" "}
                                {new Date(
                                  project.deadline
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-end p-4">
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <h3 className="text-gray-600 text-xl dark:text-white font-semibold  mb-2">
                  Projects Invited
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-5 gap-5">
                  {!filteredMemberProjects || !filteredMemberProjects.length ? (
                    <p className="ml-4">No projects found.</p>
                  ) : (
                    filteredMemberProjects.map((project) => (
                      <div key={project.id} className="mb-4 w-72 h-300">
                        <div className="dark:bg-black relative dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden h-60 shadow-md flex flex-col">
                          <div className="p-4 flex-1 overflow-y-auto">
                            <button
                              onClick={() => handleClick(project.id, project)}
                            >
                              <h2
                                className="font-semibold text-gray-800 dark:text-white mb-2"
                                style={{ fontSize: "small" }}
                              >
                                {project.title}
                              </h2>
                            </button>
                            <p
                              className="text-gray-600 dark:text-gray-300 "
                              style={{ fontSize: "small" }}
                            >
                              {project.description}
                            </p>
                            {project.deadline && (
                              <p
                                className="text-gray-500 absolute bottom-4 flex items-end dark:text-gray-400 "
                                style={{ fontSize: "small" }}
                              >
                                Deadline:{" "}
                                {new Date(
                                  project.deadline
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-end p-4">
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
