import React, { useRef, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import "./Testimonios.css";

// Importar imágenes optimizadas
import us1 from '../../../assets/us1.png';
import us2 from '../../../assets/us2.png';
import us3 from '../../../assets/us5.png';
import us4 from '../../../assets/us4.png';

// Registrar ScrollTrigger de GSAP solo en cliente
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TestimoniosSection = () => {
  const sectionRef = useRef();
  const testimonialCardsRef = useRef([]);
  const ctaRef = useRef();

  // Datos de testimonios optimizados para SEO
  const testimonialsData = useMemo(() => [
    {
      id: 1,
      name: "María González",
      role: "Propietaria Casa Moderna",
      image: us3,
      rating: 5,
      comment: "Increíble servicio! Mi casa ahora es completamente inteligente y segura. La atención postventa es excepcional.",
      project: "Automatización de hogar",
      projectImage: us1
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Propietario de Casa",
      image: us3,
      rating: 5,
      comment: "Profesionalismo total. Implementaron nuestro sistema de seguridad en tiempo récord.",
      project: "Sistema de seguridad Domótica",
      projectImage: us2
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Propietaria de Departamento",
      image: us3,
      rating: 5,
      comment: "La mejor inversión para mi departamento. Controlar todo desde el celular cambió mi calidad de vida.",
      project: "Departamento Automatizado",
      projectImage: us4
    },
    {
      id: 4,
      name: "Roberto Silva",
      role: "Administrador de Edificio",
      image: us3,
      rating: 5,
      comment: "Sistema impecable para nuestro edificio. Los residentes están muy satisfechos con la seguridad.",
      project: "Edificio Residencial",
      projectImage: us1
    },
    // Nuevos testimonios con imagen en lugar de texto
    {
      id: 5,
      name: "Laura Fernández",
      role: "Propietaria de Vivienda",
      image: us2,
      rating: 5,
      project: "Casa Inteligente Completa",
      projectImage: us1,
      type: "image"
    },
    {
      id: 6,
      name: "Javier López",
      role: "Empresario",
      image: us4,
      rating: 5,
      project: "Oficina Automatizada",
      projectImage: us2,
      type: "image"
    },
    {
      id: 7,
      name: "Carmen Ruiz",
      role: "Arquitecta",
      image: us1,
      rating: 5,
      project: "Departamento de Lujo",
      projectImage: us3,
      type: "image"
    },
    {
      id: 8,
      name: "Diego Sánchez",
      role: "Inversionista",
      image: us4,
      rating: 5,
      project: "Edificio Corporativo",
      projectImage: us4,
      type: "image"
    }
  ], []);

  // Animaciones optimizadas con GSAP
  useEffect(() => {
    // Solo ejecutar animaciones en cliente
    if (typeof window === 'undefined') return;

    // Animación de las cards de testimonios
    testimonialCardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(card,
        {
          y: 50,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: index * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
            once: true // Solo animar una vez
          }
        }
      );
    });

    // Animación del botón CTA
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            once: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Función para manejar referencias de testimonios
  const addToTestimonialRefs = React.useCallback((el) => {
    if (el && !testimonialCardsRef.current.includes(el)) {
      testimonialCardsRef.current.push(el);
    }
  }, []);

  // Función para el CTA
  const handleCTAClick = React.useCallback(() => {
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo%20smart', '_blank');
  }, []);

  // Función para renderizar estrellas
  const renderStars = React.useCallback((rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
        aria-label={`${rating} de 5 estrellas`}
      />
    ));
  }, []);

  return (
    <section ref={sectionRef} className="testimonios-section py-5" aria-label="Testimonios de clientes">
      <Container>
        {/* Título de la sección */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-5 fw-bold text-white mb-3">
              Lo que dicen nuestros clientes
            </h1>
            <p className="lead text-white">
              Experiencias reales de quienes han transformado sus espacios con nuestra tecnología
            </p>
          </Col>
        </Row>

        {/* Testimonios tradicionales (con texto) */}
        <Row className="mb-5">
          <Col>
            <h2 className="section-subtitle text-center mb-4">Testimonios de confianza</h2>
          </Col>
        </Row>
        
        <Row className="g-4 mb-5">
          {testimonialsData.slice(0, 4).map((testimonial) => (
            <Col key={testimonial.id} lg={6} xl={3} md={6} className="mb-4">
              <article
                ref={addToTestimonialRefs}
                className="testimonial-card border-0 shadow h-100 d-flex flex-column"
                itemScope
                itemType="https://schema.org/Review"
              >
                <Card.Body className="p-4 d-flex flex-column flex-grow-1">
                  {/* Header del testimonio */}
                  <div className="testimonial-header d-flex align-items-center mb-3">
                    <img
                      src={testimonial.image}
                      alt={`Foto de ${testimonial.name}`}
                      className="testimonial-avatar rounded-circle me-3"
                      width="60"
                      height="60"
                      loading="lazy"
                      itemProp="image"
                    />
                    <div>
                      <h3 className="testimonial-name fw-bold mb-1 h6" itemProp="author">
                        {testimonial.name}
                      </h3>
                      <small className="testimonial-role text-muted" itemProp="description">
                        {testimonial.role}
                      </small>
                    </div>
                  </div>

                  {/* Rating con schema.org */}
                  <div 
                    className="testimonial-rating mb-3" 
                    itemProp="reviewRating" 
                    itemScope 
                    itemType="https://schema.org/Rating"
                  >
                    <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                    <meta itemProp="bestRating" content="5" />
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Comentario */}
                  <blockquote 
                    className="testimonial-comment flex-grow-1 mb-3"
                    itemProp="reviewBody"
                  >
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Proyecto relacionado */}
                  <div className="testimonial-project mt-auto pt-3 border-top">
                    <small className="text-dark fw-bold">
                      Proyecto: <span itemProp="name">{testimonial.project}</span>
                    </small>
                  </div>
                </Card.Body>
              </article>
            </Col>
          ))}
        </Row>

        {/* Nueva sección de testimonios con imágenes */}
        <Row className="mb-5">
          <Col>
            <h2 className="section-subtitle text-center mb-4">Proyectos destacados</h2>
          </Col>
        </Row>
        
        <Row className="g-4 mb-5">
          {testimonialsData.slice(4).map((testimonial) => (
            <Col key={testimonial.id} lg={6} xl={3} md={6} className="mb-4">
              <article
                ref={addToTestimonialRefs}
                className="testimonial-image-card border-0 shadow h-100"
                itemScope
                itemType="https://schema.org/Review"
              >
                <Card.Body className="p-4 d-flex flex-column">
                  {/* Header del testimonio */}
                  <div className="testimonial-header d-flex align-items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={`Foto de ${testimonial.name}`}
                      className="testimonial-avatar rounded-circle me-3"
                      width="60"
                      height="60"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="testimonial-name fw-bold mb-1 h6" itemProp="author">
                        {testimonial.name}
                      </h3>
                      <small className="testimonial-role text-muted">
                        {testimonial.role}
                      </small>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="testimonial-rating mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Imagen del proyecto en lugar de texto */}
                  <div className="testimonial-image-container mb-4">
                    <img
                      src={testimonial.projectImage}
                      alt={`Proyecto: ${testimonial.project}`}
                      className="testimonial-project-image w-100 rounded"
                      loading="lazy"
                      itemProp="image"
                    />
                  </div>

                  {/* Nombre del proyecto */}
                  <div className="testimonial-project-name text-center mt-auto">
                    <h4 className="h5 fw-bold text-dark mb-0" itemProp="name">
                      {testimonial.project}
                    </h4>
                  </div>
                </Card.Body>
              </article>
            </Col>
          ))}
        </Row>

        {/* Botón CTA optimizado */}
        <Row>
          <Col className="text-center">
            <Button
              ref={ctaRef}
              variant="primary"
              size="lg"
              className="cta-button"
              onClick={handleCTAClick}
              aria-label="Empezar mi proyecto de domótica"
            >
              Empezar mi proyecto
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

// Componente optimizado con React.memo
export default React.memo(TestimoniosSection);