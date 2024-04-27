// ProjectContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "./ContextProvider.jsx";

const ProjectContext = createContext({
  auth: null,
  loading: true,
  tasks: [],
  setTasks: () => {},
  setMembers: () => {},
  setProject: () => {},
  setEmployees: () => {},
  setLoading: () => {},
  project: null,
  members: [],
  employees: [],
  isChef: false,
});

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isChef, setIsChef] = useState(false);
  const { user } = useStateContext();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const usersResponse = await axiosClient.get(`/usersAccount`);
        const filteredData = usersResponse.data.data.filter(
          (user) =>
            !members.some((member) => member.email === user.email) &&
            user.id !== (auth?.id || 0)
        );
        setEmployees(filteredData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);
  return (
    <ProjectContext.Provider
      value={{
        auth,
        loading,
        tasks,
        setMembers, // Assurez-vous que setMembers est inclus ici
        setTasks,
        project,
        setProject, // Assurez-vous que setProject est inclus ici
        members,
        employees,
        setLoading,
        isChef,
        setIsChef,
        user,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
