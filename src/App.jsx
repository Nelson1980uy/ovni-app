import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Archivo from "./pages/Archivo";
import Avistamientos from "./pages/Avistamientos";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login"; // <--- IMPORTAR AQUÍ
import Registro from "./pages/Registro"; // ajusta la ruta según tu estructura


export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> {/* <-- ruta login */}
           <Route path="/registro" element={<Registro />} /> 
          <Route path="/archivo" element={<Archivo />} />
          <Route path="/avistamientos" element={<Avistamientos />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </main>
    </>
  );
}


