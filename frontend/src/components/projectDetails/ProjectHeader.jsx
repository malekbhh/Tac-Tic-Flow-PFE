// import React, { useState, useEffect } from "react";
// import { Avatar } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import search from "../../assets/search1.png";
// import close from "../../assets/close.png";
// import adduser from "../../assets/adduser.png";
// import axiosClient from "../../axios-client"; // Importez votre client Axios
// import AddMemberTask from "./AddMemberTask";
// import crown2 from "../../assets/crown2.png";

// const ProjectHeader = ({
//   project,
//   members,
//   toggleMembers,
//   updateTaskList,
//   projectId,
//   setSearchValue,
//   isChef,
//   tasks,
//   setTasks,
//   onMemberAdded,
//   setDropSelectdownOpen,
//   isDropSelectdownOpen,
//   onFilterChange,
//   filterType,
//   chefAvatar, // Ajoutez la fonction pour changer le type de filtre
// }) => {
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [allUsers, setAllUsers] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   // Fonction pour changer le type de filtre et mettre à jour les tâches
//   const handleFilterChange = (filter) => {
//     onFilterChange(filter);
//   };
//   const toggleTable = () => {
//     setShowTable(!showTable);
//   };
//   const handleDropdownSelect = () => {
//     setDropSelectdownOpen(!isDropSelectdownOpen);
//   };
//   const handleDropdownToggle = () => {
//     setDropdownOpen(!isDropdownOpen);
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await axiosClient.get("/usersNotMembers", {
//         params: {
//           members: members.map((member) => member.id),
//         },
//       });

//       if (response && response.data && response.data.data) {
//         setAllUsers(response.data.data);
//       } else {
//         console.error("Invalid response format:", response);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [members]);
//   const handleAddMemberToProject = async (userId) => {
//     try {
//       const response = await axiosClient.post("/add-member-to-project", {
//         userId,
//         projectId,
//         role: "member",
//       });

//       if (response && response.data) {
//         onMemberAdded(response.data.member);
//         sendNotificationToUser(response.data.member);
//       } else {
//         console.error("Invalid response format:", response);
//       }
//     } catch (error) {
//       console.error("Error adding member to project:", error);
//     }
//   };
//   const sendNotificationToUser = (member) => {
//     const notificationMessage = `Vous avez été ajouté au projet ${project.title}`;

//     axiosClient
//       .post("/send-notification", {
//         notification: notificationMessage,
//         receiver_id: member.id, // L'ID de l'utilisateur ajouté au projet
//       })
//       .then((response) => {
//         console.log("Notification sent successfully:", response);
//       })
//       .catch((error) => {
//         console.error("Error sending notification:", error);
//       });
//   };
//   return (
//     <div className="dark:text-white  py-1 dark:bg-black dark:bg-opacity-30 w-[1240px] px-4 flex flex-col md:flex-row items-center justify-between rounded-xl h-14 bg-opacity-25 bg-white text-midnightblue">
//       <div className="flex gap-4 justify-center items-center">
//         <h2 className="text-xl flex justify-center items-center dark:text-gray-300 font-semibold">
//           {project.title}
//         </h2>{" "}
//         <div className="items-center relative justify-center flex flex-col">
//           {" "}
//           <img
//             className="h-5 absolute bottom-[20px] "
//             src={crown2}
//             alt="crownicon"
//           />
//           {chefAvatar ? (
//             <img
//               src={chefAvatar}
//               className="w-7 h-7 rounded-full"
//               alt="Chef Avatar"
//             />
//           ) : (
//             <div className="bg-gray-200 dark:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex justify-center items-center">
//               <UserOutlined />
//             </div>
//           )}
//         </div>
//         <div
//           onClick={toggleMembers}
//           className="flex justify-center hover:cursor-pointer items-center gap-2"
//         >
//           {members.map((member, index) =>
//             member.avatar ? (
//               <img
//                 key={index}
//                 className="w-8 h-8 rounded-full mr-2"
//                 src={member.avatar}
//                 alt="Avatar"
//               />
//             ) : (
//               <div className="bg-gray-200 dark:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex justify-center items-center">
//                 <UserOutlined />
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       <div className="flex gap-2 justify-center relative items-center">
//         <div className="flex border-gray-500 items-center border-2 opacity-70 justify-between px-2 py-1 rounded-2xl w-80 gap-4">
//           <input
//             type="text"
//             placeholder="Search for task"
//             className="bg-transparent w-80 focus:outline-none text-white"
//             onChange={(e) => setSearchValue(e.target.value)}
//           />
//           <img src={search} alt="search icon" className="h-4 text-slate-500" />
//         </div>{" "}
//         <button
//           onClick={handleDropdownToggle}
//           className="flex p-2 rounded-full items-center focus:bg-white dark:focus:bg-gray-800 gap-2"
//         >
//           <p className="text-gray-500 dark:text-gray-400 font-bold">Filters</p>
//         </button>
//         <div className="flex flex-col absolute top-[39px] -right-2 w-80">
//           <div
//             className={`${
//               isDropdownOpen ? "block" : "hidden"
//             } text-base list-none bg-opacity-25 bg-white px-1 rounded-xl rounded-t-none shadow dark:bg-black dark:bg-opacity-30 dark:divide-gray-600`}
//           >
//             <ul className="py-1">
//               <li
//                 className={`flex px-2 ${
//                   filterType === "all" ? "bg-gray-100" : ""
//                 } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg items-center`}
//               >
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white"
//                   onClick={() => handleFilterChange("all")}
//                 >
//                   All Tasks
//                 </button>
//               </li>
//               <li
//                 className={`flex px-2 ${
//                   filterType === "overdue" ? "bg-gray-100" : ""
//                 } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg items-center`}
//               >
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white"
//                   onClick={() => handleFilterChange("overdue")}
//                 >
//                   Overdue
//                 </button>
//               </li>
//               <li
//                 className={`flex px-2 ${
//                   filterType === "nextDay" ? "bg-gray-100" : ""
//                 } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg items-center`}
//               >
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white"
//                   onClick={() => handleFilterChange("nextDay")}
//                 >
//                   Due in the next day
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//         {isChef && (
//           <>
//             <AddMemberTask
//               projectId={projectId}
//               tasks={tasks}
//               setTasks={setTasks}
//               project={project} // Passer le projet comme prop
//               members={members}
//               updateTaskList={updateTaskList} // Passer la fonction de mise à jour
//             />
//             <button
//               onClick={toggleTable}
//               className="flex p-2 items-center  rounded-full gap-2"
//             >
//               <img className="h-6 " src={adduser} alt="icon" />
//               <p className="dark:text-gray-400 text-gray-500  font-bold">
//                 Share
//               </p>{" "}
//             </button>
//           </>
//         )}
//         {showTable && (
//           <div className="h-[400px] mt-[354px] translate-x-4 w-[400px]">
//             <div className="flex items-center h-14 justify-between px-6 ">
//               <p className="font-bold">Add members to this project</p>
//               <button
//                 onClick={() => {
//                   setShowTable(false);
//                 }}
//               >
//                 {" "}
//                 <img className="h-4" src={close} alt="icon" />
//               </button>
//             </div>
//             {/* <div
//               className={`flex justify-center items-start table-container  p-4 rounded-lg h-[620px] shadow-md bg-white  bg-opacity-30  dark:bg-black dark:bg-opacity-30  `}
//             > */}

//             <div
//               className={`flex justify-center items-start table-container  p-4 rounded-lg  shadow-md bg-white dark:bg-slate-900   `}
//             >
//               <table className="table-container ">
//                 <thead className="table-header ">
//                   <tr>
//                     <th className=" py-2 text-midnightblue dark:text-white">
//                       Profil
//                     </th>
//                     <th className="py-2 text-midnightblue dark:text-white">
//                       Email
//                     </th>
//                     <th className=" py-2 text-midnightblue dark:text-white">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="table-body">
//                   {allUsers.map((user) => (
//                     <tr
//                       className="border-t-2 border-b-2 border-indigo-300 "
//                       key={user.id}
//                     >
//                       <td className="pl-2 pr-5 py-2  flex items-end">
//                         {user.avatar ? (
//                           <img
//                             className="w-8 h-8 rounded-full mr-2"
//                             src={user.avatar}
//                             alt="Avatar"
//                           />
//                         ) : (
//                           <Avatar
//                             className="w-8 h-8 rounded-full mr-2 "
//                             icon={<UserOutlined />}
//                           />
//                         )}

//                         {user.name}
//                       </td>
//                       <td className=" py-2 pl-6">{user.email}</td>
//                       <td className="px-4 flex items-center justify-center py-2">
//                         <button
//                           onClick={() => handleAddMemberToProject(user.id)}
//                           className="dark:bg-blue-500 bg-midnightblue  flex  hover:bg-blue-700 text-white font-bold py-1 px-4 items-center justify-center rounded-full "
//                         >
//                           Add
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectHeader;import React, { useState, useEffect } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import search from "../../assets/search1.png";
import close from "../../assets/close.png";
import adduser from "../../assets/adduser.png";
import axiosClient from "../../axios-client";
import AddMemberTask from "./AddMemberTask";
import React, { useState, useEffect } from "react";

import crown2 from "../../assets/crown2.png";

const ProjectHeader = ({
  project,
  members,
  toggleMembers,
  updateTaskList,
  projectId,
  setSearchValue,
  isChef,
  tasks,
  setTasks,
  onMemberAdded,
  setDropSelectdownOpen,
  isDropSelectdownOpen,
  onFilterChange,

  filterType,
  chefAvatar,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleFilterChange = (filter) => {
    onFilterChange(filter);
  };

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  const handleDropdownSelect = () => {
    setDropSelectdownOpen(!isDropSelectdownOpen);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("/usersNotMembers", {
        params: {
          members: members.map((member) => member.id),
        },
      });

      if (response && response.data && response.data.data) {
        setAllUsers(response.data.data);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [members]);

  const handleAddMemberToProject = async (userId) => {
    try {
      const response = await axiosClient.post("/add-member-to-project", {
        userId,
        projectId,
        role: "member",
      });

      if (response && response.data) {
        onMemberAdded(response.data.member);
        sendNotificationToUser(response.data.member);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error adding member to project:", error);
    }
  };

  const sendNotificationToUser = (member) => {
    const notificationMessage = `Vous avez été ajouté au projet ${project.title}`;

    axiosClient
      .post("/send-notification", {
        notification: notificationMessage,
        receiver_id: member.id,
      })
      .then((response) => {
        console.log("Notification sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  };

  return (
    <div className="dark:text-white py-2 h-[45px] dark:bg-black dark:bg-opacity-30 w-[1240px] px-4 flex flex-col md:flex-row items-center justify-between rounded-xl  bg-opacity-25 bg-white text-midnightblue">
      <div className="flex gap-4 justify-center items-center">
        <h2 className="text-xl flex justify-center  items-center dark:text-gray-300 font-semibold">
          {project.title}
        </h2>
        {chefAvatar && (
          <div className="items-center gap-1 relative justify-center flex flex-col">
            <img
              className="h-4 w-5 absolute bottom-[22px]"
              src={crown2}
              alt="crownicon"
            />
            <Avatar
              className="w-8 h-8   rounded-full"
              src={chefAvatar}
              icon={<UserOutlined />}
            />
          </div>
        )}
        <div
          onClick={toggleMembers}
          className="flex justify-center hover:cursor-pointer items-center gap-2"
        >
          {members.map((member, index) =>
            member.avatar ? (
              <img
                key={index}
                className="w-8 h-8 rounded-full mr-2"
                src={member.avatar}
                alt="Avatar"
              />
            ) : (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex justify-center items-center"
              >
                <UserOutlined />
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-center relative items-center">
        <div className="flex border-gray-500 items-center border-2 opacity-70 justify-between px-2 py-1 rounded-2xl w-80 gap-4">
          <input
            type="text"
            placeholder="Search for task"
            className="bg-transparent w-80 focus:outline-none text-white"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <img src={search} alt="search icon" className="h-4 text-slate-500" />
        </div>
        <button
          onClick={handleDropdownToggle}
          className="flex p-2 rounded-full items-center focus:bg-white dark:focus:bg-gray-800 gap-2"
        >
          <p className="text-gray-500 dark:text-gray-400 font-bold">Filters</p>
        </button>
        <div className="flex flex-col absolute top-[39px] -right-2 w-80">
          <div
            className={`${
              isDropdownOpen ? "block" : "hidden"
            } text-base list-none bg-opacity-25 bg-white px-1 rounded-xl rounded-t-none shadow dark:bg-black dark:bg-opacity-30 dark:divide-gray-600`}
          >
            <ul className="py-1">
              <li
                className={`flex px-2 ${
                  filterType === "all" ? "bg-gray-100" : ""
                } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg items-center`}
              >
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white"
                  onClick={() => handleFilterChange("all")}
                >
                  All Tasks
                </button>
              </li>
              <li
                className={`flex px-2 ${
                  filterType === "overdue" ? "bg-gray-100" : ""
                } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
              >
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white"
                  onClick={() => handleFilterChange("overdue")}
                >
                  Overdue
                </button>
              </li>
              <li
                className={`flex px-2 ${
                  filterType === "nextDay" ? "bg-gray-100" : ""
                } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg items-center`}
              >
                <button
                  className="block
                  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white"
                  onClick={() => handleFilterChange("nextDay")}
                >
                  Due in the next day
                </button>
              </li>
            </ul>
          </div>
        </div>
        {isChef && (
          <>
            <AddMemberTask
              projectId={projectId}
              tasks={tasks}
              setTasks={setTasks}
              project={project}
              members={members}
              updateTaskList={updateTaskList}
            />
            <button
              onClick={toggleTable}
              className="flex p-2 items-center rounded-full gap-2"
            >
              <img className="h-6" src={adduser} alt="icon" />
              <p className="dark:text-gray-400 text-gray-500 font-bold">
                Share
              </p>
            </button>
          </>
        )}
        {showTable && (
          <div className="h-[400px] mt-[354px] translate-x-4 w-[400px]">
            <div className="flex items-center h-14 justify-between px-6">
              <p className="font-bold">Add members to this project</p>
              <button
                onClick={() => {
                  setShowTable(false);
                }}
              >
                <img className="h-4" src={close} alt="icon" />
              </button>
            </div>
            <div
              className={`flex justify-center items-start table-container p-4 rounded-lg shadow-md bg-white dark:bg-slate-900`}
            >
              <table className="table-container">
                <thead className="table-header">
                  <tr>
                    <th className="py-2 text-midnightblue dark:text-white">
                      Profil
                    </th>
                    <th className="py-2 text-midnightblue dark:text-white">
                      Email
                    </th>
                    <th className="py-2 text-midnightblue dark:text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {allUsers.map((user) => (
                    <tr
                      className="border-t-2 border-b-2 border-indigo-300"
                      key={user.id}
                    >
                      <td className="pl-2 pr-5 py-2 flex items-end">
                        {user.avatar ? (
                          <img
                            className="w-8 h-8 rounded-full mr-2"
                            src={user.avatar}
                            alt="Avatar"
                          />
                        ) : (
                          <Avatar
                            className="w-8 h-8 rounded-full mr-2"
                            icon={<UserOutlined />}
                          />
                        )}
                        {user.name}
                      </td>
                      <td className="py-2 pl-6">{user.email}</td>
                      <td className="px-4 flex items-center justify-center py-2">
                        <button
                          onClick={() => handleAddMemberToProject(user.id)}
                          className="dark:bg-blue-500 bg-midnightblue flex hover:bg-blue-700 text-white font-bold py-1 px-4 items-center justify-center rounded-full"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
