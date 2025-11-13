import React, { useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ilus from '../../../assets/garaje.jpg';
import ilus3 from '../../../assets/cerradura-card.jpg';
import ilus2 from '../../../assets/tablet.jpg';
import ilus4 from '../../../assets/pareja-luz.jpg';

import us1 from '../../../assets/us1.png';
import us2 from '../../../assets/us2.png';
import us3 from '../../../assets/us5.png';
import us4 from '../../../assets/us4.png';

//link ig : https://www.instagram.com/smarthome_sgo/


// Registrar ScrollTrigger de GSAP
gsap.registerPlugin(ScrollTrigger);

const ProjectsTestimonialsSection = () => {
  const sectionRef = useRef();
  const projectCardsRef = useRef([]);
  const testimonialCardsRef = useRef([]);
  const ctaRef = useRef();

  // Datos de los proyectos
  const projectsData = [
    {
      id: 1,
      image: ilus,
      title: "Abre Portón de Garaje Inteligente",
      description: "Implementación completa del sistema que perite abrir el portón del garaje desde un smart phone.",
      link: "https://www.instagram.com/smarthome_sgo/"
    },
    {
      id: 2,
      image: ilus4,
      title: "Departamento Automatizado",
      description: "Transformación de apartamento en smart home con control centralizado desde app móvil.",
      link: "https://www.instagram.com/smarthome_sgo/"
    },
    {
      id: 3,
      image: ilus3,
      title: "Ceerradura Inteligente",
      description: "Sistema de seguridad con control de acceso, monitoreo 24/7, acciones preventivas y seguridad contra robos.",
      link: "https://www.instagram.com/smarthome_sgo/"
    },
    {
      id: 4,
      image: ilus2,
      title: "Confort Automatizado",
      description: "Implementación de módulo de ventilación inteligente permite optimizar la temperatura y calidad del aire de tu hogar",
      link: "https://www.instagram.com/smarthome_sgo/"
    }
  ];

  // Datos de los testimonios
  const testimonialsData = [
    {
      id: 1,
      name: "María González",
      role: "Propietaria Casa Moderna",
      image: us3,
      rating: 5,
      comment: "Increíble servicio! Mi casa ahora es completamente inteligente y segura. La atención postventa es excepcional.",
      project: "Automatizacion de hogar"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Propietaria Casa",
      image: us3,
      rating: 5,
      comment: "Profesionalismo total. Implementaron nuestro sistema de seguridad en tiempo récord.",
      project: "Sistema de seguridad Domotica"
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Propietaria de departamento",
      image: us3,
      rating: 5,
      comment: "La mejor inversión para mi departamento. Controlar todo desde el celular cambió mi calidad de vida.",
      project: "Departamento Automatizado"
    },
    {
      id: 4,
      name: "Roberto Silva",
      role: "Administrador Edificio",
      image: us3,
      rating: 5,
      comment: "Sistema impecable para nuestro edificio. Los residentes están muy satisfechos con la seguridad.",
      project: "Edificio Residencial"
    }
  ];

  // Animaciones con GSAP
  useEffect(() => {
    // Animación de las cards de proyectos
    projectCardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(card,
        {
          x: -100,
          opacity: 0,
          scale: 0.9
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animación de las cards de testimonios
    testimonialCardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(card,
        {
          x: 100,
          opacity: 0,
          rotationY: 90
        },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 0.8,
          delay: index * 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Efecto de flotación continua para testimonios
      gsap.to(card, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5
      });
    });

    // Animación del botón CTA
    gsap.fromTo(ctaRef.current,
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 90%",
          end: "bottom 10%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToProjectRefs = (el) => {
    if (el && !projectCardsRef.current.includes(el)) {
      projectCardsRef.current.push(el);
    }
  };

  const addToTestimonialRefs = (el) => {
    if (el && !testimonialCardsRef.current.includes(el)) {
      testimonialCardsRef.current.push(el);
    }
  };

  //funcion cta
    const handleCTAClick = () => {
    console.log("CTA clicked!");
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo smart', '_blank')
    // Tu acción para el botón CTA
  };

  // Función para renderizar estrellas de rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
      ></i>
    ));
  };

  return (
    <section ref={sectionRef} className="projects-testimonials-section py-5">
      <Container>
        {/* Título de la sección */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center ">
            <h2 className="display-4 fw-bold text-white mb-3">
              Proyectos y Testimonios
            </h2>
            <p className="lead text-white">
              Conoce nuestros trabajos y lo que dicen nuestros clientes
            </p>
          </Col>
        </Row>

        {/* Fila de Proyectos */}
        <Row className="mb-5">
          <Col>
            <h3 className="section-subtitle text-center mb-4">Nuestros Proyectos</h3>
          </Col>
        </Row>
        <Row className="g-4 mb-5">
          {projectsData.map((project) => (
            <Col key={project.id} lg={6} xl={3} md={6}>
              <Card
                ref={addToProjectRefs}
                className="project-card border-0 shadow-lg h-100"
                onClick={() => window.location.href = project.link}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-image-container">
                  <Card.Img
                    variant="top"
                    src={project.image}
                    alt={project.title}
                    className="project-image"
                  />
                  <div className="project-overlay"></div>
                </div>
                <Card.Body className="p-4">
                  <Card.Title className="project-title fw-bold mb-3">
                    {project.title}
                  </Card.Title>
                  <Card.Text className="project-description text-muted">
                    {project.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Fila de Testimonios */}
        <Row className="mb-5">
          <Col>
            <h3 className="section-subtitle text-center mb-4">Lo que dicen nuestros clientes</h3>
          </Col>
        </Row>
        <Row className="g-4 mb-5">
          {testimonialsData.map((testimonial) => (
            <Col key={testimonial.id} lg={6} xl={3} md={6}>
              <Card
                ref={addToTestimonialRefs}
                className="testimonial-card border-0 shadow h-100"
              >
                <Card.Body className="p-4 d-flex flex-column">
                  {/* Header del testimonio */}
                  <div className="testimonial-header d-flex align-items-center mb-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="testimonial-avatar rounded-circle me-3"
                      width="50"
                      height="50"
                    />

                    <div>
                      <h6 className="testimonial-name fw-bold mb-1">
                        {testimonial.name}
                      </h6>
                      <small className="testimonial-role text-muted">
                        {testimonial.role}
                      </small>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="testimonial-rating mb-3">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Comentario */}
                  <blockquote className="testimonial-comment flex-grow-1">
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Proyecto relacionado */}
                  <div className="testimonial-project mt-3 pt-3 border-top">
                    <small className="text- fw-bold">
                      Proyecto: {testimonial.project}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Botón CTA */}
        <Row>
          <Col className="text-center">
            <Button
              ref={ctaRef}
              variant="primary"
              size="lg"
              className="cta-button"
              onClick={handleCTAClick}
            >
              Empezar mi proyecto
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProjectsTestimonialsSection;