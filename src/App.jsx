import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Archivo from "./pages/Archivo";
import Avistamientos from "./pages/Avistamientos";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  const usuario = localStorage.getItem("usuario_actual");

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: "64px" }}>
        <Routes>

          {/* ================= RUTAS PÚBLICAS ================= */}
          <Route
            path="/"
            element={usuario ? <Navigate to="/perfil" /> : <Home />}
          />

          <Route
            path="/login"
            element={usuario ? <Navigate to="/perfil" /> : <Login />}
          />

          <Route
            path="/registro"
            element={usuario ? <Navigate to="/perfil" /> : <Registro />}
          />

          {/* ================= RUTAS PRIVADAS ================= */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route
            path="/archivo"
            element={
              <ProtectedRoute>
                <Archivo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/avistamientos"
            element={
              <ProtectedRoute>
                <Avistamientos />
              </ProtectedRoute>
            }
          />

          {/* ================= CATCH ALL ================= */}
          <Route
            path="*"
            element={<Navigate to={usuario ? "/perfil" : "/login"} />}
          />

        </Routes>
      </main>
    </>
  );
}


