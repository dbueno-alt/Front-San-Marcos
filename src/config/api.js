// Configuración central del front. Lee las mismas variables de entorno que ya usan
// los servicios existentes (servicioLogin.js y servicioCitas.js); no cambia su comportamiento.
const env = import.meta.env ?? {};

export const API = {
  // Microservicio de autenticación (usado por src/services/servicioLogin.js)
  auth: env.VITE_AUTH_API_URL || "http://localhost:8081/api",
  // Microservicio de actividades / citas (usado por src/services/servicioCitas.js)
  actividades: env.VITE_ACTIVIDADES_API_URL || "http://localhost:8082/api",
};

// Ubicación de la clínica para el mapa. Confirmar la dirección y coordenadas reales.
export const CLINICA = {
  nombre: "Veterinaria San Marcos",
  direccion: env.VITE_CLINICA_DIRECCION || "Rancagua, Región de O'Higgins",
  lat: Number(env.VITE_CLINICA_LAT || -34.1703),
  lng: Number(env.VITE_CLINICA_LNG || -70.7406),
};
