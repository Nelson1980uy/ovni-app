

import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 🔒 Cargar usuario desde localStorage (BLINDADO)
  const storedUser = JSON.parse(localStorage.getItem("usuario_actual"));

  const [user, setUser] = useState(
    storedUser
      ? { ...storedUser, avatar: storedUser.avatar || "alien1.jpg" }
      : null
  );

  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔐 Login: guarda usuario + token (BLINDADO)
  const login = (userFromApi, tokenFromServer) => {
    const safeUser = {
      ...userFromApi,
      avatar: userFromApi.avatar || "alien1.jpg",
    };

    setUser(safeUser);
    setToken(tokenFromServer);

    localStorage.setItem("usuario_actual", JSON.stringify(safeUser));
    localStorage.setItem("token", tokenFromServer);
  };

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("usuario_actual");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
