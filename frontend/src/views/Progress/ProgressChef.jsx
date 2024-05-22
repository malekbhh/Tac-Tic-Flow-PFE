import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import ProgressProject from "./ProgressProject";
import TaskBarChart from "./TaskBarChart";
import { FaUser } from "react-icons/fa";

function ProgressChef({ projectId }) {
  const [membersWithTasks, setMembersWithTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseMembers = await axiosClient.get(
          `/projects/${projectId}/members`
        );
        const membersData = responseMembers.data.members;

        const tasksPromises = membersData.map(async (member) => {
          const responseTasks = await axiosClient.get(
            `/tasks/project/${projectId}/member/${member.id}`
          );
          const tasks = responseTasks.data;
          const taskProgress = calculateTaskProgress(tasks);
          return { ...member, tasks, taskProgress };
        });

        const membersWithTasksData = await Promise.all(tasksPromises);
        setMembersWithTasks(membersWithTasksData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project members and tasks:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const calculateTaskProgress = (tasks) => {
    const statuses = { "To Do": 0, Doing: 0, Done: 0, Closed: 0 };
    tasks.forEach((task) => {
      statuses[task.status]++;
    });
    const totalTasks = tasks.length;
    return Object.keys(statuses).map((status) => ({
      status,
      percentage:
        totalTasks > 0 ? ((statuses[status] / totalTasks) * 100).toFixed(2) : 0,
    }));
  };

  return (
    <div className="grid grid-cols-3 gap-4 mr-11 dark:text-gray-300">
      <div className="grid grid-cols-subgrid gap-4 col-span-2">
        <div className="col-start-1 flex flex-col justify-between items-center  dark:bg-black dark:bg-opacity-25 bg-white bg-opacity-30 shadow-md rounded-xl col-end-3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mt-8">
            Your project's progress
          </h2>
          <div className="flex justify-center items-center">
            <ProgressProject projectId={projectId} />
          </div>
        </div>
      </div>
      {membersWithTasks.map((member, index) => (
        <div className="w-full" key={member.id}>
          <div className="bg-white dark:bg-black dark:bg-opacity-25 bg-opacity-30 w-full rounded-xl p-6 shadow-md h-full max-h-[500px] flex flex-col">
            <div className="flex w-full items-center gap-4">
              {member.avatar ? (
                <img
                  className="rounded-full h-16 w-16"
                  src={member.avatar}
                  alt={member.name}
                />
              ) : (
                <FaUser className="rounded-full h-16 w-16 text-gray-500" />
              )}
              <p className="font-semibold text-lg">{member.name}</p>
            </div>
            <div className="mt-4">
              <TaskBarChart taskProgress={member.taskProgress} />
            </div>
            <div className="overflow-y-auto mt-4">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-black bg-opacity-30 dark:bg-opacity-30">
                  <tr>
                    <th className="py-2 px-4 text-left">Title</th>
                    <th className="py-2 px-4 text-left">Deadline</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {member.tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50 dark:hover:bg-black hover:bg-opacity-30 dark:hover:bg-opacity-30"
                    >
                      <td className="py-3 px-4">{task.title}</td>
                      <td className="py-3 px-4">{task.due_date}</td>
                      <td className="py-3 px-4">{task.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProgressChef;
