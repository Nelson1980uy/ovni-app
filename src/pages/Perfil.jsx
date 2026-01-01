import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Perfil() {
  const { user, token, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [modalTerminos, setModalTerminos] = useState(false);

  const abrirTerminos = () => setModalTerminos(true);
  const cerrarTerminos = () => setModalTerminos(false);
  const DEFAULT_AVATAR = "alien1.jpg";

  const avatars = [
  "alien1.jpg",
  "alien2.jpg",
  "alien3.jpg",
  "alien4.jpg",
  "alien5.jpg",
  "alien6.jpg",
  "alien7.jpg",
  "alien8.jpg"
];


 useEffect(() => {
  // 🟡 Esperar a que el contexto cargue
  if (user === undefined) return;

  // 🔴 Si no hay sesión válida, redirigir
  if (!user || !token) {
    navigate("/login", { replace: true });
  }
}, [user, token, navigate]);


useEffect(() => {
  if (!user || !token) return;

  // 🟢 Si el usuario no tiene avatar, asignamos el default
  if (!user.avatar) {
    setUser(prev => {
      const updated = { ...prev, avatar: DEFAULT_AVATAR };
      localStorage.setItem("usuario_actual", JSON.stringify(updated));
      return updated;
    });
  }
}, [user, token, setUser]);


// biografía editable
const [bio, setBio] = useState("");
const [saving, setSaving] = useState(false);

// sincronizar bio cuando user se cargue
useEffect(() => {
  if (user?.bio) setBio(user.bio);
}, [user]);

const handleSaveBio = async () => {
  if (!bio) return alert("La biografía no puede estar vacía");

  setSaving(true);
  try {
    const res = await fetch(`${API_URL}/api/user/bio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio }),
    });

    const data = await res.json(); // ✅ solo una vez

    if (!res.ok) {
      throw new Error(data.msg || "Error actualizando biografía");
    }

    // actualizar estado global y localStorage
    setUser(prev => {
      const updated = { ...prev, bio: data.bio };
      localStorage.setItem("usuario_actual", JSON.stringify(updated));
      return updated;
    });

    alert("Biografía guardada correctamente");

  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    setSaving(false);
  }
};


/*Actualizar Usuario*/
const actualizarUsuario = async (campo, valor) => {
  try {
    // Actualizamos estado local
    setUser(prev => {
      const updated = { ...prev, [campo]: valor };
      localStorage.setItem("usuario_actual", JSON.stringify(updated));
      return updated;
    });

    // Enviamos al backend
    const res = await fetch(`${API_URL}/api/user/${campo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [campo]: valor }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error actualizando usuario");

    console.log(`${campo} actualizado correctamente`, data);
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    alert(err.message);
  }
};




// Elegir avatar predeterminado

const elegirAvatar = async (avatarName) => {
  try {
    const res = await fetch(`${API_URL}/api/user/avatar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar: avatarName }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error actualizando avatar");

    setUser(prev => {
      const updated = { ...prev, avatar: data.avatar };
      localStorage.setItem("usuario_actual", JSON.stringify(updated));
      return updated;
    });
  } catch (err) {
    console.error("Error avatar:", err);
    alert(err.message);
  }
};


  // Subir avatar personalizado
  const subirAvatar = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`${API_URL}/api/user/avatar/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // NO Content-Type
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error subiendo avatar");

      const updatedUser = { ...user, avatar: data.avatar };
      setUser(updatedUser);
      localStorage.setItem("usuario_actual", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error subiendo avatar:", err);
      alert(err.message);
    }
  };

  // Toggle de privacidad (público/privado)
  const togglePrivacidad = async () => {
  try {
    const res = await fetch(`${API_URL}/api/user/privacidad`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // Opcional: solo si querés forzar true/false
      // body: JSON.stringify({ perfilPublico: !user.perfilPublico }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error actualizando privacidad");

    // Actualiza estado local y storage de forma segura
    setUser(prev => {
      const updated = { ...prev, perfilPublico: data.perfilPublico };
      localStorage.setItem("usuario_actual", JSON.stringify(updated));
      return updated;
    });

    // ✅ Mostrar modal de éxito
    setModalMsg("Privacidad actualizada correctamente");
    setModalType("exito");
    setShowModal(true);

  } catch (err) {
    console.error("Error actualizando privacidad:", err);

    // ✅ Mostrar modal de error en vez de alert
    setModalMsg(err.message);
    setModalType("error");
    setShowModal(true);
  }
};



  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <div className="perfil-container">
  {/* CONTENEDOR ANIMADO PARA ENCABEZADO */}
<div
  className="perfil-header-container"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "2rem",
    background: "linear-gradient(270deg, #6b73ff, #000dff, #6b73ff)",
    backgroundSize: "600% 600%",
    animation: "gradientMove 8s ease infinite",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
  }}
>
  {/* BLOQUE IZQUIERDO: NOMBRE Y EMAIL */}
  <div className="serpentin-gold-real" style={{ flex: "1" }}>
    <h1>{user.username}</h1>
    <p>{user.email}</p>
  </div>

  {/* BLOQUE DERECHO: AVATAR Y BOTÓN */}
  <div className="perfil-avatar serpentin" style={{ textAlign: "center", flex: "1" }}>
    <img
  src={
    user.avatar && user.avatar.startsWith("/uploads")
      ? `${API_URL}${user.avatar}`
      : `/avatars/${user.avatar || "alien1.jpg"}`
  }
  alt="Avatar actual"
  width={120}
  className="avatar-actual"
  style={{ borderRadius: "50%", border: "px solid cyan" }}
/>

    <label
      htmlFor="avatarUpload"
      className="btn-upload serpentin"
      style={{ marginTop: "0.5rem", display: "block" }}
    >
      Subir Avatar
    </label>
    <input
      id="avatarUpload"
      type="file"
      accept="image/*"
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          subirAvatar(e.target.files[0]);
        }
      }}
      style={{ display: "none" }}
    />
  </div>
</div>

{/* ANIMACIÓN DEL GRADIENT */}
<style>
{`
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`}
</style>


 <div
  className="avatar-grid-container"
  style={{
    display: "flex",
    flexDirection: "row",      // lado a lado en desktop
    flexWrap: "wrap",          // para que se adapten en móviles
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1.5rem",
    borderRadius: "12px",
    margin: "0 auto 2rem auto",
    width: "100%",
    maxWidth: "1440px",
    background: "linear-gradient(270deg, #6b73ff, #000dff, #6b73ff)",
    backgroundSize: "600% 600%",
    animation: "gradientMove 8s ease infinite",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  }}
>
  {/* BLOQUE IZQUIERDO: Facción */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      color: "#fff",
      flex: "1 1 280px",        // flexible, mínimo 280px
      marginRight: "2rem",
      marginBottom: "1.5rem",   // espacio en móviles
    }}
  >
    <label htmlFor="faccion" style={{ marginBottom: "0.3rem", fontWeight: "bold" }}>
  Facción:
