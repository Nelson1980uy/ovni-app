import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/modal.css";




export default function Login() {
  const { login } = useAuth(); // 🔑 login desde contexto
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState({
  visible: false,
  mensaje: "",
  tipo: "exito" // o "error"
});


  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setModal({
        visible: true,
        mensaje: data.msg || "Error al iniciar sesión",
        tipo: "error",
      });
      return;
    }

    // 🔑 Guardar sesión
    login(data.user, data.token);

    // ✅ Navegar INMEDIATO
    navigate("/perfil", { replace: true });

  } catch (err) {
    setModal({
      visible: true,
      mensaje: "Error al iniciar sesión",
      tipo: "error",
    });
  }
};



  return (
    <div className="registro">
  {/* Radar realista de fondo */}
  <div className="radar-bg">
    <div className="radar-pulse"></div>
  </div>

  <h1 className="login-title  serpentin-gold-real">INICIAR SESIÓN</h1>

  <form className="form-container" onSubmit={handleLogin}>
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
          color: "#00f0ff",
        }}
      ></i>
    </div>

    <button type="submit" className="btn-signal serpentin">
      ENTRAR
    </button>
  </form>

  <div className="form-container" style={{ marginTop: "1rem" }}>
    <button className="btn-signal serpentin" onClick={() => navigate("/registro")}>
      REGISTRARSE
    </button>
  </div>

  <div className="form-container" style={{ marginTop: "1rem" }}> 
    <button className="btn-signal serpentin" onClick={() => navigate("/")}>
      VOLVER
    </button>
  </div>

  {modal.visible && (
    <div
      className="modal-overlay"
      onClick={() => setModal(prev => ({ ...prev, visible: false }))}
    >
      <div
        className={`modal-content ${modal.tipo}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ marginBottom: "1.5rem" }}>{modal.mensaje}</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{
              padding: "0.5rem 1.4rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              background: "#000",
              color: "#fff",
            }}
            onClick={() => setModal(prev => ({ ...prev, visible: false }))}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
}
