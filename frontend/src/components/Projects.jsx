import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import toast from "react-hot-toast";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { DeleteOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";
import EditProject from "./Project/EditProject.jsx"; // Importez le composant EditProject
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import crown2 from "../assets/crown2.png";
import { faSearch, faFilter, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Projects = ({}) => {
  const { chefProjects, setChefProjects, notifications } = useStateContext();
  const [memberProjects, setMemberProjects] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredChefProjects, setFilteredChefProjects] = useState([]);
  const [filteredMemberProjects, setFilteredMemberProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [loadProjectsError, setLoadProjectsError] = useState(null);
  const [selectedChefAvatar, setSelectedChefAvatar] = useState(null);
  const [selectedChefName, setSelectedChefName] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (filteredMemberProjects.length > 0) {
      const firstProject = filteredMemberProjects[0]; // Sélectionner le premier projet membre
      setSelectedChefAvatar(firstProject.chef_avatar); // Mettre à jour l'avatar du chef
      setSelectedChefName(firstProject.chef_name); // Mettre à jour le nom du chef
    }
  }, [filteredMemberProjects]);
  const handleProjectUpdate = (updatedProject) => {
    setChefProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const handleClick = (projectId, project) => {
    // Vérifie si le projet est dans la liste chefProjects
    const isChef = chefProjects.some((p) => p.id === projectId);

    // Trouvez l'avatar du chef pour ce projet
    let chefAvatar = null;
    if (isChef) {
      const chefProject = chefProjects.find((p) => p.id === projectId);
      chefAvatar = chefProject.chef_avatar;
    } else {
      const memberProject = memberProjects.find((p) => p.id === projectId);
      chefAvatar = memberProject.chef_avatar;
    }

    navigate("/ProjectDetails", {
      state: {
        projectId,
        project,
        isChef,
        chefAvatar,
      },
    });
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filterProjects(value, roleFilter);
  };

  const filterProjects = (searchValue, roleFilter) => {
    const chefFiltered = chefProjects.filter((project) =>
      project.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    const memberFiltered = memberProjects.filter((project) =>
      project.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (roleFilter === "leader") {
      setFilteredChefProjects(chefFiltered);
      setFilteredMemberProjects([]);
    } else if (roleFilter === "member") {
      setFilteredChefProjects([]);
      setFilteredMemberProjects(memberFiltered);
    } else {
      setFilteredChefProjects(chefFiltered);
      setFilteredMemberProjects(memberFiltered);
    }
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
      setLoadProjectsError(null);
    } catch (error) {
      console.error("Error loading projects:", error);
      setLoadProjectsError("Error loading projects. Please try again.");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProjects();
    }, 1000);

    return () => clearTimeout(timer);
  }, [notifications]);

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
      const firstProject = filteredMemberProjects[0];
      setSelectedChefAvatar(firstProject.chef_avatar);
      setSelectedChefName(firstProject.chef_name);
    }
  }, [filteredMemberProjects]);

  const handleEditProject = (projectId) => {
    setShowEditForm(true);
    setEditProjectId(projectId);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleFilterChange = (filter) => {
    setRoleFilter(filter);
    setIsDropdownVisible(false);
    filterProjects(searchValue, filter);
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
    <div className="pt-16 w-full h-full p-8 text-white">
      <div className="fixed top-6 flex mt-2 items-center border-2 opacity-70 justify-between px-2 py-1 rounded-2xl w-96 ">
        <input
          type="text"
          className="bg-transparent  focus:outline-none text-gray-300"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchInputChange}
        />
        <FontAwesomeIcon icon={faSearch} className="h-4 text-slate-500" />
        <button
          onClick={toggleDropdown}
          className="relative focus:outline-none"
        >
          <div className="flex justify-center dark:text-gray-400 items-center gap-2">
            {getFilterLabel()}{" "}
            <FontAwesomeIcon icon={faFilter} className="h-4 text-slate-500" />
          </div>
          {isDropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 text-gray-800 dark:text-gray-300 dark:bg-gray-800  bg-white border rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 justify-between items-center"
                onClick={() => handleFilterChange("all")}
              >
                All Projects{" "}
                {roleFilter === "all" && <FontAwesomeIcon icon={faCheck} />}{" "}
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 justify-between items-center"
                onClick={() => handleFilterChange("leader")}
              >
                Project Leader{" "}
                {roleFilter === "leader" && <FontAwesomeIcon icon={faCheck} />}
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 justify-between items-center"
                onClick={() => handleFilterChange("member")}
              >
                Member{" "}
                {roleFilter === "member" && <FontAwesomeIcon icon={faCheck} />}
              </button>
            </div>
          )}
        </button>
      </div>

      <div className="w-full mb-2">
        {loadProjectsError ? (
          <p className="text-red-500">{loadProjectsError}</p>
        ) : isLoadingProjects ? (
          <div className="loader-container  m-11 flex justify-start items-center">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {roleFilter !== "member" && (
              <>
                <h3 className="text-gray-800 dark:text-white font-semibold text-xl mb-4 ">
                  Projects You Own
                </h3>
                <div className="flex w-full gap-11 flex-wrap">
                  {!filteredChefProjects || !filteredChefProjects.length ? (
                    <div className="  flex items-center justify-center lg:w-[1100px] md:w-[700px] w-fit ">
                      <p className="ml-4 mt-20 text-lg text-slate-600 dark:text-slate-400 ">
                        No projects found
                      </p>
                    </div>
                  ) : (
                    filteredChefProjects.map((project) => (
                      <div key={project.id} className="mb-4 w-72">
                        <div className="relative dark:bg-black dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden shadow-md">
                          <div className="p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() => handleClick(project.id, project)}
                              >
                                <h2 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">
                                  {project.title}
                                </h2>
                              </button>
                              <Button
                                className="text-gray-700 dark:text-gray-300"
                                type="text"
                                icon={<FontAwesomeIcon icon={faEdit} />}
                                onClick={() => handleEditProject(project.id)}
                              />
                            </div>
                            <p
                              className="text-gray-600 dark:text-gray-300"
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
                              icon={<FontAwesomeIcon icon={faTrash} />}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
            {roleFilter !== "leader" && (
              <>
                <h3 className="text-gray-800 mt-11 dark:text-white font-semibold text-xl mb-4">
                  Projects You're Involved In
                </h3>
                <div className="flex w-full gap-11 flex-wrap">
                  {" "}
                  {!filteredMemberProjects || !filteredMemberProjects.length ? (
                    <div className="  flex items-center justify-center lg:w-[1100px] md:w-[700px] w-fit ">
                      <p className="ml-4 mt-20 text-lg text-slate-600 dark:text-slate-400 ">
                        You have not received an invitation to take part in any
                        projects
                      </p>
                    </div>
                  ) : (
                    filteredMemberProjects.map((project) => (
                      <div key={project.id} className="mb-4 w-72">
                        <div className="relative dark:bg-black dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden shadow-md">
                          <div className="p-4 flex flex-col gap-2">
                            <button
                              onClick={() => handleClick(project.id, project)}
                              className="mb-auto"
                            >
                              <h2 className="font-semibold  text-start text-gray-800 dark:text-white mb-2 text-sm">
                                {project.title}
                              </h2>
                            </button>
                            <p
                              className="text-gray-600 dark:text-gray-300"
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
                            <img
                              className="h-6 absolute bottom-10 right-[15px] z-20 "
                              src={crown2}
                              alt="crownicon"
                            />

                            <div className="flex translate-y-5  justify-end p-4  translate-x-4">
                              <span
                                className="text-gray-600 dark:text-gray-300 "
                                style={{ fontSize: "small" }}
                              ></span>{" "}
                              {project.chef_avatar ? (
                                <div>
                                  <img
                                    src={project.chef_avatar}
                                    className="w-7 h-7 rounded-full"
                                    alt="Chef Avatar"
                                  />
                                </div>
                              ) : (
                                <div className="bg-gray-200 text-gray-800 rounded-full w-7 h-7 flex justify-center items-center">
                                  {" "}
                                  <UserOutlined />
                                </div>
                              )}
                            </div>
                          </div>
                          {/* <div className="flex justify-end p-4 space-x-2">
                            {selectedChefAvatar ? (
                              <img
                                src={selectedChefAvatar}
                                className="w-6 h-6 rounded-full"
                                alt="Chef Avatar"
                              />
                            ) : (
                              <Button type="text" icon={<UserOutlined />} />
                            )}
                          </div> */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
      {showEditForm && (
        <EditProject
          projectId={editProjectId}
          onClose={() => setShowEditForm(false)}
          onUpdate={handleProjectUpdate}
        />
      )}
    </div>
  );
};

export default Projects;
