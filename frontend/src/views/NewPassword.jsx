import React from "react";
import { Link } from "react-router-dom";

function NewPassword({ email }) {
  return (
    <div className="w-[300px] py-6 flex flex-col items-center justify-center pt-4 pb-8 shadow-lg rounded-2xl bg-white bg-opacity-10">
      <img className="h-16 " src="/logo2.png" alt="logo" />
      <div className="  text-center">
        <h2 className="text-2xl font-bold mt-4 text-gray-300 mb-4">
          Check Your Email
        </h2>
        <p className=" text-gray-800 mb-4">
          A new password has been sent to your email address:{" "}
          <strong>{email}</strong>
        </p>
        <Link
          to="/login"
          className="mt-4 h-10 w-28 font-medium  inline-block bg-midnightblue text-white py-2 px-4 rounded-xl transition duration-300 hover:shadow-lg"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default NewPassword;
