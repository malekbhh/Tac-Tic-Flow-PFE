import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import ListTasks from "./test/ListTasks";
import toast, { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProjectMembers from "./projectDetails/ProjectMembers";
import ProjectHeader from "./projectDetails/ProjectHeader.jsx";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useLocation } from "react-router-dom";
// import { useStateContext } from "../context/ContextProvider.jsx";
const ProjectDetails = () => {
  const location = useLocation();
  const { projectId, project, isChef, chefAvatar } = location.state;
  const [tasks, setTasks] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { notifications, user } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [isDropSelectdownOpen, setDropSelectdownOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");

  // Définissez une fonction pour changer le type de filtre
  // Définissez une fonction pour changer le type de filtre
  const handleFilterChange = (filter) => {
    console.log("Filter changed to:", filter);
    setFilterType(filter);
  };

  // Filtrer les tâches en fonction du type de filtre sélectionné
  const filteredTasks = tasks.filter((task) => {
    if (filterType === "all") {
      return true; // Afficher toutes les tâches
    } else if (filterType === "overdue") {
      const dueDate = new Date(task.due_date);
      if (!isNaN(dueDate)) {
        return dueDate < new Date(); // Filtrer les tâches en retard
      } else {
        console.error("Invalid due date for task:", task);
        return false; // Ignorer les tâches avec des dates invalides
      }
    } else if (filterType === "nextDay") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDate = new Date(task.due_date);
      if (!isNaN(dueDate)) {
        return dueDate > tomorrow; // Filtrer les tâches dues dans les prochains jours
      } else {
        console.error("Invalid due date for task:", task);
        return false; // Ignorer les tâches avec des dates invalides
      }
    }
  });

  console.log("Filtered tasks:", filteredTasks); // Ajouter cette ligne pour vérifier les tâches filtrées

  const updateMembersList = (updatedMembers) => {
    setMembers(updatedMembers);
  };

  const handleMemberAdded = (newMember) => {
    setMembers([...members, newMember]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axiosClient.get(
          `/projects/${projectId}/tasks`
        );
        setTasks(tasksResponse.data);
        console.log(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, [projectId, notifications]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(
          `/projects/${projectId}/members`
        );
        setMembers(response.data.members);
        console.log(members);
      } catch (error) {
        console.error("Error fetching project members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <div className=" mt-6 justify-start flex flex-col border-slate-500  items-start gap-6">
        {project && (
          <ProjectHeader
            project={project}
            members={members} // Passing members array here
            toggleMembers={toggleMembers}
            isDropSelectdownOpen={isDropSelectdownOpen}
            setDropSelectdownOpen={setDropSelectdownOpen}
            isChef={isChef}
            tasks={tasks}
            onFilterChange={handleFilterChange}
            setTasks={setTasks}
            setSearchValue={setSearchValue}
            filterType={filterType}
            projectId={projectId}
            onMemberAdded={handleMemberAdded}
            chefAvatar={chefAvatar} // Passer la fonction de rappel ici
          />
        )}

        {showMembers && (
          <ProjectMembers
            project={project} // Assurez-vous que le projet est passé correctement
            members={members}
            setShowMembers={setShowMembers}
            projectId={projectId}
            tasks={tasks}
            isChef={isChef}
            setTasks={setTasks}
            updateMembersList={updateMembersList} // Passer la fonction updateMembersList
          />
        )}

        <div className="flex gap-2">
          <ListTasks
            isChef={isChef}
            projectId={projectId}
            tasks={filteredTasks}
            searchValue={searchValue}
            user={user}
            project={project}
            setTasks={setTasks}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default ProjectDetails;
