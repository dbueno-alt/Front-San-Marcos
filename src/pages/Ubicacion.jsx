import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Ubicacion.css";
import iconoMarcador from "leaflet/dist/images/marker-icon.png";
import sombraMarcador from "leaflet/dist/images/marker-shadow.png";
import { CLINICA } from "../config/api";

// Ícono del marcador: con Vite hay que importar las imágenes de Leaflet e indicarlas aquí.
const icono = L.icon({
  iconUrl: iconoMarcador,
  shadowUrl: sombraMarcador,
  iconSize: [25, 41],
  iconAnchor: [12, 41], // punta del pin sobre la coordenada
  popupAnchor: [1, -34],
});

// Enlace de Google Maps con la ruta desde el origen (si existe) hasta la clínica.
export function enlaceGoogleMaps(origen) {
  const destino = `${CLINICA.lat},${CLINICA.lng}`;
  const desde = origen ? `&origin=${origen.lat},${origen.lng}` : "";
  return `https://www.google.com/maps/dir/?api=1${desde}&destination=${destino}`;
}

function Ubicacion() {
  const contenedor = useRef(null); // <div> donde se dibuja el mapa
  const mapa = useRef(null);       // objeto del mapa de Leaflet
  const [origen, setOrigen] = useState(null);
  const [error, setError] = useState("");

  // 1. Crear el mapa una sola vez (igual que el ejemplo de la página de Leaflet).
  useEffect(() => {
    mapa.current = L.map(contenedor.current).setView([CLINICA.lat, CLINICA.lng], 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa.current);

    L.marker([CLINICA.lat, CLINICA.lng], { icon: icono }).addTo(mapa.current).bindPopup(CLINICA.nombre).openPopup();

    return () => mapa.current.remove(); // limpiar al salir de la página
  }, []);

  // 2. Marcar la ubicación actual del usuario y encuadrar ambos puntos.
  function mostrarMiUbicacion() {
    if (!navigator.geolocation) {
      setError("Tu navegador no permite obtener la ubicación.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const yo = { lat: coords.latitude, lng: coords.longitude };
        setOrigen(yo);
        setError("");
        L.marker([yo.lat, yo.lng], { icon: icono }).addTo(mapa.current).bindPopup("Tu ubicación");
        mapa.current.fitBounds([[yo.lat, yo.lng], [CLINICA.lat, CLINICA.lng]], { padding: [30, 30] });
      },
      () => setError("No se pudo obtener tu ubicación. Revisa los permisos del navegador.")
    );
  }

  return (
    <Container className="pagina-ubicacion my-4">
      <h1 className="h3">Cómo llegar</h1>
      <p className="text-muted">{CLINICA.nombre} · {CLINICA.direccion}</p>

      <div ref={contenedor} className="mapa-clinica rounded border mb-3" data-testid="mapa" />

      {error && <Alert variant="warning">{error}</Alert>}
      <div className="d-flex flex-wrap gap-2">
        <Button onClick={mostrarMiUbicacion}>Ver mi ubicación</Button>
        <Button variant="outline-primary" href={enlaceGoogleMaps(origen)} target="_blank" rel="noreferrer">
          Indicaciones en Google Maps
        </Button>
      </div>
    </Container>
  );
}

export default Ubicacion;
