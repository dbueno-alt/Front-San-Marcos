// Roles que existen en el sistema (los asigna el microservicio de auth en el campo "rol").
export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  VETERINARIO: "VETERINARIO",
  RECEPCIONISTA: "RECEPCIONISTA",
};

// Quiénes pueden ver el catálogo de productos veterinarios.
// Los clientes (USER) y los visitantes sin sesión no lo ven.
export const ROLES_CATALOGO = [ROLES.ADMIN, ROLES.VETERINARIO, ROLES.RECEPCIONISTA];

// Quiénes administran y gestionan las citas de los clientes (/admin/citas).
// Un cliente (USER) solo ve las suyas en "Mis citas".
export const ROLES_GESTION_CITAS = [ROLES.ADMIN, ROLES.RECEPCIONISTA];

// Quiénes pueden emitir diagnósticos, indicaciones médicas y recetas (/veterinario/atenciones).
export const ROLES_ATENCION_CLINICA = [ROLES.VETERINARIO, ROLES.ADMIN];

// Quiénes pueden administrar usuarios y asignar roles en el sistema (/admin/usuarios).
export const ROLES_ADMIN_USUARIOS = [ROLES.ADMIN];

export const puedeVerCatalogo = (usuario) =>
  Boolean(usuario) && ROLES_CATALOGO.includes(usuario.rol);

export const puedeGestionarCitas = (usuario) =>
  Boolean(usuario) && ROLES_GESTION_CITAS.includes(usuario.rol);

export const puedeAtenderClinicamente = (usuario) =>
  Boolean(usuario) && ROLES_ATENCION_CLINICA.includes(usuario.rol);

export const puedeAdministrarUsuarios = (usuario) =>
  Boolean(usuario) && ROLES_ADMIN_USUARIOS.includes(usuario.rol);