import React from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { createRef } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, provider } from "../firebase.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
  const [value, setValue] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      setValue(user.email);
      localStorage.setItem("email", user.email);

      // Send user data to Laravel backend for storage
      const response = await axiosClient.post("/loginwithgoogle", { user });

      if (response.status === 200) {
        // Set user and token
        setUser(response.data.user);
        setToken(response.data.token);
        setRedirect(true);
        window.location.reload();
      } else {
        console.error("Error logging in with Google:", response.data.message);
      }
    } catch (error) {
      console.error("Firebase Google login error:", error);
    }
  };

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
    <div className="requestbg flex items-center justify-center">
      <div className=" z-10  flex min-h-screen overflow-hidden justify-center items-center gap-52 ">
        <div className=" px-8 pt-4 pb-8  h-full shadow-md shadow-slate-600 bg-white bg-opacity-5  rounded-2xl flex flex-col gap-1 items-center justify-center">
          <img className="h-16" src="/logo2.png" alt="logo" />
          <p className="  mb-4 text-gray-200 font-medium flex items-center justify-center text-xl ">
            Login into your account
          </p>

          <button
            onClick={handleGoogleLogin}
            className="bg-white bg-opacity-50 h-10 flex items-center w-80 justify-center rounded-xl"
          >
            <p className="flex text-base font-normal gap-1 text-gray-500">
              <img
                className="h-7 w-7 relative overflow-hidden shrink-0 z-[2] "
                alt=""
                src="/flatcoloriconsgoogle.svg"
              />
              Login with Google
            </p>
          </button>
          <div className="m-4 self-stretch flex flex-row items-center justify-center gap-[13px]">
            <div className="h-px w-[70px] relative box-border z-[1] border-t-[1px] border-solid border-gray-200" />
            <div className="relative   font-normal  text-gray-300 text-xs z-[1]">
              or Login with Email
            </div>
            <div className="h-px w-[70px] relative box-border z-[1] border-t-[1px] border-solid border-gray-200" />
          </div>
          <form
            className="flex flex-col items-center gap-4"
            onSubmit={onSubmit}
          >
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

            <p className="text-sm text-center -mt-1 text-gray-400">
              Forgot your password?{" "}
              <Link
                to="/passwordreset"
                className="font-semibold text-gray-400 "
              >
                Reset it here
              </Link>
            </p>
            {message && (
              <div className="  text-red-700 rounded-lg   flex items-center justify-between">
                <div className="flex items-center">
                  <button onClick={() => setMessage(null)}>
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2m2 2l2 2m-2-2l-2-2m2 2l2 2m-2-2l-2-2m2 2l2 2m-2-2l-2-2"
                      />
                    </svg>
                  </button>
                  <p className="font-medium text-sm">{message}</p>
                </div>
              </div>
            )}
            <button
              style={{
                background:
                  "linear-gradient(234.84deg, #212177 27.56%, #ce3fa5)",
              }}
              className=" h-8 w-24  bg-[#212177] mb-1   text-white  items-center px-4  pb-1  justify-center font-medium  mt-4 rounded-xl  "
            >
              Login
            </button>
          </form>

          <div className="relative flex mt-1 justify-center text-gray-300 z-[1]">
            <p>
              Not registered yet?{" "}
              <Link to="/signup">
                <span className=" text-midnightblue font-semibold font-inter ">
                  Signup
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
