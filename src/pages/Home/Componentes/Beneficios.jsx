import React, { useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Beneficios.css";

gsap.registerPlugin(ScrollTrigger);

const Beneficios = () => {
  const itemsRef = useRef([]);

  const beneficios = [
    {
      title: "Seguridad de Nivel Profesional",
      description:
        "Cámaras HD, sensores inteligentes y sistemas de alerta que protegen tu hogar 24/7.",
      icon: "fas fa-shield-alt",
    },
    {
      title: "Automatización que Simplifica tu Vida",
      description:
        "Controlá luces, climatización y dispositivos con un toque o comandos de voz.",
      icon: "fas fa-home",
    },
    {
      title: "Ahorro Energético",
      description:
        "Optimización del consumo y rutinas inteligentes que reducen tus gastos mensuales.",
      icon: "fas fa-bolt",
    },
    {
      title: "Instalación Profesional + Soporte",
      description:
        "Nos encargamos del asesoramiento, instalación y soporte para que no tengas que preocuparte por nada.",
      icon: "fas fa-tools",
    },
  ];

  useEffect(() => {
    itemsRef.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  const addRef = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  return (
    <section className="beneficios-section py-5">
      <Container>
        <h2 className="text-center display-4 mb-3">Beneficios de SmartHome</h2>
        <p className="text-center section-subtitle mb-5">
          Tecnología pensada para mejorar tu seguridad, tu confort y tu calidad de vida.
        </p>

        <Row>
          {beneficios.map((item, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <div className="beneficio-card" ref={addRef}>
                <i className={`${item.icon} beneficio-icon`}></i>
                <h4 className="beneficio-title">{item.title}</h4>
                <p className="beneficio-description">{item.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Beneficios;
