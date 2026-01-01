import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/modal.css"; // tu modal CSS
import { useNavigate } from "react-router-dom";



export default function UsuarioPublico() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/${id}`, { // ✅ ruta correcta
          headers: { Authorization: `Bearer ${token}` },
        });

        // Evitar parsear JSON si la respuesta es un error
        if (!res.ok) {
          let errorMsg = "Error cargando perfil";
          try {
            const data = await res.json();
            errorMsg = data.msg || errorMsg;
          } catch {
            // Si no es JSON, mantener mensaje por defecto
          }

          setError(errorMsg);
          setOpenModal(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message);
        setOpenModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id, token, API_URL]);

  if (loading) return <p style={{ color: "#fff" }}>Cargando perfil...</p>;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", background: "#0a0a2a" }}>
  {/* Fondo estrellas */}
  <div style={{
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    background: "radial-gradient(circle, #fff 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    animation: "starsTwinkle 3s infinite alternate",
    zIndex: 0
  }}></div>

  {/* OVNI flotante */}
  <img
    src="/imagenes/ovni.png"
    alt="ovni"
    style={{
      position: "absolute",
      width: "400px",
      height: "auto",
      filter: "drop-shadow(0 0 25px cyan)",
      zIndex: 1,
      animation: "ovniChaos 14s infinite alternate, ovniLights 0.5s infinite alternate"
    }}
  />

  {/* Botón Volver fijo */}
  <div style={{ position: "absolute", top: "1.5rem", right: "2rem", zIndex: 10 }}>
    <button onClick={() => navigate("/usuarios")} className="serpentin">
      Volver
    </button>
  </div>

  {/* Contenedor scrollable */}
  <div style={{
    position: "relative",
    zIndex: 2,
    padding: "2rem 1rem",
    height: "100vh",
    overflowY: "auto",
  }}>
    {usuario && (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "5vh" }}>
        <div className="usuario-card-futurista serpentin" style={{
          background: "linear-gradient(135deg, #0a0a2a, #000dff, #0a0a2a)",
          borderRadius: "16px",
          padding: "1rem 2rem",
          maxWidth: "500px",
          width: "100%",
          height: "auto",
          boxShadow: "0 8px 40px rgba(0, 0, 255, 0.6)",
          textAlign: "center",
          overflow: "visible",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          animation: "cardFadeIn 1s ease forwards",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06)";
          e.currentTarget.style.boxShadow = "0 12px 50px rgba(0, 0, 255, 0.8)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 40px rgba(0, 0, 255, 0.6)";
        }}>
          
          {/* Nombre usuario */}
          <h1 className="serpentin-gold-real" style={{ margin: "0 auto 2rem auto" }}>
            {usuario.username}
          </h1>

          {/* Avatar */}
          <div className="serpentin" style={{ position: "relative", marginBottom: "1rem" }}>
            <img
              src={usuario.avatar?.startsWith("/uploads")
                ? `${API_URL}${usuario.avatar}`
                : `/avatars/${usuario.avatar || "alien1.jpg"}`
              }
              alt={usuario.username}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #f5d76e",
                boxShadow: "0 0 12px #f5d76e",
                transition: "all 0.3s ease",
              }}
            />
            <span className="serpentin-borde"></span>
          </div>

          {/* Información usuario */}
          <div style={{
            marginTop: "0.5rem",
            padding: "1.4rem 1.6rem",
            borderRadius: "14px",
            textAlign: "left",
            lineHeight: "1.7",
            color: "#e0e0e0",
            fontWeight: "500",
            background: `linear-gradient(135deg, rgba(180,180,180,0.9) 0%, rgba(220,220,220,0.85) 25%, rgba(150,150,150,0.9) 50%, rgba(200,200,200,0.85) 75%, rgba(180,180,180,0.9) 100%)`,
            backgroundSize: "400% 400%",
            animation: "aceroBrillante 15s ease infinite",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 0 8px rgba(255,255,255,0.05), inset 0 0 12px rgba(255,255,255,0.03)"
          }}>
            <p>
  <strong
    style={{
      background: "linear-gradient(90deg, #00f0ff, #000dff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    }}
  >
    Email:
  </strong>{" "}
  <span style={{ color: "#000000" }}>{usuario.email}</span>
</p>

<p>
  <strong
    style={{
      background: "linear-gradient(90deg, #00f0ff, #000dff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    }}
  >
    Perfil público:
  </strong>{" "}
  <span style={{ color: "#000000" }}>
    {usuario.perfilPublico ? "Sí" : "No"}
  </span>
</p>

<p>
  <strong
    style={{
      background: "linear-gradient(90deg, #00f0ff, #000dff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    }}
  >
    Tipo:
  </strong>{" "}
  <span style={{ color: "#000000" }}>
    {usuario.tipo || "Desconocido"}
  </span>
</p>

<p>
  <strong
    style={{
      background: "linear-gradient(90deg, #00f0ff, #000dff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    }}
  >
    Avatares elegidos:
  </strong>{" "}
  <span style={{ color: "#000000" }}>
    {usuario.avatarsElegidos || "Ninguno"}
  </span>
</p>

<p>
  <strong
    style={{
      background: "linear-gradient(90deg, #00f0ff, #000dff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    }}
  >
    Términos aceptados:
  </strong>{" "}
  <span style={{ color: "#000000" }}>
    {usuario.terminosAceptados ? "Sí" : "No"}
  </span>
</p>

<p>
  <strong
    style={{
      background: "linear-gradient(90deg, #00f0ff, #000dff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    }}
  >
    Registrado el:
  </strong>{" "}
  <span style={{ color: "#000000" }}>
    {new Date(usuario.createdAt).toLocaleDateString()}
  </span>
</p>

<p>
  <strong
    style={{
      background: "linear-gradient(90deg, #00f0ff, #000dff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    }}
  >
    Último acceso:
  </strong>{" "}
  <span style={{ color: "#000000" }}>
    {usuario.lastLogin
      ? new Date(usuario.lastLogin).toLocaleString()
      : "Desconocido"}
  </span>
</p>

<p>
  <strong
    style={{
      background: "linear-gradient(90deg, #00f0ff, #000dff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    }}
  >
    Amigos:
  </strong>{" "}
  <span style={{ color: "#000000" }}>
    {usuario.amigos?.length || 0}
  </span>
</p>

<p>
  <strong
    style={{
      background: "linear-gradient(90deg, #00f0ff, #000dff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    }}
  >
    Biografía:
  </strong>{" "}
  <span style={{ color: "#000000" }}>
    {usuario.bio || "Este usuario no ha agregado información"}
  </span>
</p>

          </div>

          {/* Facción */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1.5rem",
            padding: "1.2rem 1.6rem",
            borderRadius: "14px",
            textAlign: "center",
            background: "linear-gradient(135deg, #000000, #222222, #f5d76e33, #222222)",
            border: "1px solid rgba(245, 215, 110, 0.5)",
            boxShadow: "0 0 20px rgba(245, 215, 110, 0.3), inset 0 0 15px rgba(245, 215, 110, 0.1)",
            backgroundSize: "200% 200%",
            animation: "faccionGradientMove 10s ease infinite",
          }}>
            <p style={{
              margin: 0,
              fontWeight: "bold",
              fontSize: "1rem",
              background: "linear-gradient(90deg, #00ff7f, #32cd32, #00fa9a, #7fff00)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "auroraText 4s ease infinite"
            }}>Facción:</p>
            <span style={{ color: "#ff4d4d", fontWeight: "bold", fontSize: "1rem" }}>{usuario.faccion || "Desconocida"}</span>
            <div style={{ position: "relative" }}>
              <img
                src={`/facciones/${(usuario.faccion || "desconocida").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}.png`}
                alt={usuario.faccion || "Desconocida"}
                style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "contain", transition: "transform 0.3s ease" }}
              />
              <span style={{
                position: "absolute",
                top: "-4px",
                left: "-4px",
                width: "calc(100% + 8px)",
                height: "calc(100% + 8px)",
                borderRadius: "14px",
                border: "2px solid #f5d76e",
                boxShadow: "0 0 12px #f5d76e, 0 0 20px #f5d76e inset",
                pointerEvents: "none",
                animation: "serpentinGlow 1.5s ease-in-out infinite alternate"
              }}></span>
            </div>
          </div>

        </div>
      </div>
    )}
  </div>

  {/* Animaciones CSS */}
  <style>{`
    @keyframes cardFadeIn { 0% { opacity:0; transform:scale(0.95);} 100% { opacity:1; transform:scale(1);} }
    @keyframes starsTwinkle { 0% {opacity:0.3;} 50% {opacity:0.8;} 100% {opacity:0.3;} }
    @keyframes ovniChaos { 0% {transform:translate(0vw,0vh) rotate(0deg);} 10% {transform:translate(25vw,15vh) rotate(45deg);} 20% {transform:translate(60vw,5vh) rotate(-90deg);} 35% {transform:translate(70vw,40vh) rotate(180deg);} 50% {transform:translate(40vw,55vh) rotate(-120deg);} 65% {transform:translate(10vw,35vh) rotate(200deg);} 80% {transform:translate(50vw,65vh) rotate(-200deg);} 90% {transform:translate(20vw,60vh) rotate(150deg);} 100% {transform:translate(0vw,0vh) rotate(0deg);} }
    @keyframes ovniLights { 0%{filter:drop-shadow(0 0 15px red);} 20%{filter:drop-shadow(0 0 15px green);} 40%{filter:drop-shadow(0 0 15px blue);} 60%{filter:drop-shadow(0 0 15px yellow);} 80%{filter:drop-shadow(0 0 15px magenta);} 100%{filter:drop-shadow(0 0 15px red);} }
    @keyframes aceroBrillante { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
    @keyframes faccionGradientMove { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
    @keyframes auroraText { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
    @keyframes serpentinGlow { 0%{box-shadow:0 0 8px #f5d76e,0 0 15px #f5d76e inset;} 50%{box-shadow:0 0 14px #f5d76e,0 0 25px #f5d76e inset;} 100%{box-shadow:0 0 8px #f5d76e,0 0 15px #f5d76e inset;} }
  `}</style>
</div>

  );
}
