import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Alert, Container, Row, Col } from "react-bootstrap";
import { useSesion } from "../context/ContextoSesion";
import { validarCamposVacios } from "../services/servicioLogin";

export const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { ingresar } = useSesion();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validarCamposVacios(correo, clave)) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setCargando(true);
    try {
      const usuario = await ingresar(correo, clave);

      if (usuario.rol === "ADMIN") {
        navigate("/admin/usuarios");
      } else if (usuario.rol === "RECEPCIONISTA") {
        navigate("/admin/citas");
      } else if (usuario.rol === "VETERINARIO") {
        navigate("/veterinario/atenciones");
      } else {
        navigate("/citas");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">Iniciar Sesión</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="correo">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={cargando}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="clave">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    disabled={cargando}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2"
                  disabled={cargando}
                >
                  {cargando ? "Ingresando..." : "Entrar"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};