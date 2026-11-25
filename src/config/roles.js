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

// Quiénes ven y editan las citas de todos los clientes.
// Un cliente (USER) solo ve las suyas en "Mis citas".
export const ROLES_GESTION_CITAS = [ROLES.ADMIN, ROLES.VETERINARIO];

export const puedeGestionarCitas = (usuario) =>
  Boolean(usuario) && ROLES_GESTION_CITAS.includes(usuario.rol);

export const puedeVerCatalogo = (usuario) =>
  Boolean(usuario) && ROLES_CATALOGO.includes(usuario.rol);
