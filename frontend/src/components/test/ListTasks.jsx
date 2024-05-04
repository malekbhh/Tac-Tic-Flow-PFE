import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDrag, useDrop } from "react-dnd";
import axiosClient from "../../axios-client";
import bin from "./bin.png";
import edittask from "./edittask.png";
import CreateTask from "./CreateTask";

function ListTasks({
  projectId,
  tasks,
  setTasks,
  isChef,
  searchValue,
  project,
}) {
  const handleEditTask = (task) => {
    setSelectedTask(task);
  };

  const [todos, setTodos] = useState([]);
  const [doings, setDoings] = useState([]);
  const [dones, setDones] = useState([]);
  const [closeds, setCloseds] = useState([]);
  const [editTask, setEditTask] = useState(false);

  useEffect(() => {
    const filteredTodos = tasks.filter((task) => task.status === "To Do");
    const filteredDoings = tasks.filter((task) => task.status === "Doing");
    const filteredDones = tasks.filter((task) => task.status === "Done");
    const filteredClosed = tasks.filter((task) => task.status === "Closed");

    setTodos(filteredTodos);
    setDoings(filteredDoings);
    setDones(filteredDones);
    setCloseds(filteredClosed);
  }, [tasks]);

  const statuses = ["To Do", "Doing", "Done", "Closed"];

  return (
    <div className="flex gap-16">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          project={project}
          todos={todos}
          doings={doings}
          dones={dones}
          closeds={closeds}
          setEditTask={setEditTask}
          projectId={projectId}
          isChef={isChef}
          onEditTask={handleEditTask}
          searchValue={searchValue}
        />
      ))}
    </div>
  );
}

