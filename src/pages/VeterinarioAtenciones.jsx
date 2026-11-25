import React, { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Container, Form, Modal, Table } from "react-bootstrap";
import {
  listarCitasVeterinario,
  registrarAtencionVeterinario,
} from "../services/servicioCitas";

export const VeterinarioAtenciones = () => {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Modal de Ficha Clínica / Receta
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [diagnostico, setDiagnostico] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [receta, setReceta] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargarCitas = async () => {
    setError("");
    try {
      const data = await listarCitasVeterinario();
      setCitas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const abrirModalAtencion = (cita) => {
    setCitaSeleccionada(cita);
    setDiagnostico(cita.diagnostico || "");
    setIndicaciones(cita.indicaciones || "");
    setReceta(cita.receta || "");
    setError("");
    setMensaje("");
  };

  const guardarAtencion = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      await registrarAtencionVeterinario(citaSeleccionada.id, {
        diagnostico,
        indicaciones,
        receta,
      });
      setMensaje(`Atención y receta emitidas para ${citaSeleccionada.nombreMascota}.`);
      setCitaSeleccionada(null);
      await cargarCitas();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white p-3">
          <h4 className="m-0">Box Médico Veterinario — Atenciones, Indicaciones y Recetas</h4>
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {mensaje && <Alert variant="success">{mensaje}</Alert>}

          {cargando ? (
            <p>Cargando agenda clínica...</p>
          ) : citas.length === 0 ? (
            <Alert variant="info">No hay pacientes agendados por el momento.</Alert>
          ) : (
            <Table striped bordered hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Mascota (Especie)</th>
                  <th>Tutor</th>
                  <th>Motivo Consulta</th>
                  <th>Estado</th>
                  <th>Acción Clínica</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c) => (
                  <tr key={c.id}>
                    <td>{new Date(c.fechaHora).toLocaleString("es-CL")}</td>
                    <td>
                      <strong>{c.nombreMascota}</strong> ({c.especie})
                    </td>
                    <td>{c.correoUsuario}</td>
                    <td>{c.motivo}</td>
                    <td>
                      <Badge
                        bg={
                          c.estado === "ATENDIDA"
                            ? "success"
                            : c.estado === "CONFIRMADA"
                            ? "info"
                            : c.estado === "CANCELADA"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {c.estado}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant={c.estado === "ATENDIDA" ? "outline-success" : "primary"}
                        size="sm"
                        disabled={c.estado === "CANCELADA"}
                        onClick={() => abrirModalAtencion(c)}
                      >
                        {c.estado === "ATENDIDA" ? "Ver / Editar Receta" : "Atender y Recetar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(citaSeleccionada)} onHide={() => setCitaSeleccionada(null)} size="lg">
        <Form onSubmit={guardarAtencion}>
          <Modal.Header closeButton>
            <Modal.Title>
              Ficha Clínica: {citaSeleccionada?.nombreMascota} ({citaSeleccionada?.especie})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted mb-3">
              <strong>Motivo reportado:</strong> {citaSeleccionada?.motivo}
            </p>

            <Form.Group className="mb-3">
              <Form.Label>Diagnóstico Clínico *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                required
                placeholder="Ej: Otitis externa leve en oído derecho..."
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Indicaciones y Cuidados al Tutor *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                placeholder="Ej: Limpiar pabellón auricular cada 12 horas, evitar baños por 7 días y controlar en 10 días."
                value={indicaciones}
                onChange={(e) => setIndicaciones(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Receta Médica (Fármacos, dosis y frecuencia)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ej: Gotas óticas Otiflex C: aplicar 3 gotas cada 12 horas por 7 días."
                value={receta}
                onChange={(e) => setReceta(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setCitaSeleccionada(null)}>
              Cancelar
            </Button>
            <Button variant="success" type="submit" disabled={guardando}>
              {guardando ? "Emitiendo ficha..." : "Guardar Ficha y Emitir Receta"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};