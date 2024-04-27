import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
function GuestLayout() {
  const { user, token } = useStateContext();

  if (token) {
    return <Navigate to="/user" />;
  }

  return (
    <div
      className="w-full"
      style={{
        background: "linear-gradient(234.84deg, #212177 27.56%, #ce3fa5)",
      }}
    >
      <Outlet />
    </div>
  );
}

export default GuestLayout;
