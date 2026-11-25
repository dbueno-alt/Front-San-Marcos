import React from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useSesion } from "../context/ContextoSesion";
import { puedeVerCatalogo } from "../config/roles";

function Navegacion() {
  const { usuario, salir } = useSesion();
  const navigate = useNavigate();

  const handleSalir = () => {
    salir();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="light" data-bs-theme="light" className="mb-3">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Veterinaria San Marcos
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          {/* Secciones principales acordadas para la veterinaria */}
          <Nav className="me-auto">
            {puedeVerCatalogo(usuario) && (
              <Nav.Link as={NavLink} to="/catalogo">
                Catálogo
              </Nav.Link>
            )}
            <Nav.Link as={NavLink} to="/nosotros">
              Nosotros
            </Nav.Link>
          </Nav>

          {/* Opciones de Autenticación y Roles */}
          <Nav className="ms-auto align-items-center gap-2">
            {!usuario ? (
              <>
                <Nav.Link as={NavLink} to="/login">
                  <Button variant="outline-primary" size="sm">
                    Iniciar Sesión
                  </Button>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/registro">
                  <Button variant="primary" size="sm">
                    Registrarse
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/ubicacion">
                  Cómo llegar
                </Nav.Link>
                {usuario.rol === "USER" && (
                  <Nav.Link as={NavLink} to="/citas">
                    Mis citas
                  </Nav.Link>
                )}
                {usuario.rol === "VETERINARIO" && (
                  <Nav.Link as={NavLink} to="/veterinario/atenciones">
                    Box Médico / Recetas
                  </Nav.Link>
                )}
                {(usuario.rol === "ADMIN" || usuario.rol === "RECEPCIONISTA") && (
                  <Nav.Link as={NavLink} to="/admin/citas">
                    Administrar citas
                  </Nav.Link>
                )}
                {usuario.rol === "ADMIN" && (
                  <Nav.Link as={NavLink} to="/admin/usuarios">
                    Usuarios y Roles
                  </Nav.Link>
                )}
                <Navbar.Text className="me-2">
                  Hola, <strong>{usuario.nombre}</strong> ({usuario.rol})
                </Navbar.Text>
                <Button variant="outline-danger" size="sm" onClick={handleSalir}>
                  Cerrar Sesión
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegacion;