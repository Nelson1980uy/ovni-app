import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener usuario desde localStorage
    const usuarioStorage = JSON.parse(localStorage.getItem("usuario_actual"));
    
    if (!usuarioStorage) {
      // Si no hay usuario logueado, redirige al login
      navigate("/login");
    } else {
      setUsuario(usuarioStorage);
    }
  }, [navigate]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario_actual"); // eliminar datos de sesión
    navigate("/login");
  };

  if (!usuario) return <p>Cargando...</p>; // mientras carga datos

  // Aquí retornamos el JSX principal
  return (
    <div className="perfil-container">
      <h1>Bienvenido, {usuario.username}</h1>
      <p>Email: {usuario.email}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}
