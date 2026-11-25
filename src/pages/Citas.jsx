import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import {
  actualizarCita,
  archivarCita,
  crearCita,
  listarCitas,
  listarHistorialCitas,
} from "../services/servicioCitas";

const datosIniciales = {
  nombreMascota: "",
  especie: "",
  fechaHora: "",
  motivo: "",
  recordatorioSolicitado: false,
};

function obtenerFechaHoraMinima() {
  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
  return ahora.toISOString().slice(0, 16);
}

function Citas() {
  const [citas, setCitas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [datos, setDatos] = useState(datosIniciales);
  const [citaEditando, setCitaEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const recordatoriosProximos = citas.filter((cita) =>
    cita.recordatorioSolicitado && new Date(cita.fechaHora) >= new Date()
  );

  const cargarCitas = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const citasActivas = await listarCitas();
      const citasArchivadas = await listarHistorialCitas();
      setCitas(citasActivas);
      setHistorial(citasArchivadas);
    } catch (solicitudError) {
      setError(solicitudError.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  function cambiarCampo(evento) {
    const { name, value, type, checked } = evento.target;
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value });
    setMensaje("");
  }

  function editar(cita) {
    setCitaEditando(cita.id);
    setDatos({
      nombreMascota: cita.nombreMascota,
      especie: cita.especie,
      fechaHora: cita.fechaHora.slice(0, 16),
      motivo: cita.motivo,
      recordatorioSolicitado: cita.recordatorioSolicitado,
    });
    setMensaje("");
  }

  function limpiarFormulario() {
    setDatos(datosIniciales);
    setCitaEditando(null);
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError("");
    setMensaje("");
    setGuardando(true);

    try {
      if (citaEditando) {
        await actualizarCita(citaEditando, datos);
        setMensaje("La cita fue actualizada.");
      } else {
        await crearCita(datos);
        setMensaje("La cita fue registrada.");
      }
      limpiarFormulario();
      await cargarCitas();
    } catch (solicitudError) {
      setError(solicitudError.message);
    } finally {
      setGuardando(false);
    }
  }

  async function archivar(id) {
    setError("");
    setMensaje("");
    try {
      await archivarCita(id);
      setMensaje("La cita se archivó y quedó disponible en el historial.");
      await cargarCitas();
    } catch (solicitudError) {
      setError(solicitudError.message);
    }
  }

  return (
    <main className="container py-4">
      <h1>Mis citas</h1>
      <p>Registra las atenciones de tu mascota y consulta su historial.</p>
      <Button
        type="button"
        variant="outline-primary"
        className="mb-3"
        onClick={cargarCitas}
        disabled={cargando || guardando}
      >
        {cargando ? "Actualizando citas..." : "Actualizar citas"}
      </Button>

      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      {mensaje && <Alert variant="success" role="status">{mensaje}</Alert>}

      <section className="mb-4" aria-labelledby="titulo-recordatorios">
        <h2 id="titulo-recordatorios" className="h4">Próximos recordatorios</h2>
        {recordatoriosProximos.length === 0 ? (
          <p>No tienes citas próximas con recordatorio solicitado.</p>
        ) : (
          <ul className="list-group">
            {recordatoriosProximos.map((cita) => (
              <li className="list-group-item" key={cita.id}>
                <strong>{cita.nombreMascota}</strong>: cita el{" "}
                {new Date(cita.fechaHora).toLocaleString("es-CL")}.
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-5" aria-labelledby="titulo-formulario-cita">
        <h2 id="titulo-formulario-cita">
          {citaEditando ? "Editar cita" : "Solicitar una cita"}
        </h2>
        <Form onSubmit={enviar}>
          <Form.Group className="mb-3" controlId="nombreMascota">
            <Form.Label>Nombre de la mascota</Form.Label>
            <Form.Control
              name="nombreMascota"
              value={datos.nombreMascota}
              onChange={cambiarCampo}
              maxLength={100}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="especie">
            <Form.Label>Especie</Form.Label>
            <Form.Select
              name="especie"
              value={datos.especie}
              onChange={cambiarCampo}
              required
            >
              <option value="">Selecciona una especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Conejo">Conejo</option>
              <option value="Ave">Ave</option>
              <option value="Otro">Otro</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="fechaHora">
            <Form.Label>Fecha y hora solicitadas</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fechaHora"
              value={datos.fechaHora}
              min={obtenerFechaHoraMinima()}
              onChange={cambiarCampo}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="motivo">
            <Form.Label>Motivo de la consulta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="motivo"
              value={datos.motivo}
              onChange={cambiarCampo}
              maxLength={500}
              required
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="recordatorioSolicitado"
            name="recordatorioSolicitado"
            label="Solicitar un recordatorio para esta cita"
            checked={datos.recordatorioSolicitado}
            onChange={cambiarCampo}
          />

          <p className="small text-body-secondary">
            La solicitud de recordatorio quedará asociada al registro de la cita.
          </p>
          <Button type="submit" variant="success" disabled={guardando}>
            {guardando ? "Guardando..." : citaEditando ? "Guardar cambios" : "Registrar cita"}
          </Button>
          {citaEditando && (
            <Button
              type="button"
              variant="outline-secondary"
              className="ms-2"
              onClick={limpiarFormulario}
            >
              Cancelar edición
            </Button>
          )}
        </Form>
      </section>

      {cargando ? (
        <p role="status">Cargando citas...</p>
      ) : (
        <>
          <section className="mb-5" aria-labelledby="titulo-citas-activas">
            <h2 id="titulo-citas-activas">Citas activas</h2>
            {citas.length === 0 ? (
              <p>No tienes citas activas.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Fecha y hora</th>
                      <th scope="col">Mascota</th>
                      <th scope="col">Motivo</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Recordatorio</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citas.map((cita) => (
                      <tr key={cita.id}>
                        <td>{new Date(cita.fechaHora).toLocaleString("es-CL")}</td>
                        <td>{cita.nombreMascota} ({cita.especie})</td>
                        <td>
                          {cita.motivo}
                          {cita.observaciones && (
                            <div className="small text-muted mt-1">
                              <strong>Indicaciones del veterinario:</strong> {cita.observaciones}
                            </div>
                          )}
                        </td>
                        <td>{cita.estado.charAt(0) + cita.estado.slice(1).toLowerCase()}</td>
                        <td>{cita.recordatorioSolicitado ? "Solicitado" : "No solicitado"}</td>
                        <td>
                          <Button
                            type="button"
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => editar(cita)}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => archivar(cita.id)}
                          >
                            Archivar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section aria-labelledby="titulo-historial-citas">
            <h2 id="titulo-historial-citas">Historial archivado</h2>
            {historial.length === 0 ? (
              <p>Aún no hay citas archivadas.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Fecha y hora</th>
                      <th scope="col">Mascota</th>
                      <th scope="col">Motivo</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Recordatorio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((cita) => (
                      <tr key={cita.id}>
                        <td>{new Date(cita.fechaHora).toLocaleString("es-CL")}</td>
                        <td>{cita.nombreMascota} ({cita.especie})</td>
                        <td>
                          {cita.motivo}
                          {cita.observaciones && (
                            <div className="small text-muted mt-1">
                              <strong>Indicaciones del veterinario:</strong> {cita.observaciones}
                            </div>
                          )}
                        </td>
                        <td>{cita.estado.charAt(0) + cita.estado.slice(1).toLowerCase()}</td>
                        <td>{cita.recordatorioSolicitado ? "Solicitado" : "No solicitado"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default Citas;
