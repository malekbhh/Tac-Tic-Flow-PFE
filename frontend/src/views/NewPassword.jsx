import React from "react";
import { Link } from "react-router-dom";
function NewPassword({ email }) {
  return (
    <div className="flex flex-col px-8 pt-4 w-90 rounded-2xl items-center justify-center">
      <div className="z-10 flex overflow-hidden justify-center items-center">
        <div className="pt-4 pb-4 h-full w-90 rounded-2xl flex flex-col gap-1 items-center justify-center">
          <img className="h-16" src="/logo2.png" alt="logo" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-blue-950 mt-2 font-semibold">
              Veuillez vérifier votre e-mail pour le nouveau mot de passe.
            </p>
            <span className=" text-blue-950 text-xs font-semibold mb-2 block w-full max-w-xs">
              Un nouveau mot de passe a été envoyé à votre adresse e-mail :{" "}
              {email}
            </span>
            <Link
              to="/login"
              className="h-8 w-24 pb-1 mt-8 bg-[#212177]  text-white flex items-center justify-center font-medium rounded-xl"
            >
              Login
            </Link>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}

export default NewPassword;
