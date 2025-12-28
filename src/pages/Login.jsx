import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <- nuevo

  
const API_URL = import.meta.env.VITE_API_URL;

const handleLogin = async (e) => {
  e.preventDefault();
  console.log("Login:", email, password);

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.msg);
      return;
    }

    localStorage.setItem("usuario_actual", JSON.stringify(data.user));
    navigate("/perfil");
  } catch (err) {
    console.error("Error en login:", err);
    alert("Error al iniciar sesión");
  }
};



















  return (
    <div className="registro">
      <div className="radar-circle"></div>
      <h1 className="login-title">INICIAR SESIÓN</h1>

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
            style={{ paddingRight: "3rem" }} // espacio para el icono
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
          ENTRAR
        </button>
      </form>

      <div className="form-container" style={{ marginTop: '1rem' }}>
        <button className="btn-signal" onClick={() => navigate("/registro")}>
          REGISTRARSE
        </button>
      </div>
    </div>
  );
}
