import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Form, Table } from "react-bootstrap";
import FormularioCitaAdmin from "./FormularioCitaAdmin";
import {
  actualizarCitaAdmin,
  actualizarEstadoCitaAdmin,
  listarTodasLasCitasAdmin,
} from "../../services/servicioCitas";

export default function CitasAdmin() {
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("TODAS");
  const [clienteFiltro, setClienteFiltro] = useState("TODOS");
  const [citaEditando, setCitaEditando] = useState(null);
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
  }).filter((cita) => clienteFiltro === "TODOS" || cita.correoUsuario === clienteFiltro);

  // Agrupa las citas por el cliente que las creó (correo de su cuenta)
  const clientes = [...new Set(citas.map((cita) => cita.correoUsuario))].sort();
  const citasPorCliente = clientes
    .map((correo) => [correo, citasFiltradas.filter((cita) => cita.correoUsuario === correo)])
    .filter(([, citasCliente]) => citasCliente.length > 0);
  const cantidadActivas = citas.filter((cita) => !cita.archivada).length;
  const cantidadArchivadas = citas.filter((cita) => cita.archivada).length;
  const cantidadSolicitadas = citas.filter((cita) =>
    cita.estado === "SOLICITADA" && !cita.archivada
  ).length;

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

  async function guardarEdicion(datos) {
    setError("");
    setMensaje("");
    await actualizarCitaAdmin(citaEditando.id, datos);
    setMensaje(`Cita de ${datos.nombreMascota} actualizada.`);
    setCitaEditando(null);
    await cargarCitas();
  }

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  return (
    <main className="container py-4">
      <h1>Citas de clientes</h1>
      <p>Citas agrupadas por el cliente que las registró.</p>

      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      {mensaje && <Alert variant="success" role="status">{mensaje}</Alert>}

      {cargando ? (
        <p role="status">Cargando citas...</p>
      ) : citas.length === 0 ? (
        <p>No hay citas registradas.</p>
      ) : (
        <>
          <p aria-live="polite">
            Activas: <strong>{cantidadActivas}</strong> · Archivadas:{" "}
            <strong>{cantidadArchivadas}</strong> · Pendientes de revisión:{" "}
            <strong>{cantidadSolicitadas}</strong>
          </p>
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
          <Form.Group className="mb-3" controlId="filtro-cliente">
            <Form.Label>Cliente</Form.Label>
            <Form.Select value={clienteFiltro} onChange={(evento) => setClienteFiltro(evento.target.value)}>
              <option value="TODOS">Todos los clientes</option>
              {clientes.map((correo) => (
                <option key={correo} value={correo}>{correo}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {citasFiltradas.length === 0 ? (
            <p>No hay citas que coincidan con el filtro.</p>
          ) : citasPorCliente.map(([correo, citasCliente]) => (
            <section key={correo} className="mb-4" aria-label={`Citas de ${correo}`}>
            <h2 className="h5">
              {correo} <Badge bg="secondary">{citasCliente.length}</Badge>
            </h2>
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th scope="col">Fecha y hora</th>
                  <th scope="col">Mascota</th>
                  <th scope="col">Motivo</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Recordatorio</th>
                  <th scope="col">Archivo</th>
                  <th scope="col">Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {citasCliente.map((cita) => (
                  <tr key={cita.id}>
                    <td>{new Date(cita.fechaHora).toLocaleString("es-CL")}</td>
                    <td>{cita.nombreMascota} ({cita.especie})</td>
                    <td>
                      {cita.motivo}
                      {cita.observaciones && (
                        <div className="small text-muted mt-1">
                          <strong>Obs.:</strong> {cita.observaciones}
                        </div>
                      )}
                    </td>
                    <td>
                      {cita.estado === "SOLICITADA" ? (
                        <Badge bg="warning" text="dark">Solicitada</Badge>
                      ) : (
                        cita.estado.charAt(0) + cita.estado.slice(1).toLowerCase()
                      )}
                    </td>
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
                      </Button>{" "}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => setCitaEditando(cita)}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </section>
          ))}
        </>
      )}

      {citaEditando && (
        <FormularioCitaAdmin
          cita={citaEditando}
          onGuardar={guardarEdicion}
          onCerrar={() => setCitaEditando(null)}
        />
      )}
    </main>
  );
}
