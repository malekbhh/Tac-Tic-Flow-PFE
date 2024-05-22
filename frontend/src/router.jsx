import { createBrowserRouter, useNavigate } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import User from "./views/User";
import Home from "./views/Home.jsx";

import ResetPassword from "./views/ResetPassword.jsx";
import Projects from "./components/Projects.jsx";
import UserAdmin from "./views/UserAdmin/UsersAdmin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProjectDetails from "./components/ProjectDetails.jsx";
import Profile from "./components/Profile.jsx";
import Messanger from "./Pages/Chat/Messanger.jsx";
import Progress from "./views/Progress/Progress.jsx";
import Calendar from "./views/Calendar/Calendar.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/progress",
        element: <Progress />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/chat",
        element: <Messanger />,
        children: [
          {
            path: ":id",
            element: <Messanger />,
          },
        ],
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/calendar",
        element: <Calendar />,
      },
      {
        path: "/ProjectDetails",
        element: <ProjectDetails />,
      },
      {
        path: "/userAdmin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserAdmin />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/passwordreset",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },

  // {
  //   path: "dash",
  //   element: <Dashboardd1 />,
  // },
]);

export default router;
