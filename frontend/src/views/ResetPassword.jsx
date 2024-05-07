import React, { useState } from "react";
import NewPassword from "./NewPassword";
import axiosClient from "../axios-client.js";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false); // État pour contrôler l'affichage de l'indicateur de chargement

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true); // Activer l'indicateur de chargement au début de la requête

    if (!email) {
      setMessage("L'email est obligatoire.");
      setLoading(false); // Désactiver l'indicateur de chargement en cas d'erreur

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
    } finally {
      setLoading(false); // Désactiver l'indicateur de chargement une fois que la réponse est reçue
    }
  };

  //   return (
  //     <div className="requestbg flex items-center justify-center">
  //       <div className=" z-10  flex min-h-screen overflow-hidden justify-center items-center gap-52 ">
  //         <div className="flex flex-col   items-center justify-center px-8 pb-8  rounded-lg shadow-md shadow-slate-600 bg-white bg-opacity-5 ">
  //           {showNewPasswordForm ? (
  //             <NewPassword email={email} />
  //           ) : (
  //             <div className="z-10 flex overflow-hidden justify-center items-center">
  //               <div className="pt-4 pb-4 h-full w-90 rounded-2xl flex flex-col gap-1 items-center justify-center">
  //                 <img className="h-16" src="/logo2.png" alt="logo" />
  //                 <form
  //                   className="flex flex-col items-center gap-2"
  //                   onSubmit={onSubmit}
  //                 >
  //                   <span className=" mt-2 text-indigo-800 text-xs font-semibold mb-1 block w-full max-w-xs">
  //                     Forget your password?
  //                   </span>

  //                   <input
  //                     className="w-80 border border-gray-300 text-gray-500 rounded-xl px-5 py-2 focus:border-blue-500 focus:outline-none"
  //                     placeholder="Entrez votre adresse email"
  //                     value={email}
  //                     onChange={(e) => setEmail(e.target.value)}
  //                     type="email"
  //                   />

  //                   {message && (
  //                     <div className="text-red-500 rounded-lg flex items-center justify-between">
  //                       <div className="flex items-center">
  //                         <button onClick={() => setMessage(null)}>
  //                           <svg
  //                             className="w-6 h-6 mr-2"
  //                             fill="none"
  //                             stroke="currentColor"
  //                             viewBox="0 0 24 24"
  //                             xmlns="http://www.w3.org/2000/svg"
  //                           >
  //                             <path
  //                               strokeLinecap="round"
  //                               strokeLinejoin="round"
  //                               strokeWidth="2"
  //                               d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2m2 2l2 2m-2-2l-2-2"
  //                             />
  //                           </svg>
  //                         </button>
  //                         <p className="font-medium text-sm">{message}</p>
  //                       </div>
  //                     </div>
  //                   )}
  //                   <button
  //                     type="submit"
  //                     className="h-8 w-24 mt-8 bg-[#212177] mb-1 text-white items-center px-4 pb-1 justify-center font-medium rounded-xl"
  //                   >
  //                     Envoyer
  //                   </button>
  //                 </form>
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // export default ResetPassword;

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
                    disabled={loading} // Désactiver le bouton d'envoi lors du chargement
                  >
                    {loading ? ( // Afficher l'indicateur de chargement si loading est true
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014.01 12H0c0 3.042 1.135 5.824 2.998 7.956l3.003-2.665zM12 20c1.988 0 3.822-.73 5.22-1.936l-3.003-2.665A7.96 7.96 0 0112 20zm6.002-7.956A7.963 7.963 0 0120 12h-4c0 2.367-1.012 4.496-2.634 6.005l3.636 3.218z"
                        ></path>
                      </svg>
                    ) : (
                      "Envoyer"
                    )}
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
