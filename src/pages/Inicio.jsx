import { Link } from "react-router-dom";
import mascotas from "../assets/mascotas.jpg";

const aspectosAtencion = [
  {
    titulo: "Atención veterinaria",
    descripcion:
      "Un equipo dedicado al cuidado de perros, gatos, conejos y aves.",
  },
  {
    titulo: "Citas organizadas",
    descripcion:
      "El proyecto se enfocará en registrar las atenciones y consultar su historial.",
  },
  {
    titulo: "Información útil",
    descripcion:
      "Conoce la clínica y revisa contenido para acompañar el cuidado de tu mascota.",
  },
];

function Inicio() {
  return (
    <main className="container py-4">
      <section className="row align-items-center g-4 py-3 py-lg-5" aria-labelledby="titulo-inicio">
        <div className="col-12 col-lg-6">
          <p className="text-success fw-semibold text-uppercase mb-2">
            Veterinaria San Marcos · Rancagua
          </p>
          <h1 id="titulo-inicio" className="display-4 fw-bold mt-0">
            Cuidamos a quienes son parte de tu familia
          </h1>
          <p className="lead">
            Atención para mascotas y un espacio pensado para organizar sus
            próximas citas y mantener a mano su historial.
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <Link className="btn btn-success btn-lg" to="/catalogo">
              Ver servicios veterinarios
            </Link>
            <Link className="btn btn-outline-success btn-lg" to="/nosotros">
              Conocer la clínica
            </Link>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <img
            className="img-fluid rounded-4 shadow"
            src={mascotas}
            alt="Perro y gato en Veterinaria San Marcos"
          />
        </div>
      </section>

      <section className="py-4" aria-labelledby="titulo-atencion">
        <h2 id="titulo-atencion" className="mb-3">
          Una atención más fácil de organizar
        </h2>
        <div className="row g-3">
          {aspectosAtencion.map((aspecto) => (
            <div className="col-12 col-md-4" key={aspecto.titulo}>
              <article className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <h3 className="h5 card-title">{aspecto.titulo}</h3>
                  <p className="card-text">{aspecto.descripcion}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Inicio;
