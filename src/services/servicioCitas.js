import { servicioLogin } from "./servicioLogin";

const ACTIVIDADES_API_URL =
  import.meta.env.VITE_ACTIVIDADES_API_URL || "http://localhost:8082/api";
const RUTA_CITAS = `${ACTIVIDADES_API_URL}/v1/citas`;
const RUTA_ADMIN_CITAS = `${ACTIVIDADES_API_URL}/v1/admin/citas`;

async function solicitar(ruta, opciones = {}, rutaBase = RUTA_CITAS) {
  const token = servicioLogin.obtenerToken();
  const headers = { "Content-Type": "application/json", ...opciones.headers };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let respuesta;
  try {
    respuesta = await fetch(`${rutaBase}${ruta}`, { ...opciones, headers });
  } catch {
    throw new Error("No se pudo conectar con el servicio de citas.");
  }

  if (!respuesta.ok) {
    throw new Error(`Solicitud rechazada: ${respuesta.status}`);
  }

  return respuesta.status === 204 ? null : respuesta.json();
}

export const listarCitas = () => solicitar("");

export const listarHistorialCitas = () => solicitar("/historial");

export const obtenerCita = (id) => solicitar(`/${id}`);

export const crearCita = (cita) =>
  solicitar("", { method: "POST", body: JSON.stringify(cita) });

export const actualizarCita = (id, cita) =>
  solicitar(`/${id}`, { method: "PUT", body: JSON.stringify(cita) });

export const archivarCita = (id) => solicitar(`/${id}`, { method: "DELETE" });

export const listarTodasLasCitasAdmin = () => solicitar("", {}, RUTA_ADMIN_CITAS);

export const actualizarEstadoCitaAdmin = (id, estado) =>
  solicitar(`/${id}/estado`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  }, RUTA_ADMIN_CITAS);
