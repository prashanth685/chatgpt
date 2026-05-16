import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);
  const [chats, setchats] = useState([]);
  const [selectedchat, setselectedchat] = useState(null);
  const [theme, settheme] = useState(localStorage.getItem("theme") || "light");

  const fetchUser = async () => {};

  const value = {};
  return <AppContextProvider value={value}>{children}</AppContextProvider>;
};

export const useAppContext = () => useContext(AppContext);
