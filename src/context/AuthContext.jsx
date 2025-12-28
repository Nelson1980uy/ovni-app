import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("usuario_actual"))
  );

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("usuario_actual", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario_actual");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
