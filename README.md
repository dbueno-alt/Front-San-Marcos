# Veterinaria San Marcos — Frontend

Interfaz React para consultar los servicios de la veterinaria, crear una cuenta e iniciar sesión, y gestionar citas e historial.

## Requisitos

- Node.js y npm.
- Los servicios Auth y Back disponibles para las funciones de inicio de sesión y citas.

## Configuración local

Las URL de desarrollo están en `.env.development` y pueden ajustarse para el entorno local:

- `VITE_AUTH_API_URL`: URL base de Auth.
- `VITE_ACTIVIDADES_API_URL`: URL base del API de citas.

Los valores que empiezan con `VITE_` son visibles en el navegador. No guardar secretos en estos valores.

## Ejecución

Desde esta carpeta:

```text
npm install
npm run dev
```

Para generar la versión de producción:

```text
npm run build
```

La configuración `.env.production` dirige las solicitudes a los prefijos que Nginx reenvía a Auth y Back.
