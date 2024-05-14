import React, { useEffect, useState } from "react";
import UsersAdmin from "./UserAdmin/UsersAdmin.jsx";

function User() {
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    // Retrieve the user role from localStorage
    const storedUserRole = localStorage.getItem("userRole");
    setLoading(false);
    setUserRole(storedUserRole);
  }, []);

  return (
    <div className=" justify-center w-[90%] h-full   dark:text-white">
      {loading ? (
        <p>Loading user role...</p>
      ) : userRole === "admin" ? (
        <UsersAdmin />
      ) : (
        <></>
      )}
    </div>
  );
}

export default User;
