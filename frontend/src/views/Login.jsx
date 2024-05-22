import React from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { createRef } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import de l'icône de flèche vers la gauche
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
  const [value, setValue] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      emailRef.current.value = email;
    }
  }, []);

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("userRole", String(data.user.role));
        localStorage.setItem("ACCESS_TOKEN", data.token);
        localStorage.setItem("USER", JSON.stringify(data.user));

        const userrole = data.user.role;
        if (userrole === "admin") {
          navigate("/projects"); // Correction ici
        } else {
          console.log("trueeeee");
          navigate("/projects"); // Correction ici
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message);
        }
      });
  };
  if (redirect) {
    return <Navigate to="/projects" />;
  }

  return (
    <div className="requestbg flex items-center justify-center min-h-screen">
      <div className="z-10 flex flex-col items-center justify-center px-8 pt-4 pb-8 shadow-lg rounded-2xl bg-white bg-opacity-10">
        <img className="h-16 mx-auto" src="/logo2.png" alt="logo" />
        <h2 className="text-2xl font-bold text-gray-300 mb-4 pt-2 ">
          Login into your account
        </h2>

        {/* <div className="m-4 self-stretch flex flex-row items-center justify-center gap-2">
          <div className="h-px w-16 bg-gray-200" />
          <div className="text-gray-300 text-xs">Login with Email</div>
          <div className="h-px w-16 bg-gray-200" />
        </div> */}

        <form className="flex flex-col items-center gap-4" onSubmit={onSubmit}>
          <input
            className="shadow-md shadow-slate-600 bg-transparent rounded-xl px-4 py-3 mt-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            placeholder="Enter your email"
            ref={emailRef}
            type="email"
            autoComplete="username"
          />

          <input
            className="shadow-md shadow-slate-600 bg-transparent rounded-xl px-4 py-3 mt-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            placeholder="Password"
            ref={passwordRef}
            type="password"
            autoComplete="current-password"
          />

          <p className="text-sm text-center -mt-1 text-gray-300">
            Forgot your password?{" "}
            <Link
              to="/passwordreset"
              className="font-semibold text-white underline"
            >
              Reset it here
            </Link>
          </p>
          {message && (
            <div className="text-red-700 rounded-lg flex items-center">
              <button onClick={() => setMessage(null)} className="mr-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <p className="font-medium text-sm">{message}</p>
            </div>
          )}
          <button
            // style={{
            //   background: "linear-gradient(234.84deg, #212177 27.56%, #ce3fa5)",
            // }}
            className="h-10 w-32 bg-midnightblue  text-white flex items-center justify-center font-medium mt-4 rounded-xl transition duration-300 hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-gray-300 text-center">
          <Link to="/home" className="flex items-center justify-center">
            <FaArrowLeft className="mr-2" /> Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
