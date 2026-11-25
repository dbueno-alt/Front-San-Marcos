import { useState } from "react";
import { Link } from "react-router-dom";
import { servicios } from "../data/catalogo";

function Catalogo() {
  const [categoriaServicio, setCategoriaServicio] = useState("Todas");
  const serviciosVisibles = categoriaServicio === "Todas"
    ? servicios
    : servicios.filter((servicio) => servicio.categoria === categoriaServicio);

  return (
    <main className="container py-4">
      <h1>Catálogo de servicios veterinarios</h1>
      <p>Consulta las prestaciones disponibles para la atención de tu mascota.</p>

      <div className="mb-3">
        <label htmlFor="categoria-servicio" className="form-label">
          Filtrar por categoría
        </label>
        <select
          id="categoria-servicio"
          className="form-select"
          value={categoriaServicio}
          onChange={(evento) => setCategoriaServicio(evento.target.value)}
        >
          <option>Todas</option>
          <option>Consultas</option>
          <option>Vacunación</option>
          <option>Cirugía</option>
          <option>Desparasitación</option>
          <option>Exámenes</option>
          <option>Otros</option>
        </select>
      </div>

      {serviciosVisibles.length === 0 ? (
        <p>No hay servicios en esta categoría.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">Categoría</th>
                <th scope="col">Servicio</th>
                <th scope="col">Especies</th>
              </tr>
            </thead>
            <tbody>
              {serviciosVisibles.map((servicio) => (
                <tr key={servicio.codigo}>
                  <td>{servicio.categoria}</td>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.especie}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link className="btn btn-success" to="/citas">
        Solicitar una cita
      </Link>
      <p className="small text-body-secondary mt-2">
        Confirma con la clínica la disponibilidad y los valores de cada servicio.
      </p>
    </main>
  );
}

export default Catalogo;
