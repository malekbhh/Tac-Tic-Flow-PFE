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
    <div className="dark:text-gray-300 w-[80%]">
      <ProgressProject
        projectId={projectId}
        showMore={showMore}
        setShowMore={setShowMore}
      />

      <div>
        {showMore && (
          <div>
            <h2 className="w-full mt-16 text-xl dark:text-gray-300  font-bold">
              Progress Members:
            </h2>
            <div className="flex w-full flex-wrap justify-between  ">
              {membersWithTasks.map((member) => (
                <div
                  key={member.id}
                  className="my-3 flex flex-col justify-center w-[45%] items-center"
                  style={{ fontSize: "1.2rem" }} // Ajuster la taille du texte
                >
                  <div className="flex items-center gap-2">
                    {member.avatar ? (
                      <img
                        className="rounded-full ml-2 h-16 w-16" // Ajuster la taille de l'avatar
                        src={member.avatar}
                        alt=""
                      />
                    ) : (
                      <FaUser className="ml-2 mt-11  bg-white p-2 rounded-full h-16 w-16 text-gray-500" /> // Ajuster la taille de l'icône
                    )}
                    <p className="font-semibold text-lg">{member.name}</p>
                  </div>
                  <div className="w-full mt-3">
                    <TaskBarChart taskProgress={member.taskProgress} />
                  </div>
                  <table className="w-full mt-10 border-collapse border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 bg-opacity-30 dark:bg-black dark:bg-opacity-30 ">
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
                          className="hover:bg-gray-50 hover:bg-opacity-30 dark:hover:bg-black dark:hover:bg-opacity-30 "
                        >
                          <td className="py-3 px-4">{task.title}</td>
                          <td className="py-3 px-4">{task.due_date}</td>
                          <td className="py-3 px-4">{task.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProgressChef;
