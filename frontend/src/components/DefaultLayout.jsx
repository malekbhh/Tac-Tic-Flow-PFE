import { React, useState } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect } from "react";
import AddEditBoardModal from "../modals/AddEditBoardModal.jsx";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import plus1 from "../assets/plus1.png";
import plus from "../assets/plus1.png";
import NotificationDialog from "./Notifications/NotificationDialog.jsx";
import SideBar from "./contentsDefaultLayout/SideBar.jsx";

const DefaultLayout = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [boardType, setBoardType] = useState("add");
  const { user, token, setUser, setToken } = useStateContext();
  const [isOpen, setIsOpen] = useState(true);
  const [isNotificationOpen, setNotificationOpen] = useState(false); // Nouvel état pour suivre l'état de la boîte de dialogue de notification
  const { setUnreadNotifications, unreadNotifications } = useStateContext();
  // useEffect(() => {
  //   const fetchUnreadNotifications = async () => {
  //     try {
  //       const response = await axiosClient.get("/notifications/unread");
  //       setUnreadNotifications(response.data.unreadNotifications);
  //       console.log(unreadNotifications);
  //       setUser((prevUser) => ({
  //         ...prevUser,
  //         unreadNotifications: unreadNotifications,
  //       }));
  //     } catch (error) {
  //       console.error("Error fetching unread notifications:", error);
  //     }
  //   };

  //   fetchUnreadNotifications();
  // }, [setUnreadNotifications]);
  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const { data } = await axiosClient.get("/user1");
          setUser(data);
          setUnreadNotifications(data.unreadNotifications);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [token, setUser]);

  const handleNotificationToggle = () => {
    setNotificationOpen(!isNotificationOpen);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  if (!token || !user) {
    return <Navigate to="/home" />;
  }

  return (
    <div
      className={`bg-gradient-light dark:bg-gradient-dark h-screen w-full overflow-auto`}
    >
      <SideBar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        setUser={setUser}
        setToken={setToken}
        setBoardModalOpen={setBoardModalOpen}
        setOpenDropdown={setOpenDropdown}
      />
      <nav className="fixed  top-4 bg-opacity-70 flex items-start justify-end   rounded-[25px] z-50 right-0  ">
        <div className="px-3 py-1  lg:px-5 lg:pl-3">
          <div className="flex items-center justify-end">
            {/* right side  */}
            <div className="flex space-x-4 items-center md:space-x-6">
              <div className="flex space-x-4 items-center md:space-x-6">
                <button
                  className="text-white  py-2 px-4 rounded-full 
        bg-midnightblue text-base font-semibold hover:opacity-80
        duration-200 button hidden md:block dark:bg-indigo-500  dark:text-white"
                  onClick={() => {
                    setBoardModalOpen((state) => !state);
                  }}
                >
                  <div className="flex justify-center items-center gap-2">
                    <img className="h-3" src={plus1} alt="icon" />
                    <p className="text-base">Add New Board</p>
                  </div>
                </button>

                <button
                  className="button px-[9px] py-[9px]  text-white bg-indigo-500 rounded-full  md:hidden"
                  onClick={() => {
                    setBoardModalOpen((state) => !state);
                  }}
                >
                  <img className="h-4" src={plus} alt="icon" />
                </button>

                <div className="relative">
                  <button
                    onClick={handleNotificationToggle}
                    className="  text-midnightblue hover:opacity-80
                  duration-200 button  md:block dark:text-indigo-500  rounded-full  items-center justify-center text-xs"
                  >
                    <FontAwesomeIcon className="h-7 sm:h-7 " icon={faBell} />
                    {unreadNotifications > 0 && (
                      <span className="bg-red-500 rounded-full px-2 py-1 text-white text-xs absolute -top-1 -right-1">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  <NotificationDialog
                    isOpen={isNotificationOpen}
                    onClose={handleNotificationToggle}
                    user={user}
                  />
                </div>
              </div>

              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    onClick={handleDropdownToggle}
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded={isDropdownOpen}
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="user photo"
                      />
                    )}
                  </button>
                </div>
                <div
                  className={`${
                    isDropdownOpen ? "block" : "hidden"
                  } z-50 absolute right-0 mt-60 text-base list-none bg-white divide-y rounded shadow dark:bg-gray-700 dark:divide-gray-600`}
                  id="dropdown-user"
                >
                  <div className="px-4 py-3">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.name} &nbsp; &nbsp;
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                      {user.email}
                    </div>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/project"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Projects
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profil"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Edit Profil
                      </Link>
                    </li>
                    <li>
                      <button onClick={onLogout}>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Sign out
                        </a>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div
        className={`mt-16
      ${isOpen ? "sm:ml-60" : "sm:ml-20"}
      `}
      >
        <div className=" ">
          <div className="pl-11   flex items-start   rounded  ">
            {boardModalOpen && (
              <AddEditBoardModal
                type={boardType}
                setBoardModalOpen={setBoardModalOpen}
              />
            )}
            <main className="h-full mb-24 w-full ">
              <Outlet />
            </main>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
