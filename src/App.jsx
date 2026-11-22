import { Navigate, Route, Routes } from "react-router-dom";

// Contexto y Seguridad
import { ProveedorSesion } from "./context/ContextoSesion";
import { RutaProtegida } from "./components/RutaProtegida";

// Componentes Generales
import Cabecera from "./components/Cabecera";
import Navegacion from "./components/Navegacion";
import PiePagina from "./components/PiePagina";

// Páginas principales y gestión de citas
import CitasAdmin from "./pages/admin/CitasAdmin";
import Catalogo from "./pages/Catalogo";
import Citas from "./pages/Citas";
import Inicio from "./pages/Inicio";
import Multimedia from "./pages/Multimedia";
import NoEncontrada from "./pages/NoEncontrada";
import Nosotros from "./pages/Nosotros";

// Páginas del Módulo de Autenticación
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";

const SinAcceso = () => (
  <div className="container py-4">
    <div className="alert alert-danger text-center my-4" role="alert">
      <h4>Acceso Denegado</h4>
      <p>No tienes los permisos de Administrador necesarios para ver esta sección.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <ProveedorSesion>
      <Cabecera />
      <Navegacion />

      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/multimedia" element={<Multimedia />} />
        <Route path="/catalogo" element={<Catalogo />} />

        {/* Rutas de Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/sin-acceso" element={<SinAcceso />} />

        <Route element={<RutaProtegida rolesPermitidos={["USER"]} />}>
          <Route path="/citas" element={<Citas />} />
        </Route>

        {/* Rutas Protegidas Exclusivas para Administradores */}
        <Route element={<RutaProtegida rolesPermitidos={["ADMIN"]} />}>
          <Route path="/admin" element={<Navigate to="/admin/citas" replace />} />
          <Route path="/admin/citas" element={<CitasAdmin />} />
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Routes>

      <PiePagina />
    </ProveedorSesion>
  );
}
