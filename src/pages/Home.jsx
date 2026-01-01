import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";







const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =======================
   MODAL DE TÉRMINOS
======================= */
const TermsModal = ({ termsAccepted, onCheck, onAccept }) => {
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-cartel">
        <h1 className="home-title">LA SEÑAL</h1>

        <div className="modal-text">
          <p>
            Bienvenido a <b>La Señal</b>.
            <br /><br />
            Esta plataforma funciona como un archivo comunitario.
            <br /><br />
            • +13 años<br />
            • Responsable del contenido<br />
            • Respeto obligatorio<br />
            • Prohibido contenido ilegal
            <br /><br />
            Al continuar aceptas estas condiciones.
          </p>
        </div>

        <label className="modal-check">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={onCheck}
          />
          Acepto los términos y condiciones
        </label>

        <button className="serpentin" onClick={onAccept}>
          ACTIVAR SEÑAL
        </button>
      </div>
    </div>,
    document.body
  );
};

/* =======================
          HOME
======================= */
export default function Home() {
  const navigate = useNavigate();
  const { user, token, setUser, logout } = useAuth();


  const [started, setStarted] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
 const [usuarios, setUsuarios] = useState([]); // Array de usuarios


  /* ===== VERIFICAR TÉRMINOS (BACKEND) ===== */
 const CURRENT_TERMS_VERSION = 1; // debe coincidir con el backend

useEffect(() => {
  const localAccepted = localStorage.getItem("la_senal_terms_accepted");

  // 1️⃣ Ya aceptó en este navegador → no mostrar
  if (localAccepted === "true") {
    setShowWelcomeModal(false);
    return;
  }

  // 2️⃣ No logueado → mostrar modal
  if (!token) {
    setShowWelcomeModal(true);
    return;
  }

  // 3️⃣ Logueado → consultar backend
  fetch(`${API_URL}/api/user/status`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      // Si no aceptó o la versión no coincide → mostrar modal
      if (!data.termsAccepted || data.termsVersion !== CURRENT_TERMS_VERSION) {
        setShowWelcomeModal(true);
      } else {
        // Si ya aceptó y versión coincide → marcar localStorage
        localStorage.setItem("la_senal_terms_accepted", "true");
        setShowWelcomeModal(false);
      }
    })
    .catch(() => {
      // fallback seguro
      setShowWelcomeModal(true);
    });

}, [token]);



const handleCheckboxChange = () => {
  setTermsAccepted(prev => !prev);
};



  /* ===== ACEPTAR TÉRMINOS (BACKEND) ===== */
  const handleAcceptTerms = async () => {
  if (!termsAccepted) {
    alert("Debes aceptar los términos para continuar.");
    return;
  }

  // 1️⃣ Guardar local siempre
  localStorage.setItem("la_senal_terms_accepted", "true");

  // 2️⃣ Guardar en backend solo si está logueado
  if (token) {
    try {
      await fetch(`${API_URL}/api/user/accept-terms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (e) {
      console.warn("No se pudo guardar en backend, pero local sí");
    }
  }

  // 3️⃣ Cerrar modal
  setShowWelcomeModal(false);
};







  /* ===== SONIDO ===== */
  const startExperience = () => {
    const audio = new Audio("/Electro-Drone.mp3");
    audio.volume = 0.6;
    audio.play().finally(() => setStarted(true));
  };




  return (
    <>
     <div
  className={`registro ${showWelcomeModal ? "hidden" : ""}`}
  style={{
    position: "relative",
    width: "100%",
    height: "100vh",       // ocupa toda la pantalla
    overflow: "hidden",    // oculta scroll
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box", // ⚡ evita sumar padding/margin al 100vh
    padding: "0 1rem",       // opcional, evita que texto toque los bordes
  }}
>
  {/* Radar absolutamente posicionado para no generar scroll */}
  <div
    className="radar-bg"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none", // no interfiere con clicks
      zIndex: 0,
    }}
  >
    <div className="radar-pulse"></div>
  </div>

  <h1
    className="home-title serpentin-gold-real"
    style={{ margin: "0 0 1rem 0", zIndex: 1 }}
  >
    LA SEÑAL
  </h1>

  {!started ? (
    <>
      <p
        className="home-text"
        style={{ margin: "0 0 1rem 0", zIndex: 1 }}
      >
        Esta experiencia contiene sonido ambiental.
        <br />
        Activa la señal para continuar.
      </p>
      <button
        className="btn-signal serpentin"
        onClick={startExperience}
        style={{ zIndex: 1 }}
      >
        CONTINUAR
      </button>
    </>
  ) : (
    <>
      <p className="home-text" style={{ margin: "0 0 1rem 0", zIndex: 1 }}>
        No todo lo que se observa puede explicarse.
      </p>
      <button
        className="btn-signal serpentin"
        onClick={() => navigate("/login")}
        style={{ zIndex: 1 }}
      >
        ENTRAR
      </button>
    </>
  )}
</div>


    </>
  );
}
