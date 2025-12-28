import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Perfil() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const avatars = ["alien1.jpg", "alien2.jpg", "alien3.jpg"];

  // 🔒 Protección de ruta combinada
useEffect(() => {
  const token = localStorage.getItem("token");

  // Si no hay usuario en contexto o no hay token, redirige
  if (!user || !token) {
    navigate("/login");
  }
}, [user, navigate]);

if (!user) return <p>Cargando...</p>;



  // 🎭 Elegir avatar predefinido
 const elegirAvatar = async (avatarName) => {
  const token = localStorage.getItem("token");
  console.log("Token en Perfil.jsx:", token);

  if (!token) {
    alert("No hay token, inicia sesión");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/user/avatar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ avatar: avatarName })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Error actualizando avatar");
      return;
    }

    const updatedUser = { ...user, avatar: data.avatar };
    setUser(updatedUser);
    localStorage.setItem("usuario_actual", JSON.stringify(updatedUser));
  } catch (err) {
    console.error("Error avatar:", err);
    alert("Error actualizando avatar");
  }
};




  // 📤 Subir avatar personalizado
 const subirAvatar = async (file) => {
  if (!file) return;

  // ← Aquí va
  const token = localStorage.getItem("token");
  console.log("Token en Perfil.jsx:", token);
  if (!token) {
    alert("No hay token, inicia sesión");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API_URL}/api/user/avatar/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Error subiendo avatar");
      return;
    }

    const updatedUser = { ...user, avatar: data.avatar };
    setUser(updatedUser);
    localStorage.setItem("usuario_actual", JSON.stringify(updatedUser));
  } catch (err) {
    console.error("Error subiendo avatar:", err);
    alert("Error subiendo avatar");
  }
};




  // 🚪 Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="perfil-container">
  <h1>{user.username}</h1>
  <p>{user.email}</p>

  {/* AVATAR ACTUAL */}
  <img
    src={
      user.avatar && user.avatar.startsWith("/uploads")
        ? `${API_URL}${user.avatar}`
        : `/avatars/${user.avatar || "alien1.png"}`
    }
    alt="Avatar actual"
    width={120}
    className="avatar-actual"
  />

  <h3>Elegí tu avatar</h3>

  <div className="avatar-grid">
    {avatars.map((avatar) => (
      <div key={avatar} className="avatar-card">
        <img
          src={`/avatars/${avatar}`}
          alt={`Avatar ${avatar}`}
          width={80}
          className="avatar-preset"
          style={{
            border:
              user.avatar === avatar
                ? "2px solid cyan"
                : "2px solid transparent"
          }}
        />
        <button
          className="btn-signal"
          onClick={() => elegirAvatar(avatar)}
          disabled={user.avatar === avatar}
        >
          {user.avatar === avatar ? "Seleccionado" : "Elegir"}
        </button>
      </div>
    ))}
  </div>

  <h3>O subí tu propio avatar</h3>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        subirAvatar(e.target.files[0]);
      }
    }}
  />

  <button className="logout-btn" onClick={handleLogout}>
    Cerrar sesión
  </button>
</div>

  );
}
