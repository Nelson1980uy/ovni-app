import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  const startExperience = () => {
    const audio = new Audio("/Electro-Drone.mp3");
    audio.volume = 0.6;
    audio.currentTime = 0;
    audio.play().then(() => setStarted(true)).catch(() => setStarted(true));
  };

  if (!started) {
    return (
      <div className="registro">
        <div className="radar-circle"></div>
        <h1 className="home-title">LA SEÑAL</h1>
        <p className="home-text">
          Esta experiencia contiene sonido ambiental.
          <br />
          Activa la señal para continuar.
        </p>
        <div className="form-container">
          <button className="btn-signal" onClick={startExperience}>
            CONTINUAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registro">
      <div className="radar-circle"></div>
      <h1 className="home-title">LA SEÑAL</h1>
      <p className="home-text">
        No todo lo que se observa puede explicarse.
        <br />
        Aquí se registran testimonios, señales y archivos que desafían lo conocido.
      </p>
      <div className="form-container">
        <button className="btn-signal" onClick={() => navigate("/login")}>
          ENTRAR
        </button>
      </div>
    </div>
  );
}
