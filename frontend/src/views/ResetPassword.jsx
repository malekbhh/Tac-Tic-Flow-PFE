import React, { useState } from "react";
import NewPassword from "./NewPassword";
import axiosClient from "../axios-client.js";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);

  const onSubmit = async (ev) => {
    ev.preventDefault();

    if (!email) {
      setMessage("L'email est obligatoire.");
      return;
    }

    try {
      const response = await axiosClient.post("/passwordreset", {
        email: email,
      });

      if (response.data.message) {
        setMessage(response.data.message);
        // Afficher le composant NewPassword uniquement lorsque le message est "Le mot de passe a été réinitialisé avec succès."
        if (
          response.data.message ===
          "Le mot de passe a été réinitialisé avec succès. Un nouveau mot de passe a été envoyé à l'utilisateur."
        ) {
          setShowNewPasswordForm(true);
        } else {
          setShowNewPasswordForm(false);
        }
      } else {
        setMessage("L'utilisateur existe avec cette adresse email.");
      }
    } catch (err) {
      const response = err.response;
      if (response && response.status === 404) {
        setMessage(response.data.message);
      } else {
        setMessage(
          "Une erreur s'est produite. Veuillez réessayer ultérieurement."
        );
      }
    }
  };

  return (
    <div className="requestbg flex items-center justify-center">
      <div className=" z-10  flex min-h-screen overflow-hidden justify-center items-center gap-52 ">
        <div className="flex flex-col   items-center justify-center px-8 pb-8  rounded-lg shadow-md shadow-slate-600 bg-white bg-opacity-5 ">
          {showNewPasswordForm ? (
            <NewPassword email={email} />
          ) : (
            <div className="z-10 flex overflow-hidden justify-center items-center">
              <div className="pt-4 pb-4 h-full w-90 rounded-2xl flex flex-col gap-1 items-center justify-center">
                <img className="h-16" src="/logo2.png" alt="logo" />
                <form
                  className="flex flex-col items-center gap-2"
                  onSubmit={onSubmit}
                >
                  <span className=" mt-2 text-indigo-800 text-xs font-semibold mb-1 block w-full max-w-xs">
                    Forget your password?
                  </span>

                  <input
                    className="w-80 border border-gray-300 text-gray-500 rounded-xl px-5 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Entrez votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />

                  {message && (
                    <div className="text-red-500 rounded-lg flex items-center justify-between">
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
                              d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2m2 2l2 2m-2-2l-2-2"
                            />
                          </svg>
                        </button>
                        <p className="font-medium text-sm">{message}</p>
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="h-8 w-24 mt-8 bg-[#212177] mb-1 text-white items-center px-4 pb-1 justify-center font-medium rounded-xl"
                  >
                    Envoyer
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
