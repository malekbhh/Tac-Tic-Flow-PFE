import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDrag, useDrop } from "react-dnd";
import axiosClient from "../../axios-client";
import bin from "./bin.png";
import edittask from "./edittask.png";
import CreateTask from "./CreateTask";
function ListTasks({ projectId, tasks, setTasks, isChef }) {
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
          todos={todos}
          doings={doings}
          dones={dones}
          closeds={closeds}
          setEditTask={setEditTask}
          projectId={projectId}
          isChef={isChef}
          onEditTask={handleEditTask}
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
      className={` bg-white w-60 min-h-40 h-fit flex flex-col justify-between  gap-4  dark:bg-black dark:bg-opacity-30 rounded-lg p-2 ${
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
              tasks={tasks}
              setTasks={setTasks}
              setEditTask={setEditTask}
            />
          ))}{" "}
      </div>
      {tasksToMap === todos && isChef && (
        <div className="flex  w-full justify-center items-center  ">
          <CreateTask projectId={projectId} setTasks={setTasks} />
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
const Task = ({ task, tasks, setEditTask, setTasks, isChef }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  console.log(isDragging);

  const handleremove = async (id) => {
    try {
      // Envoyer une requête DELETE pour supprimer la tâche du backend
      await axiosClient.delete(`/tasks/${id}`);

      // Mettre à jour l'état local des tâches après la suppression réussie
      const fTasks = tasks.filter((t) => t.id !== id);
      localStorage.setItem("tasks", JSON.stringify(fTasks));
      setTasks(fTasks);
      toast("Task removed", { icon: "👽" });
    } catch (error) {
      console.error("Error removing task:", error);
      toast.error("Error removing task. Please try again.");
    }
  };
  return (
    <div
      ref={drag}
      className={`relative p-4  bg-white  dark:bg-gray-900 shadow-md dark:shadow-gray-950 dark:shadow-sm rounded-md cursor-grab ${
        isDragging ? "opacity-25" : " opacity-100"
      }`}
    >
      <p className="text-black dark:text-white " style={{ fontSize: "small" }}>
        {task.title}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {task.due_date}
      </p>{" "}
      {isChef && (
        <button
          className="absolute top-1 right-1 text-slate-400 "
          onClick={() => setEditTask(true)}
        >
          <img className="h-4 m-2" src={edittask} alt="icon" />
        </button>
      )}
      {isChef && (
        <button
          className="absolute bottom-1 right-1 text-slate-400 "
          onClick={() => handleremove(task.id)}
        >
          <img className="h-4 m-2" src={bin} alt="icon" />
        </button>
      )}
    </div>
  );
};