</label>
<select
  id="faccion"
  value={user.faccion || ""}
  onChange={(e) => actualizarUsuario("faccion", e.target.value)}
  className="select-serpentin"
>
  <option value="">Desconocida</option>
  <option value="Anunnakis">Anunnakis</option>
  <option value="Greys">Greys</option>
  <option value="Reptilianos">Reptilianos</option>
  <option value="Plejadianos">Plejadianos</option>
  <option value="Sirianos">Sirianos</option>
  <option value="Orionitas">Orionitas</option>
  <option value="Terrícolas">Terrícolas</option>
</select>

    <button
      className="btn-signal"
      onClick={() => actualizarUsuario("faccion", user.faccion)}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        border: "2px solid cyan",
        background: "#000dff",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        marginBottom: "1rem",
      }}
    >
      Guardar Facción
    </button>

    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p
        style={{
          margin: "0 0 0.5rem 0",
          fontWeight: "bold",
          padding: "0.3rem 0.8rem",
          borderRadius: "8px",
          background: "linear-gradient(90deg, #000dff, #6b73ff)",
          color: "#fff",
          textAlign: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          display: "inline-block",
        }}
      >
        Facción seleccionada: {user.faccion || "Desconocida"}
      </p>
      <img
        src={`/facciones/${
          user.faccion
            ? user.faccion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            : "desconocida"
        }.png`}
        alt={user.faccion || "Desconocida"}
        style={{
          width: "120px",
          height: "120px",
          objectFit: "contain",
          borderRadius: "12px",
          border: "2px solid cyan",
        }}
      />
    </div>
  </div>

  {/* BLOQUE DERECHO: Grid de Avatares */}
  <div
    className="avatar-grid"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
      gap: "1rem",
      justifyItems: "center",
      alignItems: "center",
      flex: "2 1 300px",
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    {avatars.map((avatar) => (
      <div
        key={avatar}
        className="avatar-card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <img
          src={`/avatars/${avatar}`}
          alt={`Avatar ${avatar}`}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: user.avatar === avatar ? "2px solid cyan" : "2px solid transparent",
            objectFit: "cover",
            marginBottom: "0.5rem",
            transition: "0.2s",
          }}
        />
        <button
          className="btn-signal"
          onClick={() => actualizarUsuario("avatar", avatar)}
          disabled={user.avatar === avatar}
          style={{
            width: "100%",
            padding: "0.4rem 0.5rem",
            borderRadius: "8px",
            border: "2px solid cyan",
            background: "#000dff",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {user.avatar === avatar ? "Seleccionado" : "Elegir"}
        </button>
      </div>
    ))}
  </div>
