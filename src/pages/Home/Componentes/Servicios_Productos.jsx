import React, { useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Servicios_Productos.css';


import ilusSecurity from '../../../assets/cam-solita.jpg';
import ilusHome from '../../../assets/luz.jpg';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const blocksRef = useRef([]);

  const servicesData = [
    {
      id: 1,
      image: ilusSecurity,
      title: "Seguridad Inteligente Completa",
      description:
        "Protegé tu hogar con tecnología profesional. Cámaras HD, sensores de movimiento, control de accesos y alertas instantáneas directamente a tu celular.",
      features: [
        "Cámaras HD con visión nocturna",
        "Sensores de movimiento",
        "Control de puertas y portones",
        "Alertas al celular",
        "Instalación profesional + garantía real"
      ]
    },
    {
      id: 2,
      image: ilusHome,
      title: "Automatización del Hogar",
      description:
        "Modernizá tu casa y controlá todo desde tu celular. Luces inteligentes, enchufes, rutinas automáticas y gestión de energía.",
      features: [
        "Control de iluminación",
        "Enchufes inteligentes",
        "Rutinas automáticas",
        "Control por voz (Alexa / Google)",
        "Ahorro de energía"
      ]
    }
  ];

  const handleCTAClick = () => {
    window.open(
      "https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20los%20servicios%20SmartHome",
      "_blank"
    );
  };

  useEffect(() => {
    blocksRef.current.forEach((block) => {
      if (!block) return;

      const image = block.querySelector(".service-image");
      const content = block.querySelector(".service-content");

      gsap.set(image, { opacity: 0 });
      gsap.fromTo(
        image,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(
        content,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  const addToRefs = (el) => {
    if (el && !blocksRef.current.includes(el)) {
      blocksRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="services-section py-5">
      <Container>
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="display-4 fw-bold text-light mb-3">
              Soluciones Inteligentes para tu Hogar
            </h2>
            <p className="lead text-light">
              Protegé, modernizá y controlá tu casa con tecnología profesional.
            </p>
          </Col>
        </Row>

        {servicesData.map((service) => (
          <div
            key={service.id}
            ref={addToRefs}
            className="service-block mb-5 p-4 rounded"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "15px",
              backdropFilter: "blur(5px)"
            }}
          >
            <Row className="align-items-center">

              {/* Imagen */}
              <Col lg={6} className="mb-4 mb-lg-0">
                <div className="image-wrapper shadow-lg rounded overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="service-image"
                  />
                </div>
              </Col>

              {/* Contenido */}
              <Col lg={6}>
                <div className="service-content text-light p-2">
                  <h3 className="fw-bold mb-3 service-title">{service.title}</h3>
                  <p className="mb-4 lead">{service.description}</p>
                  <ul className="list-unstyled mb-4">
                    {service.features.map((feature, i) => (
                      <li key={i} className="mb-2">
                        <i className="fas fa-check-circle text-primary me-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="btn service-btn" onClick={handleCTAClick}>
                    Más Información
                  </button>
                </div>
              </Col>

            </Row>
          </div>
        ))}
      </Container>
    </section>
  );
};

export default ServicesSection;
