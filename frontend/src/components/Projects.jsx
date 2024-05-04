import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import search from "../assets/search.png";
import toast from "react-hot-toast";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
const Projects = ({}) => {
  const { chefProjects, setChefProjects } = useStateContext();

  const [memberProjects, setMemberProjects] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredChefProjects, setFilteredChefProjects] = useState([]);
  const [filteredMemberProjects, setFilteredMemberProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [loadProjectsError, setLoadProjectsError] = useState(null);
  const [selectedChefAvatar, setSelectedChefAvatar] = useState(null);
  const [selectedChefName, setSelectedChefName] = useState(null);
  const navigate = useNavigate();

  const handleClick = (projectId, project) => {
    // Vérifie si le projet est dans la liste chefProjects
    const isChef = chefProjects.some((p) => p.id === projectId);
    navigate("/ProjectDetails", {
      state: {
        projectId,
        project,
        isChef,
      },
    });
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
  useEffect(() => {
    if (filteredMemberProjects.length > 0) {
      const firstProject = filteredMemberProjects[0]; // Sélectionner le premier projet membre
      setSelectedChefAvatar(firstProject.chef_avatar); // Mettre à jour l'avatar du chef
      setSelectedChefName(firstProject.chef_name); // Mettre à jour le nom du chef
    }
  }, [filteredMemberProjects]);
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
                <h3 className="text-gray-800 dark:text-white font-semibold text-xl mb-4">
                  Projects
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-1 mb-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-5 gap-5">
                  {!filteredChefProjects || !filteredChefProjects.length ? (
                    <p className="ml-4">No projects found.</p>
                  ) : (
                    filteredChefProjects.map((project) => (
                      <div key={project.id} className="mb-4 w-72 ">
                        <div className="relative dark:bg-black dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden shadow-md">
                          <div className="p-4 flex flex-col h-full">
                            <button
                              onClick={() => handleClick(project.id, project)}
                              className="mb-auto"
                            >
                              <h2 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">
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
                              <p className="text-gray-500 absolute bottom-4 dark:text-gray-400 text-sm">
                                Deadline:{" "}
                                {new Date(
                                  project.deadline
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-end p-4">
                            <Button
                              type="text"
                              danger
                              onClick={() => deleteProject(project.id)}
                              icon={<DeleteOutlined />}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <h3 className="text-gray-800 dark:text-white font-semibold text-xl mb-4">
                  Projects Invited
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-5 gap-5">
                  {!filteredMemberProjects || !filteredMemberProjects.length ? (
                    <p className="ml-4">No projects found.</p>
                  ) : (
                    filteredMemberProjects.map((project) => (
                      <div key={project.id} className="mb-4 w-72  h-96">
                        <div className="relative dark:bg-black dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden shadow-md">
                          <div className="p-4 flex flex-col h-full">
                            <button
                              onClick={() => handleClick(project.id, project)}
                              className="mb-auto"
                            >
                              {/* hover:text-blue-500 transition-colors duration-300 */}
                              <h2 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm ">
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
                              <p className="text-gray-500 mt-6 absolute bottom-4 dark:text-gray-400 text-sm">
                                Deadline:{" "}
                                {new Date(
                                  project.deadline
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex  justify-end p-4  space-x-2">
                            <span
                              className="text-gray-600 dark:text-gray-300 "
                              style={{ fontSize: "small" }}
                            >
                              {selectedChefName}
                            </span>{" "}
                            {selectedChefAvatar ? (
                              <img
                                src={selectedChefAvatar}
                                className="w-6 h-6 rounded-full"
                                alt="Chef Avatar"
                              />
                            ) : (
                              <Button type="text" icon={<UserOutlined />} />
                            )}
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