</div>


{/* ANIMACIÓN DEL GRADIENT */}
<style>
  {`
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `}
</style>





{/* CONTENEDOR ANIMADO PARA BIOGRAFÍA */}
<div
  className="bio-container"
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "2rem",
    width: "100%",                 // ocupa todo el ancho como el encabezado
    background: "linear-gradient(270deg, #6b73ff, #000dff, #6b73ff)",
    backgroundSize: "600% 600%",
    animation: "gradientMove 8s ease infinite",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
  }}
>
  <h3 style={{ marginBottom: "1rem", color: "#fff" }}>Biografía</h3>

  <textarea
    id="bio"
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    placeholder="Escribe tu biografía..."
    style={{
      width: "100%",       // ocupa todo el ancho del contenedor
      height: "180px",     // más alto para mayor comodidad
      padding: "0.75rem",
      borderRadius: "8px",
      border: "1px solid #444",
      background: "rgba(0,0,0,0.1)",
      color: "#fff",
      resize: "vertical",
      marginBottom: "1rem",
      transition: "0.3s",
      fontSize: "1rem"
    }}
  />

  <button
    onClick={handleSaveBio}
    disabled={saving}
    className="btn-signal"
    style={{
      width: "20%",       // ocupa todo el ancho del contenedor
      padding: "0.75rem",
      fontSize: "1rem",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "0.3s",
      background: saving ? "gray" : "cyan",
      color: saving ? "#ddd" : "#000",
      fontWeight: "bold"
    }}
  >
    {saving ? "Guardando..." : "Guardar biografía"}
  </button>

  <p
    style={{
      marginTop: "1rem",
      color: "#fff",
      textAlign: "center",
      fontStyle: "italic"
    }}
  >
    Biografía actual: {user.bio || "Este usuario no ha agregado información"}
  </p>
</div>

{/* ANIMACIÓN DEL GRADIENT */}
<style>
{`
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`}
</style>




<div
  className="perfil-info-extra"
  style={{
    padding: "1rem",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    marginTop: "1.5rem"
  }}
>
  <p><strong>Fecha de registro:</strong> {user.fechaRegistro || "12/05/2025"}</p>
  <p><strong>Tipo de usuario:</strong> {user.tipo || "Estándar"}</p>
  <p><strong>Avatares elegidos:</strong> {user.avatarsElegidos || avatars.length}</p>
</div>

<div
  className="perfil-terms"
  style={{
    marginTop: "1.5rem",
    padding: "1rem",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)"
  }}
>
  <p>Has aceptado nuestros <strong>Términos y Condiciones</strong>.</p>
  <button
    className="btn-signal"
    onClick={() => abrirTerminos()} // Función que muestra modal o popup con términos
  >
    Ver términos completos
  </button>
</div>

<div className="perfil-privacy" style={{ marginTop: "1rem", padding: "1rem", borderRadius: "10px", background: "rgba(255,255,255,0.05)" }}>
  <p>
    <strong>Perfil público:</strong> {user.perfilPublico ? "Sí ✅ Tu perfil es visible para otros" : "No 🔒 Tu perfil está oculto"}
  </p>
  <label className="switch">
    <input type="checkbox" checked={user.perfilPublico} onChange={togglePrivacidad} />
    <span className="slider round"></span>
  </label>
</div>



{modalTerminos && (
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
    onClick={cerrarTerminos} // Cierra modal al hacer click afuera
  >
    <div
      className="modal-content"
      style={{
        background: "#111",
        padding: "2rem",
        borderRadius: "12px",
        maxWidth: "500px",
        width: "90%",
        color: "#fff",
        position: "relative"
      }}
      onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer click dentro
    >
      <h2 style={{ marginBottom: "1rem" }}>Términos y Condiciones</h2>
      <p>
        Bienvenido a <b>La Señal</b>.<br /><br />
        Esta plataforma funciona como un archivo comunitario.<br /><br />
        • +13 años<br />
        • Responsable del contenido<br />
        • Respeto obligatorio<br />
        • Prohibido contenido ilegal
      </p>
      <button
        className="btn-signal"
        style={{ marginTop: "1rem" }}
        onClick={cerrarTerminos}
      >
        Cerrar
      </button>
    </div>
  </div>
)}




  
</div>

  );
}
