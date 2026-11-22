import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Form, Table } from "react-bootstrap";
import {
  actualizarEstadoCitaAdmin,
  listarTodasLasCitasAdmin,
} from "../../services/servicioCitas";

export default function CitasAdmin() {
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("TODAS");
  const [estadosSeleccionados, setEstadosSeleccionados] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardandoId, setGuardandoId] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const citasFiltradas = citas.filter((cita) => {
    if (filtro === "ACTIVAS") return !cita.archivada;
    if (filtro === "ARCHIVADAS") return cita.archivada;
    if (filtro === "RECORDATORIOS") return cita.recordatorioSolicitado && !cita.archivada;
    if (filtro === "SOLICITADAS") return cita.estado === "SOLICITADA" && !cita.archivada;
    return true;
  });

  const cargarCitas = useCallback(async () => {
    setError("");
    try {
      setCitas(await listarTodasLasCitasAdmin());
    } catch (solicitudError) {
      setError(solicitudError.message);
    } finally {
      setCargando(false);
    }
  }, []);

  async function guardarEstado(cita) {
    const estado = estadosSeleccionados[cita.id];
    if (!estado || estado === cita.estado) return;

    setError("");
    setMensaje("");
    setGuardandoId(cita.id);
    try {
      await actualizarEstadoCitaAdmin(cita.id, estado);
      setMensaje(`Estado de la cita de ${cita.nombreMascota} actualizado.`);
      setEstadosSeleccionados({});
      await cargarCitas();
    } catch (solicitudError) {
      setError(solicitudError.message);
    } finally {
      setGuardandoId(null);
    }
  }

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  return (
    <main className="container py-4">
      <h1>Administración de citas</h1>
      <p>Listado de citas registradas por los clientes.</p>

      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      {mensaje && <Alert variant="success" role="status">{mensaje}</Alert>}

      {cargando ? (
        <p role="status">Cargando citas...</p>
      ) : citas.length === 0 ? (
        <p>No hay citas registradas.</p>
      ) : (
        <>
          <Form.Group className="mb-3" controlId="filtro-citas">
            <Form.Label>Filtrar citas</Form.Label>
            <Form.Select value={filtro} onChange={(evento) => setFiltro(evento.target.value)}>
              <option value="TODAS">Todas</option>
              <option value="ACTIVAS">Activas</option>
              <option value="ARCHIVADAS">Archivadas</option>
              <option value="RECORDATORIOS">Con recordatorio solicitado</option>
              <option value="SOLICITADAS">Pendientes de revisión</option>
            </Form.Select>
          </Form.Group>
          {citasFiltradas.length === 0 ? (
            <p>No hay citas que coincidan con el filtro.</p>
          ) : (
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th scope="col">Fecha y hora</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Mascota</th>
                  <th scope="col">Motivo</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Recordatorio</th>
                  <th scope="col">Archivo</th>
                  <th scope="col">Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {citasFiltradas.map((cita) => (
                  <tr key={cita.id}>
                    <td>{cita.fechaHora.replace("T", " ").slice(0, 16)}</td>
                    <td>{cita.correoUsuario}</td>
                    <td>{cita.nombreMascota} ({cita.especie})</td>
                    <td>{cita.motivo}</td>
                    <td>{cita.estado}</td>
                    <td>{cita.recordatorioSolicitado ? "Solicitado" : "No solicitado"}</td>
                    <td>
                      <Badge bg={cita.archivada ? "secondary" : "success"}>
                        {cita.archivada ? "Archivada" : "Activa"}
                      </Badge>
                    </td>
                    <td>
                      <Form.Select
                        aria-label={`Nuevo estado de cita ${cita.id} (${cita.nombreMascota})`}
                        value={estadosSeleccionados[cita.id] ?? cita.estado}
                        onChange={(evento) => setEstadosSeleccionados({
                          ...estadosSeleccionados,
                          [cita.id]: evento.target.value,
                        })}
                        className="mb-2"
                      >
                        <option value={cita.estado}>{cita.estado}</option>
                        {[
                          ["CONFIRMADA", "Confirmada"],
                          ["ATENDIDA", "Atendida"],
                          ["CANCELADA", "Cancelada"],
                        ]
                          .filter(([estado]) => estado !== cita.estado)
                          .map(([estado, etiqueta]) => (
                            <option key={estado} value={estado}>{etiqueta}</option>
                          ))}
                      </Form.Select>
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        disabled={guardandoId === cita.id
                          || (estadosSeleccionados[cita.id] ?? cita.estado) === cita.estado}
                        onClick={() => guardarEstado(cita)}
                      >
                        {guardandoId === cita.id ? "Guardando..." : "Guardar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </main>
  );
}