export default ListTasks;
const Section = ({
  status,
  tasks,
  setTasks,
  todos,
  searchValue,
  project,
  doings,
  dones,
  closeds,
  projectId,
  isChef,
  setEditTask,
}) => {
  const fetchTasks = async () => {
    try {
      const response = await axiosClient.get(`/projects/${projectId}/tasks`);
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: async (item) => {
      try {
        // Attendre que canDrop termine avant de continuer
        const authorized = await canDrop(item);
        if (authorized) {
          await axiosClient.post(`/tasks/${item.id}/status`, { status });
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === item.id ? { ...task, status } : task
            )
          );
          toast.success("Task updated successfully");
          fetchTasks();
        } else {
          toast.error("You are not authorized to move this task.");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        toast.error("Error updating task. Please try again.");
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const canDrop = async (item) => {
    try {
      // Faites une requête POST à la route '/tasks/check-can-drop' pour vérifier si l'utilisateur peut déplacer la tâche
      const taskMembershipResponse = await axiosClient.post(
        `/tasks/${item.id}/check-can-drop`,
        { isChef }
      );
      // Retourne true si l'utilisateur est autorisé à déplacer la tâche, sinon false
      return true;
    } catch (error) {
      console.error("Error checking user permissions:", error);
      return false;
    }
  };

  let text = "todo";
  let bg = "bg-slate-500";
  let tasksToMap = todos;
  if (status === "Doing") {
    text = "doing ";
    bg = "bg-purple-500";
    tasksToMap = doings;
  }
  if (status === "Done") {
    text = "done ";
    bg = "bg-green-500";
    tasksToMap = dones;
  }
  if (status === "Closed") {
    text = "closed ";
    bg = "bg-red-500";
    tasksToMap = closeds;
  }
  const addItemToSection = (id) => {
    setTasks((prev) => {
      const mTasks = prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: status };
        }
        return t;
      });
      return mTasks;
    });
  };
  return (
    <div
      ref={drop}
      className={` bg-white w-80 min-h-40 h-fit flex flex-col justify-between  gap-4  dark:bg-black dark:bg-opacity-30 rounded-lg p-2 ${
        isOver ? "bg-opacity-30" : "bg-opacity-70"
      }`}
    >
      {" "}
      <Header
        text={text}
        bg={bg}
        setEditTask={setEditTask}
        count={tasksToMap.length}
      />{" "}
      <div className="max-h-[310px] flex flex-col gap-2 p-1 overflow-y-scroll">
        {tasksToMap.length > 0 &&
          tasksToMap.map((task) => (
            <Task
              isChef={isChef}
              key={task.id}
              task={task}
              searchValue={searchValue}
              tasks={tasks}
              setTasks={setTasks}
              setEditTask={setEditTask}
            />
          ))}{" "}
      </div>
      {tasksToMap === todos && isChef && (
        <div className="flex  w-full justify-center items-center  ">
          <CreateTask
            projectId={projectId}
            project={project}
            setTasks={setTasks}
          />
        </div>
      )}
    </div>
  );
};
const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-xl uppercase text-sm text-white`}
      style={{ fontSize: "small" }}
    >
      {text}
      <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
        {count}
      </div>
    </div>
  );
};
const Task = ({ task, setTasks, isChef, searchValue, tasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const response = await axiosClient.get(`/users/${task.id}/avatar`);
        setUserAvatar(response.data.avatar);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // L'avatar n'a pas été trouvé, nous laissons userAvatar à null
          setUserAvatar(null);
        } else {
          console.error("Error fetching user avatar:", error);
        }
      }
    };

    // Vérifier si la tâche existe avant de récupérer l'avatar
    if (tasks.find((t) => t.id === task.id)) {
      fetchUserAvatar();
    } else {
      // Si la tâche n'existe pas, définir l'avatar sur null
      setUserAvatar(null);
    }
  }, [task.id, tasks]);

  const handleRemove = async () => {
    try {
      await axiosClient.delete(`/tasks/${task.id}`);
      // Mettre à jour localement la liste des tâches après suppression
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
      toast.success("Task removed successfully");
    } catch (error) {
      console.error("Error removing task:", error);
      toast.error("Error removing task. Please try again.");
    }
  };

  function getColorBasedOnPriority(priority) {
    switch (priority) {
      case "low":
        return "bg-green-400"; // Green for low priority
      case "medium":
        return "bg-orange"; // Pink for medium priority
      case "high":
        return "bg-red-500"; // Orange for high priority
      default:
        return "bg-gray-400"; // Default color if priority is not defined
    }
  }
  const isSearched =
    searchValue.trim() !== "" &&
    task.title.trim().toLowerCase().includes(searchValue.toLowerCase());

  return (
    <div
      ref={drag}
      className={`relative  p-4 bg-white dark:bg-gray-900 dark:bg-opacity-70 shadow-md dark:shadow-gray-950 dark:shadow-sm rounded-md cursor-grab ${
        isDragging ? "opacity-25" : "opacity-100"
      } ${
        isSearched
          ? "   border-2 border-blue-500     dark:border-blue-500 dark:shadow-2xl dark:shadow-blue-500  "
          : ""
      }`}
    >
      <div
        className={`w-20 h-1 rounded-full 
      ${getColorBasedOnPriority(task.priority)}
      `}
      >
        {" "}
      </div>
      <p className="text-black dark:text-white" style={{ fontSize: "small" }}>
        {task.title}
      </p>
      <p className="text-sm mb-3 text-gray-500 dark:text-gray-400">
        {task.due_date}
      </p>
      {isChef ? (
        <>
          <button
            className="absolute top-1 right-1 text-slate-400"
            onClick={() => handleEditTask(true)}
          >
            <img className="h-4 m-2" src={edittask} alt="Edit Task" />
          </button>
          <button
            className="absolute bottom-[2px] right-1 text-slate-400 "
            onClick={handleRemove}
          >
            <img className="h-4 m-2" src={bin} alt="icon" />
          </button>
          {userAvatar && (
            <div className="absolute right-8 bottom-2 text-slate-400">
              <img
                className="w-5 h-5 rounded-full"
                src={userAvatar}
                alt="user avatar"
              />
            </div>
          )}
        </>
      ) : (
        userAvatar && (
          <div className="absolute right-3 bottom-2 text-slate-400">
            <img
              className="w-5 h-5 rounded-full"
              src={userAvatar}
              alt="user avatar"
            />
          </div>
        )
      )}
    </div>
  );
};
