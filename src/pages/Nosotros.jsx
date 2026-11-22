import { Link } from "react-router-dom";

function Nosotros() {
  return (
    <main className="container py-4">
      <h1>Conoce Veterinaria San Marcos</h1>
      <section aria-labelledby="titulo-historia">
        <h2 id="titulo-historia">Nuestra historia</h2>
        <p>
          Veterinaria San Marcos fue fundada en 2009 en Rancagua, en la Región
          del Libertador General Bernardo O&apos;Higgins.
        </p>
        <p>
          Atendemos mascotas domésticas, principalmente perros y gatos, y
          también conejos y aves.
        </p>
      </section>
      <section aria-labelledby="titulo-proposito">
        <h2 id="titulo-proposito">Nuestro propósito</h2>
        <p>
          Cuidar la salud de las mascotas y acompañar a sus dueños en su atención
          veterinaria.
        </p>
      </section>
      <section aria-labelledby="titulo-principios">
        <h2 id="titulo-principios">Principios de trabajo</h2>
        <ul>
          <li>Trato respetuoso hacia las mascotas y sus dueños.</li>
          <li>Cuidado de la información de cada paciente.</li>
          <li>Trabajo en equipo para la atención de las mascotas.</li>
        </ul>
      </section>
      <section aria-labelledby="titulo-equipo">
        <h2 id="titulo-equipo">Equipo de la veterinaria</h2>
        <ul>
          <li>Tres médicos veterinarios.</li>
          <li>Un técnico veterinario.</li>
          <li>Una recepcionista administrativa.</li>
        </ul>
      </section>
      <section aria-labelledby="titulo-citas">
        <h2 id="titulo-citas">Gestiona las citas de tu mascota</h2>
        <p>
          Con una cuenta puedes registrar una solicitud de cita, revisar su estado,
          editarla y consultar las citas archivadas.
        </p>
        <ol>
          <li>Inicia sesión o crea una cuenta.</li>
          <li>Completa los datos de tu mascota, la fecha solicitada y el motivo de la consulta.</li>
          <li>Revisa el estado de tu solicitud en la sección Mis citas.</li>
        </ol>
        <p>También puedes marcar que deseas un recordatorio para una cita.</p>
        <Link className="btn btn-success me-2" to="/login">Iniciar sesión</Link>
        <Link className="btn btn-outline-success" to="/registro">Crear una cuenta</Link>
      </section>
    </main>
  );
}

export default Nosotros;
