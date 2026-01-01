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
  logout();                          // elimina usuario_actual y limpia el contexto
  localStorage.removeItem("usuario_actual"); // asegura que App.jsx vea que no hay usuario
  setOpen(false);                    // cierra el menú si estaba abierto
  navigate("/");                     // redirige a Home
};


  const API_URL = import.meta.env.VITE_API_URL;

  const avatarSrc =
    user?.avatar && user.avatar.startsWith("/uploads")
      ? `${API_URL}${user.avatar}`
      : `/avatars/${user?.avatar || "alien1.jpg"}`;

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">LA SEÑAL</div>

      {/* Botón hamburguesa solo visible en móvil */}
      <button
        className="hamburger-wrapper flex flex-col items-center bg-transparent border-none serpentin md:hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
      >
        <div className={`hamburger ${open ? "open" : ""}`}>
          <span />
          <span />
          <span />
        </div>
        <span className="btn-signal mt-1 serpentin-texz">{open ? "Cerrar" : "Menu"}</span>
      </button>

      {/* Links y botones del menú */}
      <div className={`nav-links ${open ? "show" : ""}`}>
  <button className="serpentin" onClick={() => { setOpen(false); navigate("/usuarios"); }}>
    USUARIOS REGISTRADOS
  </button>

  <Link className="serpentin" to="/senal-entrante" onClick={() => setOpen(false)}>
    SEÑAL ENTRANTE
  </Link>

  <Link className="serpentin" to="/archivo" onClick={() => setOpen(false)}>
    ARCHIVOS
  </Link>

  <Link className="serpentin" to="/avistamientos" onClick={() => setOpen(false)}>
    AVISTAMIENTOS
  </Link>

  <Link className="serpentin" to="/perfil" onClick={() => setOpen(false)}>
    PERFIL
  </Link>

  {user && ( 
  <div className="nav-user">
    {/* Contenedor serpentin del avatar */}
    <div className="avatar-serpentin">
      <img src={avatarSrc} alt="Avatar" className="nav-avatar avatar-actual" />
      {/* Borde animado serpentin */}
      <div className="serpentin-border" />
    </div>

    <button className="serpentin" onClick={() => { setOpen(false); handleLogout(); }}>
      SALIR
    </button>
  </div>
)}

</div>

    </nav>
  );
}
