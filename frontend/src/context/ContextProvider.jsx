import { createContext, useContext, useState } from "react";
const StateContext = createContext({
  currentUser: null,
  token: null,
  notifications: [],
  chefProjects: [],
  setUser: () => {},
  setToken: () => {},
  setNotifications: () => {},
  setChefProjects: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [notifications, setNotifications] = useState([]);
  const [chefProjects, setChefProjects] = useState([]); // État initial des projets

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        notifications,
        chefProjects,
        setChefProjects,
        setNotifications,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
