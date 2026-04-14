import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const parseLocalUser = () => {
  const storedUser = localStorage.getItem("user");
  console.log("Parsing user from localStorage:", storedUser);
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => {
    const stored = localStorage.getItem("isAuth");
    if (stored === "true") return true;
    if (stored === "false") return false;
    return false;
  });

  const [user, setUser] = useState(() => parseLocalUser());

  useEffect(() => {
    localStorage.setItem("isAuth", String(isAuth));
  }, [isAuth]);

  useEffect(() => {
    if (user === null) {
      localStorage.removeItem("user");
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);