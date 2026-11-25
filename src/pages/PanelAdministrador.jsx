import React, { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import {
  REGIONES_Y_COMUNAS,
  obtenerComunasPorRegion,
  servicioLogin
} from "../services/servicioLogin";

export const PanelAdministrador = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Estado del formulario (Crear / Editar)
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [rol, setRol] = useState("USER");
  const [activo, setActivo] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const comunasDisponibles = obtenerComunasPorRegion(region);

  const cargarUsuarios = async () => {
    setError("");
    try {
      const lista = await servicioLogin.listarUsuariosAdmin();
      setUsuarios(lista);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const abrirModalCrear = () => {
    setUsuarioEditando(null);
    setNombre("");
    setCorreo("");
    setPassword("");
    setRegion("Región del Libertador General Bernardo O'Higgins");
    setComuna("Rancagua");
    setRol("RECEPCIONISTA");
    setActivo(true);
    setError("");
    setMensaje("");
    setMostrarModal(true);
  };

  const abrirModalEditar = (u) => {
    setUsuarioEditando(u);
    setNombre(u.nombre);
    setCorreo(u.correo);
    setPassword("");
    setRegion(u.region || "Región del Libertador General Bernardo O'Higgins");
    setComuna(u.comuna || "Rancagua");
    setRol(u.rol);
    setActivo(u.activo);
    setError("");
    setMensaje("");
    setMostrarModal(true);
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setGuardando(true);

    try {
      const payload = { nombre, correo, password, region, comuna, rol, activo };
      if (usuarioEditando) {
        await servicioLogin.editarUsuarioAdmin(usuarioEditando.id, payload);
        setMensaje(`Usuario ${nombre} actualizado correctamente.`);
      } else {
        await servicioLogin.crearUsuarioAdmin(payload);
        setMensaje(`Usuario ${nombre} creado correctamente.`);
      }
      setMostrarModal(false);
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const alternarEstado = async (u) => {
    setError("");
    setMensaje("");
    try {
      await servicioLogin.cambiarEstadoUsuarioAdmin(u.id, !u.activo);
      setMensaje(`Estado de ${u.nombre} actualizado.`);
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const obtenerColorRol = (rolUsuario) => {
    switch (rolUsuario) {
      case "ADMIN":
        return "danger";
      case "RECEPCIONISTA":
        return "info";
      case "VETERINARIO":
        return "primary";
      default:
        return "secondary";
    }
  };

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0">Administración de Usuarios y Roles</h4>
          <Button variant="success" size="sm" onClick={abrirModalCrear}>
            + Nuevo Usuario
          </Button>
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {mensaje && <Alert variant="success">{mensaje}</Alert>}

          {cargando ? (
            <p>Cargando usuarios...</p>
          ) : (
            <Table striped bordered hover responsive className="align-middle mt-2">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Ubicación</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>{u.comuna}, {u.region}</td>
                    <td>
                      <Badge bg={obtenerColorRol(u.rol)}>
                        {u.rol}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={u.activo ? "success" : "warning"} text={u.activo ? "white" : "dark"}>
                        {u.activo ? "Activo" : "Desactivado"}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => abrirModalEditar(u)}>
                        Editar / Rol
                      </Button>
                      <Button
                        variant={u.activo ? "outline-danger" : "outline-success"}
                        size="sm"
                        onClick={() => alternarEstado(u)}
                      >
                        {u.activo ? "Desactivar" : "Activar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Form onSubmit={guardarUsuario}>
          <Modal.Header closeButton>
            <Modal.Title>{usuarioEditando ? "Editar Usuario" : "Crear Nuevo Usuario"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                {usuarioEditando ? "Nueva contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
              </Form.Label>
              <Form.Control
                type="password"
                required={!usuarioEditando}
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Región</Form.Label>
                  <Form.Select
                    required
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setComuna("");
                    }}
                  >
                    <option value="">Selecciona Región</option>
                    {REGIONES_Y_COMUNAS.map((r) => (
                      <option key={r.region} value={r.region}>{r.region}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Comuna</Form.Label>
                  <Form.Select required value={comuna} onChange={(e) => setComuna(e.target.value)}>
                    <option value="">Selecciona Comuna</option>
                    {comunasDisponibles.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Rol del sistema</Form.Label>
              <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="ADMIN">ADMIN (Administrador)</option>
                <option value="RECEPCIONISTA">RECEPCIONISTA (Operador Clínica)</option>
                <option value="VETERINARIO">VETERINARIO (Médico Veterinario)</option>
                <option value="USER">USER (Dueño de Mascota)</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};