import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useTheme } from "../hooks/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // 🔥 limpia contexto + localStorage
    navigate("/login");    // redirige
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">LA SEÑAL</div>

      <button onClick={toggleTheme} className="theme-button">
        {theme === "dark" ? "☀️ Claro" : "🌙 Oscuro"}
      </button>

      <button
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`nav-links ${open ? "show" : ""}`}>
        {/* 🔓 USUARIO NO LOGUEADO */}
        {!user && (
          <>
            <Link to="/" onClick={() => setOpen(false)}>INICIO</Link>
            <Link to="/login" onClick={() => setOpen(false)}>LOGIN</Link>
          </>
        )}

        {/* 🔒 USUARIO LOGUEADO */}
        {user && (
          <>
            <Link to="/archivo" onClick={() => setOpen(false)}>ARCHIVOS</Link>
            <Link to="/avistamientos" onClick={() => setOpen(false)}>AVISTAMIENTOS</Link>
            <Link to="/perfil" onClick={() => setOpen(false)}>PERFIL</Link>

            {/* 👽 USUARIO + AVATAR */}
            <div className="nav-user">
              <img
                src={`/avatars/${user.avatar || "alien1.png"}`}
                alt="Avatar"
                width={36}
                className="nav-avatar"
              />
              <button
                className="logout-btn"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                SALIR
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
