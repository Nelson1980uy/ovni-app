
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";




export default function ListaUsuarios({ usuarios, onModal }) {
  const navigate = useNavigate();
  const { token } = useAuth();


const usuariosOrdenados = [...usuarios].sort((a, b) =>
  a.username.localeCompare(b.username, "es", { sensitivity: "base" })
);


// Busqueda Usuario
const [busqueda, setBusqueda] = useState("");

// Radar
const [radarActivo, setRadarActivo] = useState(false);

useEffect(() => {
  setRadarActivo(busqueda.trim().length > 0);
}, [busqueda]);

// Usuarios ordenados + filtrados (OPTIMIZADO)
const usuariosFiltrados = useMemo(() => {
  return usuarios
    ?.slice()
    .sort((a, b) =>
      a.username.localeCompare(b.username, "es", { sensitivity: "base" })
    )
    .filter((u) =>
      u.username.toLowerCase().includes(busqueda.toLowerCase())
    );
}, [usuarios, busqueda]);

// Saber si hay resultados (ping / sonido)
const hayResultados =
  busqueda.trim() !== "" && usuariosFiltrados.length > 0;


// Sonido Radar (persistente)
const sonar = useRef(null);

useEffect(() => {
  sonar.current = new Audio("/sounds/sonar.mp3");
  sonar.current.volume = 0.4;
  sonar.current.loop = true; // sonido continuo
}, []);


// Control del sonido según búsqueda
useEffect(() => {
  if (!sonar.current) return;

  if (busqueda.trim().length > 0) {
    // Si hay texto, reproducir
    sonar.current.play().catch(() => {}); // evita error si autoplay bloqueado
  } else {
    // Si no hay texto, pausar y reiniciar
    sonar.current.pause();
    sonar.current.currentTime = 0;
  }
}, [busqueda]);






  const API_URL = import.meta.env.VITE_API_URL;

  const handleVerPerfil = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al cargar perfil");
      }

      const data = await res.json();

      if (!data.perfilPublico) {
        onModal("Este perfil es privado 🔒", "error");
        return;
      }

      // ✅ RUTA CORRECTA (como antes)
      navigate(`/usuario/${id}`);
    } catch (err) {
      console.error(err);
      onModal("Error cargando perfil", "error");
    }
  };

  if (!usuarios || usuarios.length === 0) {
    return (
      <p style={{ color: "#fff", textAlign: "center" }}>
        No hay usuarios disponibles
      </p>
    );
  }








  return (
    <>
    <Link
      to="/perfil"
      className="volver-btn serpentin"
      style={{ textAlign: "center" }}
    >
      Volver
    </Link>
   <div
   
  style={{
    position: "relative",
    minHeight: "100vh",
    background: "radial-gradient(circle at center, rgba(0,240,255,0.08), #000 70%)",
    
  }}
>
  
  {/* RADAR DE FONDO */}
  <div className={`radar-bg ${radarActivo ? "activo" : ""} ${hayResultados ? "match" : ""}`}>
    <div className="radar-pulse" />
  </div>

  {/* CONTENIDO REAL */}
  <div style={{ position: "relative", zIndex: 2, padding: "2rem 1rem", height: "100%" }}>
    {/* BOTÓN VOLVER EN ESQUINA SUPERIOR DERECHA */}
  <div
    style={{
      position: "absolute", // 🔹 absoluto respecto al contenedor principal
      top: "2rem",          // 🔹 separación desde arriba
      right: "2rem",        // 🔹 separación desde la derecha
      zIndex: 10,           // 🔹 para que quede arriba de todo
    }}
  >
    
  </div>
    
    {/* BUSCADOR */}
    <div
      style={{
        maxWidth: "420px",
        margin: "0 auto 2rem",
        position: "relative",
      }}
    >
      <i
        className="bx bx-radar"
        style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#00f0ff",
          fontSize: "1.2rem",
          pointerEvents: "none",
          textShadow: "0 0 6px rgba(0,240,255,0.7)",
        }}
      />

      <input
        type="text"
        placeholder="Buscar usuario..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem 1rem 0.75rem 2.6rem",
          borderRadius: "10px",
          border: "1px solid rgba(0,240,255,0.6)",
          background: "rgba(0,0,0,0.55)",
          color: "#00f0ff",
          fontSize: "0.9rem",
          outline: "none",
          boxShadow: "0 0 12px rgba(0,240,255,0.25)",
        }}
      />
    </div>

    {/* LISTA DE USUARIOS */}
    <div
      className={`lista-usuarios ${hayResultados ? "ping-activo" : ""}`}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 150px)", // columnas fijas de 150px
        justifyContent: "center",                        // centra todo el grid
        gap: "0.5rem",                                   // espacio compacto entre tarjetas
        maxWidth: "1150px",
        margin: "0 auto",
      }}
    >
      {usuariosFiltrados.map((u) => (
        <div
          key={u._id}
          className="usuario-tarjeta serpentin"
          onClick={() => handleVerPerfil(u._id)}
          style={{
            position: "relative",
            cursor: "pointer",
            borderRadius: "14px",
            padding: "1.2rem 1rem",
            background: "linear-gradient(135deg, #0a0a2a, #000dff, #0a0a2a)",
            width: "150px",
            justifySelf: "center",
            boxShadow: "0 0 18px rgba(0,240,255,0.35)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.07)";
            e.currentTarget.style.boxShadow = "0 0 28px rgba(0,240,255,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 18px rgba(0,240,255,0.35)";
          }}
        >
          {/* TEXTO VER */}
          <p
            className="serpentin-gold-real"
            style={{
              position: "absolute",
              top: "8px",
              right: "10px",
              fontSize: "0.7rem",
              fontWeight: "bold",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            Ver
          </p>

          {/* AVATAR */}
          <div style={{ marginBottom: "0.5rem", marginTop: "1rem", position: "relative" }}>
            <img
              src={
                u.avatar?.startsWith("/uploads")
                  ? `${API_URL}${u.avatar}`
                  : `/avatars/${u.avatar || "alien1.jpg"}`
              }
              alt={u.username}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 0 12px #ffd700",
                border: "2px solid #ffd700",
              }}
            />
            <span className="serpentin-borde"></span>
          </div>

          {/* NOMBRE */}
          <p className="serpentin-gold-real" style={{ textAlign: "center" }}>
            {u.username}
          </p>
        </div>
      ))}
    </div>

    

  </div>
</div>


</>

  );
}
