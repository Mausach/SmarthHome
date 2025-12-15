import React, { useRef, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import "./Testimonios.css";

// Importar imágenes optimizadas
import us5 from '../../../assets/prub.png';
import us6 from '../../../assets/prub2.png';
import us7 from '../../../assets/prub3.png';
import us8 from '../../../assets/prub4.png';
import { useNavigate } from 'react-router-dom';

// Registrar ScrollTrigger de GSAP solo en cliente
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TestimoniosSection = () => {
  const sectionRef = useRef();
  const testimonialCardsRef = useRef([]);
  const ctaRef = useRef();


  const navigate = useNavigate();

  const ir_Proyectos = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    navigate('/proyectos')
  }



  // Datos de testimonios optimizados para SEO - SOLO 4 TESTIMONIOS
  const testimonialsData = useMemo(() => [
    {
      id: 1,
      name: "María Gay de Castellanos",
      role: "Propietaria Casa Moderna",
      image: us5,
      rating: 5,
      comment: "Son Excelentes, trabajaron en un porton de mi casa. GRACIAS GENIOS. Muy recomendables",
      project: "Kit Completo de Portón Inteligente"
    },
    {
      id: 2,
      name: "Jorge Haick",
      role: "Propietario de Casa",
      image: us6,
      rating: 5,
      comment: "Todo quedo perfecto, la verdad laburaron a full con mi porton que tenia varias mañas pero quedo perfecto. Asi que muy agradecido y los recomiendo al 100%",
      project: "Kit Completo de Portón Inteligente"
    },
    {
      id: 3,
      name: "Lorena Cortez",
      role: "Propietaria de Departamento",
      image: us7,
      rating: 5,
      comment: "Hola muy buen dia.Encantada de contratarlos. Me transmitieron confianza y seguridad. Ya los recomendé con varias personas. Gracias por la disposición",
      project: " Reparación del motor del portón corredizo y reubicación del motor"
    },
    {
      id: 4,
      name: "Gabriel Baliani ",
      role: "Administrador de Edificio",
      image: us8,
      rating: 5,
      comment: "Buenas! costo que vengan la primera vez pero me imagino que estan muy ocupados, cuando llegaron hicieron todo bien y rapido y a de mas el soporte me resolvio un problema dias despues de la mejor manera. EXCELENTE SERVICIO",
      project: "Kit Completo de Portón Inteligente"
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
          {testimonialsData.map((testimonial) => (
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

        {/* Botón CTA optimizado */}
        <Row>
          <Col className="text-center">
            <Button
              ref={ctaRef}
              variant="primary"
              size="lg"
              className="cta-button"
              onClick={ir_Proyectos}
              aria-label="Empezar mi proyecto de domótica"
            >
              Ver la galeria de trabajos
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

// Componente optimizado con React.memo
export default React.memo(TestimoniosSection);