import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useTheme } from "../hooks/ThemeContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
        <Link to="/" onClick={() => setOpen(false)}>INICIO</Link>
        <Link to="/archivo" onClick={() => setOpen(false)}>ARCHIVOS</Link>
        <Link to="/avistamientos" onClick={() => setOpen(false)}>AVISTAMIENTOS</Link>
        <Link to="/perfil" onClick={() => setOpen(false)}>PERFIL</Link>
      </div>
    </nav>
  );
}
