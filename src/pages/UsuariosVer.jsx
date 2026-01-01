import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ListaUsuarios from "../components/ListaUsuarios";
import "../styles/modal.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function UsuariosVer() {
  const { token } = useAuth();

  const [usuarios, setUsuarios] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    if (!token) return;

    const fetchUsuarios = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setModalMsg("Error al cargar los usuarios");
        setModalType("error");
        setShowModal(true);
      }
    };

    fetchUsuarios();
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1
  style={{
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #00f0ff, #000dff, #00f0ff)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    textShadow: "0 0 3px #00f0ff, 0 0 8px #000dff", // glow más sutil
    display: "inline-block",
    animation: "typing 0.8s steps(18) forwards, boom 0.5s ease-out 0.8s, glow 2.5s ease-in-out 1.3s infinite alternate",
    whiteSpace: "nowrap",
    overflow: "hidden",
    letterSpacing: "2px",
    marginBottom: "2rem",
  }}
>
  Usuarios registrados
</h1>

<style>
  {`
    /* efecto de escritura rápida */
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }

    /* efecto de boom: agrandar y achicar al aparecer */
    @keyframes boom {
      0% { transform: scale(0.7); }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }

    /* glow sutil para mantener nitidez */
    @keyframes glow {
      0% {
        text-shadow: 0 0 2px #00f0ff, 0 0 5px #000dff;
      }
      50% {
        text-shadow: 0 0 4px #00f0ff, 0 0 10px #000dff;
      }
      100% {
        text-shadow: 0 0 2px #00f0ff, 0 0 5px #000dff;
      }
    }
  `}
</style>


      {usuarios.length > 0 ? (
  <ListaUsuarios
    usuarios={usuarios}
    onModal={(msg, type = "error") => {
      setModalMsg(msg);
      setModalType(type);
      setShowModal(true);
    }}
  />
) : (
  <p
    style={{
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      background: "linear-gradient(90deg, #00f0ff, #000dff, #00f0ff)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textShadow: "0 0 2px #00f0ff, 0 0 5px #000dff", // glow sutil
      display: "inline-block",
      animation: "typingPara 0.6s steps(25) forwards, glowPara 2.5s ease-in-out 0.6s infinite alternate",
      whiteSpace: "nowrap",
      overflow: "hidden",
      letterSpacing: "1px",
      marginTop: "2rem",
    }}
  >
    No hay usuarios para mostrar
  </p>
)}

{/* Animaciones CSS */}
<style>
  {`
    @keyframes typingPara {
      from { width: 0; }
      to { width: 100%; }
    }

    @keyframes glowPara {
      0% {
        text-shadow: 0 0 2px #00f0ff, 0 0 5px #000dff;
      }
      50% {
        text-shadow: 0 0 3px #00f0ff, 0 0 8px #000dff;
      }
      100% {
        text-shadow: 0 0 2px #00f0ff, 0 0 5px #000dff;
      }
    }
  `}
</style>


      {showModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${modalType}`}>
            <h3>Atención</h3>
            <p>{modalMsg}</p>
            <button onClick={() => setShowModal(false)}>
              CERRAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
