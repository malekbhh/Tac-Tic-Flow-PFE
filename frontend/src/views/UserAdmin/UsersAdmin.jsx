import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useSpring, animated } from "react-spring";
import { Card, Typography } from "@material-tailwind/react";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotifications } = useStateContext();
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddClick = () => {
    setShowForm(!showForm);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let error = {};

    if (!formData.name) {
      error.name = "Name is required";
    } else if (typeof formData.name !== "string") {
      error.name = "Name must be a string";
    }

    if (!formData.email) {
      error.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      error.email = "Invalid email format";
    }

    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const fadeAnim = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get("/usersAccount")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching users:", error);
      });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await axiosClient.post("/usersAccount", {
          name: formData.name,
          email: formData.email,
          departement: formData.department, // Utiliser 'department' plutôt que 'departement'
        });
        console.log(response.data);

        // Ajouter le nouvel utilisateur à la liste des utilisateurs en utilisant la réponse du serveur
        setUsers((prevUsers) => [...prevUsers, response.data.user]);
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const onDeleteClick = async (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosClient.delete(`/usersAccount/${user.id}`);
        setNotifications(`User was successfully deleted${user.name}`);
        console.log(user);
        // Mettre à jour la liste des utilisateurs en supprimant l'utilisateur de la liste
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="flex flex-col w-full mt-11 mb-10">
      <div className="flex justify-between mb-5 items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Users
        </h1>

        <div className="flex items-center">
          <button
            className="btn-add mb-3 md:mb-0 rounded-full bg-indigo-500 text-white py-2 px-4  hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleAddClick}
          >
            {showForm ? "Close Form" : "Add New User"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className=" rounded mb-8 p-4 shadow-md w-full ">
          <p className="text-red-500 text-xs font-bold mb-2">
            **Attention :** L'ajout d'un utilisateur confère des droits d'accès
            au système.
          </p>{" "}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col md:flex-row md:space-x-6 mb-4 w-3/5">
              <div className="flex flex-col mb-4 md:w-1/2">
                <label
                  htmlFor="name"
                  className="dark:text-gray-300 font-bold mb-2"
                >
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`border border-gray-300 text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col mb-4 md:w-1/2">
                <label
                  htmlFor="email"
                  className="dark:text-gray-300 font-bold mb-2"
                >
                  Email:
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border border-gray-300 text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-6 mb-4 w-3/5">
              <div className="flex flex-col mb-4 md:w-1/2">
                <label
                  htmlFor="department"
                  className="dark:text-gray-300 font-bold mb-2"
                >
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="px-4 py-2 mt-2 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  required
                >
                  <option value="" disabled defaultValue>
                    Select department
                  </option>
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="security">Security</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 rounded-full text-white py-2 px-4  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add user
            </button>
          </form>
        </div>
      )}

      <div className=" mt-6 card animated fadeInDown">
        <Card className="h-full bg-white bg-opacity-35 dark:bg-black dark:bg-opacity-35 dark:text-white w-full">
          <table className="w-full  min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Name
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Email
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Department
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Create Date
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="text-center">
                  <td colSpan="7">Loading...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <animated.tr
                    key={u.id}
                    style={fadeAnim}
                    className="even:bg-blue-gray-50/50"
                  >
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.departement}</td>
                    <td className="p-4">{formatDate(u.created_at)}</td>
                    <td className="p-4">
                      <button
                        className="btn-delete rounded-full bg-red-500 hover:bg-red-700 text-white py-1 px-2  ml-2"
                        onClick={() => onDeleteClick(u)}
                      >
                        Delete
                      </button>
                    </td>
                  </animated.tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default UsersAdmin;

// import React, { useEffect, useState } from "react";
// import axiosClient from "../../axios-client.js";
// import { useStateContext } from "../../context/ContextProvider.jsx";
// import { useSpring, animated } from "react-spring";
// import { Card, Typography } from "@material-tailwind/react";

// function UsersAdmin() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { setNotifications, isDarkMode } = useStateContext(); // Ajoutez isDarkMode depuis votre contexte
//   const [showForm, setShowForm] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleAddClick = () => {
//     setShowForm(!showForm);
//   };

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     department: "",
//   });

//   const handleChange = (event) => {
//     setFormData({ ...formData, [event.target.name]: event.target.value });
//   };

//   const validateForm = () => {
//     let error = {};

//     if (!formData.name) {
//       error.name = "Name is required";
//     } else if (typeof formData.name !== "string") {
//       error.name = "Name must be a string";
//     }

//     if (!formData.email) {
//       error.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       error.email = "Invalid email format";
//     }

//     setErrors(error);
//     return Object.keys(error).length === 0;
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     };
//     return new Date(dateString).toLocaleString(undefined, options);
//   };

//   const fadeAnim = useSpring({
//     from: { opacity: 0 },
//     to: { opacity: 1 },
//     delay: 200,
//   });

//   const getUsers = () => {
//     setLoading(true);
//     axiosClient
//       .get("/usersAccount")
//       .then(({ data }) => {
//         setLoading(false);
//         setUsers(data.data);
//       })
//       .catch((error) => {
//         setLoading(false);
//         console.error("Error fetching users:", error);
//       });
//   };
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (validateForm()) {
//       try {
//         const response = await axiosClient.post("/usersAccount", {
//           name: formData.name,
//           email: formData.email,
//           department: formData.department, // Utiliser 'department' plutôt que 'departement'
//         });
//         console.log(response.data);

//         // Ajouter le nouvel utilisateur à la liste des utilisateurs en utilisant la réponse du serveur
//         setUsers((prevUsers) => [...prevUsers, response.data.user]);
//       } catch (error) {
//         console.error("Error adding user:", error);
//       }
//     }
//   };

//   const onDeleteClick = async (user) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await axiosClient.delete(`/usersAccount/${user.id}`);
//         setNotifications(`User was successfully deleted${user.name}`);
//         console.log(user);
//         // Mettre à jour la liste des utilisateurs en supprimant l'utilisateur de la liste
//         setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     getUsers();
//   }, []);

//   return (
//     <div className="flex flex-col w-full mt-4 mb-10">
//       <div className="flex justify-between">
//         <h1 className="text-2xl pl-4 font-bold ">Users </h1>

//         <div className="flex flex-col  md:flex-row justify-between items-center mb-5">
//           <button
//             className="btn-add mb-3 md:mb-0 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             onClick={handleAddClick}
//           >
//             {showForm ? "Close Form" : "Add new"}
//           </button>
//         </div>
//       </div>
//       {showForm && (
//         <div className=" rounded mb-8 p-4 shadow-md w-full ">
//           <p className="text-red-500 text-xs font-bold mb-2">
//             **Attention :** L'ajout d'un utilisateur confère des droits d'accès
//             au système.
//           </p>{" "}
//           <form onSubmit={handleSubmit} className="w-full">
//             <div className="flex flex-col md:flex-row md:space-x-6 mb-4 w-3/5">
//               <div className="flex flex-col mb-4 md:w-1/2">
//                 <label
//                   htmlFor="name"
//                   className="dark:text-gray-300 font-bold mb-2"
//                 >
//                   Name:
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   id="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className={`border border-gray-300 text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                     errors.name ? "border-red-500" : ""
//                   }`}
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm">{errors.name}</p>
//                 )}
//               </div>
//               <div className="flex flex-col mb-4 md:w-1/2">
//                 <label
//                   htmlFor="email"
//                   className="dark:text-gray-300 font-bold mb-2"
//                 >
//                   Email:
//                 </label>
//                 <input
//                   type="text"
//                   name="email"
//                   id="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`border border-gray-300 text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                     errors.email ? "border-red-500" : ""
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm">{errors.email}</p>
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-col md:flex-row md:space-x-6 mb-4 w-3/5">
//               <div className="flex flex-col mb-4 md:w-1/2">
//                 <label
//                   htmlFor="department"
//                   className="dark:text-gray-300 font-bold mb-2"
//                 >
//                   Department
//                 </label>
//                 <select
//                   id="department"
//                   name="department"
//                   value={formData.department}
//                   onChange={handleChange}
//                   className="px-4 py-2 mt-2 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                   required
//                 >
//                   <option value="" disabled defaultValue>
//                     Select department
//                   </option>
//                   <option value="web">Web</option>
//                   <option value="mobile">Mobile</option>
//                   <option value="security">Security</option>
//                 </select>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               Add user
//             </button>
//           </form>
//         </div>
//       )}

//       <div
//         className={`mt-6 card animated fadeInDown "

//         `}
//       >
//           <table className="w-full min-w-max table-auto text-left">
//             <thead>
//               <tr>
//                 <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="font-normal leading-none opacity-70"
//                   >
//                     Name
//                   </Typography>
//                 </th>
//                 <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="font-normal leading-none opacity-70"
//                   >
//                     Email
//                   </Typography>
//                 </th>
//                 <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="font-normal leading-none opacity-70"
//                   >
//                     Department
//                   </Typography>
//                 </th>
//                 <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="font-normal leading-none opacity-70"
//                   >
//                     Create Date
//                   </Typography>
//                 </th>
//                 <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="font-normal leading-none opacity-70"
//                   >
//                     Actions
//                   </Typography>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr className="text-center">
//                   <td colSpan="5">Loading...</td>
//                 </tr>
//               ) : (
//                 users.map((u, index) => (
//                   <animated.tr
//                     key={u.id}
//                     style={fadeAnim}
//                     className={`${
//                       index % 2 === 0 ? "bg-blue-gray-50" : "bg-white"
//                     } ${
//                       index % 2 === 0 && isDarkMode
//                         ? "bg-opacity-50"
//                         : "bg-opacity-35"
//                     }`}
//                   >
//                     <td className="p-4">{u.name}</td>
//                     <td className="p-4">{u.email}</td>
//                     <td className="p-4">{u.department}</td>
//                     <td className="p-4">{formatDate(u.created_at)}</td>
//                     <td className="p-4">
//                       <button
//                         className="btn-delete bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded ml-2"
//                         onClick={() => onDeleteClick(u)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </animated.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default UsersAdmin;
