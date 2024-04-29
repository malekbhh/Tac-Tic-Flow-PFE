import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import ProgressProject from "./ProgressProject";

function ProgressChef({ projectId }) {
  const [membersWithTasks, setMembersWithTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false); // État pour gérer l'affichage du contenu supplémentaire

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les membres du projet
        const responseMembers = await axiosClient.get(
          `/projects/${projectId}/members`
        );
        const membersData = responseMembers.data.members;

        // Récupérer les tâches de tous les membres
        const tasksPromises = membersData.map(async (member) => {
          const responseTasks = await axiosClient.get(
            `/tasks/project/${projectId}/member/${member.id}`
          );
          const tasks = responseTasks.data;
          const taskProgress = calculateTaskProgress(tasks);
          return { ...member, tasks, taskProgress };
        });

        // Attendre que toutes les promesses soient résolues
        const membersWithTasksData = await Promise.all(tasksPromises);

        // Mettre à jour l'état avec les membres et leurs tâches
        setMembersWithTasks(membersWithTasksData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project members and tasks:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // Fonction pour calculer le progrès des tâches d'un membre
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
    <div className="dark:text-gray-300">
      <ProgressProject
        projectId={projectId}
        showMore={showMore}
        setShowMore={setShowMore}
      />

      <div>
        {showMore && (
          <div>
            <h2 className="my-3 mt-8 text-xl dark:text-gray-300 font-bold">
              Progress Members:
            </h2>
            <div className="flex  w-full flex-wrap gap-4">
              {" "}
              {membersWithTasks.map((member) => (
                <div key={member.id} className="my-3">
                  <div className="flex items-center gap-2">
                    <img
                      className="rounded-full h-14 w-14"
                      src={member.avatar}
                      alt=""
                    />
                    <p className="font-semibold">{member.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold"> Email: </span>{" "}
                    <p>{member.email}</p>
                  </div>
                  {member.tasks.length > 0 ? (
                    <div className="tasks-table w-fit mt-3">
                      <div>
                        {member.taskProgress.length > 0 && (
                          <div className="flex flex-wrap justify-around w-full">
                            {member.taskProgress.map((statusProgress) => (
                              <div
                                key={statusProgress.status}
                                className="w-full mt-4 mb-2"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-xs dark:text-gray-300 text-center">
                                    {statusProgress.status}{" "}
                                    {statusProgress.percentage}%
                                  </p>
                                  <div className="progress-container">
                                    <div
                                      className="progress-bar"
                                      style={{
                                        width: `${statusProgress.percentage}%`,
                                        backgroundColor: getStatusColor(
                                          statusProgress.status
                                        ),
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}{" "}
                        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
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
                    </div>
                  ) : (
                    <p className=" mt-7 font-semibold">
                      No tasks assigned for this member.
                    </p>
                  )}
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

function getStatusColor(status) {
  switch (status) {
    case "To Do":
      return "#F87171"; // Rouge pour "To Do"
    case "Doing":
      return "#60A5FA"; // Bleu pour "Doing"
    case "Done":
      return "#34D399"; // Vert pour "Done"
    case "Closed":
      return "#6B7280"; // Gris pour "Closed"
    default:
      return "#000000"; // Noir par défaut
  }
}
