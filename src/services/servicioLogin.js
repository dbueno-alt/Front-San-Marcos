const CLAVE_SESION_ACTUAL = "usuario_actual";
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8081/api";

// Base de datos local de Regiones y Comunas de Chile
export const REGIONES_Y_COMUNAS = [
  {
    region: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "San Bernardo", "Puente Alto"]
  },
  {
    region: "Región del Libertador General Bernardo O'Higgins",
    comunas: ["Rancagua"]
  },
  {
    region: "Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"]
  },
  {
    region: "Biobío",
    comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Los Ángeles"]
  }
];

// Funciones puras de utilidad
export const validarCamposVacios = (...campos) => {
  return campos.every((campo) => campo && String(campo).trim() !== "");
};

export const validarFormatoCorreo = (correo) => {
  const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expresion.test(String(correo).toLowerCase());
};

export const esAdministrador = (usuario) => {
  return Boolean(usuario && usuario.rol === "ADMIN");
};

// Función para obtener comunas asociadas a una región seleccionada
export const obtenerComunasPorRegion = (nombreRegion) => {
  const regionEncontrada = REGIONES_Y_COMUNAS.find((r) => r.region === nombreRegion);
  return regionEncontrada ? regionEncontrada.comunas : [];
};

export const servicioLogin = {
  async iniciarSesion(correo, clave) {
    let respuesta;
    try {
      respuesta = await fetch(`${AUTH_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: correo.trim(),
          password: clave
        })
      });
    } catch {
      throw new Error("No se pudo conectar con el servidor de autenticación.");
    }

    const data = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      throw new Error(data.mensaje || "Credenciales inválidas. Verifica tu correo y contraseña.");
    }

    sessionStorage.setItem(CLAVE_SESION_ACTUAL, JSON.stringify(data));
    return data;
  },

  async registrarUsuario(nombre, correo, clave, region, comuna) {
    let respuesta;
    try {
      respuesta = await fetch(`${AUTH_API_URL}/auth/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
          password: clave,
          region,
          comuna
        })
      });
    } catch {
      throw new Error("No se pudo conectar con el servidor de autenticación.");
    }

    const data = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      throw new Error(data.mensaje || "No se pudo completar el registro.");
    }

    sessionStorage.setItem(CLAVE_SESION_ACTUAL, JSON.stringify(data));
    return data;
  },

  obtenerUsuarioActual() {
    const usuario = sessionStorage.getItem(CLAVE_SESION_ACTUAL);
    return usuario ? JSON.parse(usuario) : null;
  },

  obtenerToken() {
    const usuario = this.obtenerUsuarioActual();
    return usuario ? usuario.token : null;
  },

  cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESION_ACTUAL);
  }
};
