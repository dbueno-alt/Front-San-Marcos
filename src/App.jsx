import { Navigate, Route, Routes } from "react-router-dom";

// Contexto y Seguridad
import { ProveedorSesion } from "./context/ContextoSesion";
import { RutaProtegida } from "./components/RutaProtegida";

// Componentes Generales
import Cabecera from "./components/Cabecera";
import Navegacion from "./components/Navegacion";
import PiePagina from "./components/PiePagina";

// Páginas principales y gestión de citas/usuarios
import CitasAdmin from "./pages/admin/CitasAdmin";
import { PanelAdministrador } from "./pages/PanelAdministrador";
import { VeterinarioAtenciones } from "./pages/VeterinarioAtenciones";
import Catalogo from "./pages/Catalogo";
import Citas from "./pages/Citas";
import Inicio from "./pages/Inicio";
import NoEncontrada from "./pages/NoEncontrada";
import Nosotros from "./pages/Nosotros";
import Ubicacion from "./pages/Ubicacion"; // mapa de la clínica (Leaflet)

// Páginas del Módulo de Autenticación
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";

const SinAcceso = () => (
  <div className="container py-4">
    <div className="alert alert-danger text-center my-4" role="alert">
      <h4>Acceso Denegado</h4>
      <p>No tienes los permisos necesarios para acceder a esta sección.</p>
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
        <Route path="/catalogo" element={<Catalogo />} />

        {/* Rutas de Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/sin-acceso" element={<SinAcceso />} />

        {/* Rutas Protegidas: Dueño de mascota (USER) */}
        <Route element={<RutaProtegida rolesPermitidos={["USER"]} />}>
          <Route path="/citas" element={<Citas />} />
        </Route>

        {/* Rutas Protegidas: Médico Veterinario (Atenciones, indicaciones y recetas) */}
        <Route element={<RutaProtegida rolesPermitidos={["VETERINARIO", "ADMIN"]} />}>
          <Route path="/veterinario/atenciones" element={<VeterinarioAtenciones />} />
        </Route>

        {/* Rutas Protegidas: Recepcionista y Administrador (Gestión operativa de citas) */}
        <Route element={<RutaProtegida rolesPermitidos={["ADMIN", "RECEPCIONISTA"]} />}>
          <Route path="/admin/citas" element={<CitasAdmin />} />
        </Route>

        {/* Rutas Protegidas: Exclusivo Administrador (Gestión de usuarios y roles) */}
        <Route element={<RutaProtegida rolesPermitidos={["ADMIN"]} />}>
          <Route path="/admin" element={<Navigate to="/admin/usuarios" replace />} />
          <Route path="/admin/usuarios" element={<PanelAdministrador />} />
        </Route>

        {/* Mapa de la clínica: cualquier usuario autenticado */}
        <Route element={<RutaProtegida />}>
          <Route path="/ubicacion" element={<Ubicacion />} />
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Routes>
      <PiePagina />
    </ProveedorSesion>
  );
}