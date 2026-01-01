import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./SenalEntrante.css";

export default function SenalEntrante() {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

useEffect(() => {
  if (!token) return;

  const fetchRequests = async () => {
  try {
    const res = await fetch(`${API_URL}/api/access/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const data = await res.json();
    setRequests(data);
    setLoading(false);
  } catch (err) {
    console.error("Error cargando señales:", err);
    setLoading(false);
  }
};


  fetchRequests();
}, [token, API_URL]);




  if (loading) return <p className="loading">📡 Escaneando señales entrantes...</p>;

  return (
    <div className="senal-container">
      <h1>🛸 Señales Entrantes</h1>

      {requests.length === 0 ? (
        <p className="no-signals">No hay señales nuevas</p>
      ) : (
        <ul className="signal-list">
          {requests.map(req => (
            <li key={req._id} className="signal-card">
              <p>
                <strong>{req.from.username}</strong> envió una señal
              </p>

              <div className="signal-actions">
                <button className="btn-accept">Aceptar</button>
                <button className="btn-reject">Rechazar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
