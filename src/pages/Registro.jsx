import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/modal.css";



export default function Registro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <- nuevo
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const particles = useRef([]);
  const [modal, setModal] = useState({ visible: false, mensaje: "", tipo: "" });




  


  // Audio
  useEffect(() => {
    audioRef.current = new Audio("/CyberStreets.mp3");
    audioRef.current.volume = 0.6;
    audioRef.current.loop = true;
    audioRef.current.play().catch(() => {});
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Partículas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const numParticles = 200;
    particles.current = Array.from({ length: numParticles }, () => ({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: Math.random() * width,
      size: Math.random() * 2 + 1
    }));

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width/2, height/2);
      particles.current.forEach(p => {
        p.z -= 6;
        if (p.z <= 0) {
          p.z = width;
          p.x = (Math.random() - 0.5) * width;
          p.y = (Math.random() - 0.5) * height;
        }
        const k = 128 / p.z;
        const px = p.x * k;
        const py = p.y * k;
        const size = p.size * k;
        ctx.fillStyle = "#00f0ff";
        ctx.fillRect(px, py, size, size);
      });
      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate();
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 /* Registro */
const handleRegistro = async (e) => {
  e.preventDefault();

  const API_URL = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    // Manejar caso donde el backend devuelva error 500 sin JSON
    let data;
    try {
      data = await response.json();
    } catch {
      data = { msg: "Error interno del servidor" };
    }

    // Si hubo error
    if (!response.ok) {
      setModal({ visible: true, mensaje: data.msg, tipo: "error" });
      return;
    }

    // Registro exitoso
    setModal({ visible: true, mensaje: "Usuario registrado correctamente", tipo: "exito" });

    // Redirigir a login después de 2 segundos
    setTimeout(() => {
      setModal(prev => ({ ...prev, visible: false }));
      navigate("/login");
    }, 7000);

  } catch (err) {
    // Error de fetch u otro error inesperado
    setModal({ visible: true, mensaje: "Error al registrar usuario", tipo: "error" });
    console.error("Error en registro:", err);
  }
};





















  return (
    <div className="registro">
      <canvas ref={canvasRef} className="wormhole-canvas"></canvas>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px" }}>
        <h1 className="login-title serpentin-gold-real">REGISTRARSE</h1>

        <form className="form-container" onSubmit={handleRegistro}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: "3rem" }}
            />
            <i
              className={`bx ${showPassword ? "bx-show" : "bx-hide"} bx-sm`}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#00f0ff"
              }}
            ></i>
          </div>
          <button type="submit" className="btn-signal serpentin">
            REGISTRARSE
          </button>
        </form>

        <div className="form-container" style={{ marginTop: "1rem" }}>
          <button className="btn-signal serpentin" onClick={() => navigate("/login")}>
            VOLVER AL LOGIN
          </button>
        </div>
      </div>

      {modal.visible && (
  <div
    className="modal-overlay"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}
    onClick={() => setModal({ ...modal, visible: false })}
  >
    <div
      className="modal-content"
      style={{
        background: modal.tipo === "exito" ? "#0f0f5f" : "#5f0f0f",
        padding: "2rem",
        borderRadius: "12px",
        maxWidth: "400px",
        width: "90%",
        color: "#fff",
        textAlign: "center",
        position: "relative"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>{modal.tipo === "exito" ? "✅ Éxito" : "❌ Error"}</h2>
      <p>{modal.mensaje}</p>
      <button
        className="btn-signal"
        style={{ marginTop: "1rem" }}
        onClick={() => setModal({ ...modal, visible: false })}
      >
        Cerrar
      </button>
    </div>
  </div>
)}



    </div>
  );
}
