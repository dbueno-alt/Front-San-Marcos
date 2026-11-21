import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Table } from "react-bootstrap";
import { listarTodasLasCitasAdmin } from "../../services/servicioCitas";

export default function CitasAdmin() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  return (
    <main className="container py-4">
      <h1>Administración de citas</h1>
      <p>Listado de citas registradas por los clientes.</p>

      {error && <Alert variant="danger" role="alert">{error}</Alert>}

      {cargando ? (
        <p role="status">Cargando citas...</p>
      ) : citas.length === 0 ? (
        <p>No hay citas registradas.</p>
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
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
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
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </main>
  );
}
