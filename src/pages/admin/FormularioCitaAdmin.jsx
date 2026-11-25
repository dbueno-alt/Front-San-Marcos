import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

// Formulario para que un administrador o veterinario corrija una cita
// y registre observaciones de la atención.
export default function FormularioCitaAdmin({ cita, onGuardar, onCerrar }) {
  const [datos, setDatos] = useState({
    nombreMascota: cita.nombreMascota ?? "",
    especie: cita.especie ?? "",
    fechaHora: (cita.fechaHora ?? "").slice(0, 16),
    motivo: cita.motivo ?? "",
    observaciones: cita.observaciones ?? "",
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const cambiar = (campo) => (evento) => setDatos({ ...datos, [campo]: evento.target.value });

  async function enviar(evento) {
    evento.preventDefault();
    if (!datos.nombreMascota.trim() || !datos.especie.trim() || !datos.fechaHora || !datos.motivo.trim()) {
      setError("Mascota, especie, fecha y motivo son obligatorios.");
      return;
    }
    setError("");
    setGuardando(true);
    try {
      await onGuardar(datos);
    } catch (solicitudError) {
      setError(solicitudError.message);
      setGuardando(false);
    }
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Form onSubmit={enviar} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>Editar cita de {cita.correoUsuario}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" role="alert">{error}</Alert>}
          <Form.Group className="mb-3" controlId="editar-mascota">
            <Form.Label>Mascota</Form.Label>
            <Form.Control value={datos.nombreMascota} onChange={cambiar("nombreMascota")} maxLength={100} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editar-especie">
            <Form.Label>Especie</Form.Label>
            <Form.Control value={datos.especie} onChange={cambiar("especie")} maxLength={50} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editar-fecha">
            <Form.Label>Fecha y hora</Form.Label>
            <Form.Control type="datetime-local" value={datos.fechaHora} onChange={cambiar("fechaHora")} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editar-motivo">
            <Form.Label>Motivo</Form.Label>
            <Form.Control as="textarea" rows={2} value={datos.motivo} onChange={cambiar("motivo")} maxLength={500} />
          </Form.Group>
          <Form.Group controlId="editar-observaciones">
            <Form.Label>Observaciones del veterinario</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={datos.observaciones}
              onChange={cambiar("observaciones")}
              maxLength={2000}
              placeholder="Diagnóstico, tratamiento, indicaciones..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCerrar} disabled={guardando}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
