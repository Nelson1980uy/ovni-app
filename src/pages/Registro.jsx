import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <- nuevo
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const particles = useRef([]);



  


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

  
const handleRegistro = async (e) => {
  e.preventDefault();

  // Muestra en consola los datos (para debugging)
  console.log("Registro:", username, email, password);

  const API_URL = import.meta.env.VITE_API_URL; // ← Aquí tomamos la variable de entorno

  try {
    // Enviar datos al backend
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      // Si hay error (correo duplicado, etc.)
      alert(data.msg);
      return;
    }

    // Registro exitoso
    alert("Usuario registrado correctamente");
    navigate("/login");
  } catch (err) {
    console.error("Error en registro:", err);
    alert("Error al registrar usuario");
  }
};


















  return (
    <div className="registro">
      <canvas ref={canvasRef} className="wormhole-canvas"></canvas>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px" }}>
        <h1 className="login-title">REGISTRARSE</h1>

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
          <button type="submit" className="btn-signal">
            REGISTRARSE
          </button>
        </form>

        <div className="form-container" style={{ marginTop: "1rem" }}>
          <button className="btn-signal" onClick={() => navigate("/login")}>
            VOLVER AL LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
