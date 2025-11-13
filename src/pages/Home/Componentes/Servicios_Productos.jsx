import React, { useRef, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ilus from '../../../assets/cam-solita.jpg';
import ilus2 from '../../../assets/luz.jpg';
import ilus4 from '../../../assets/pulserita.jpg';
import ilus3 from '../../../assets/artefacts.jpg';

// Registrar ScrollTrigger de GSAP
gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef();
  const cardsRef = useRef([]);

  // Datos de los servicios/productos
  const servicesData = [
    {
      id: 1,
      image: ilus, // Reemplaza con tus imágenes
      title: "Sistema de Seguridad Inteligente",
      description: "Protege tu hogar con nuestra tecnología de vanguardia. Monitoreo 24/7, alertas instantáneas y control remoto desde tu smartphone.",
      features: ["Monitoreo 24/7", "Control remoto", "Alertas instantáneas"]
    },
    {
      id: 2,
      image: ilus2,
      title: "Automatización del Hogar",
      description: "Convierte tu casa en un espacio inteligente. Controla iluminación, temperatura y electrodomésticos con un solo click.",
      features: ["Control de iluminación", "Gestión de temperatura", "Automación de electrodomésticos"]
    },
    {
      id: 3,
      image: ilus3,
      title: "Cámaras de Vigilancia",
      description: "Vigila tu propiedad desde cualquier lugar. Video en alta definición, visión nocturna y sensores de movimiento.",
      features: ["Alta definición", "Iluminacion", "Sensores de movimiento"]
    },
    {
      id: 4,
      image: ilus4,
      title: "Control de Acceso",
      description: "Gestiona quién entra y sale de tu propiedad. Cerraduras inteligentes, abrepuertas automáticos y más.",
      features: ["Cerraduras inteligentes", "Control de acceso", "Cerraduras inteligentes para garajes"]
    }
  ];

    //funcion cta
    const handleCTAClick = () => {
    console.log("CTA clicked!");
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo smart', '_blank')
    // Tu acción para el botón CTA
  };

  // Animaciones con GSAP
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const image = card.querySelector('.service-image');
      const content = card.querySelector('.service-content');

      gsap.fromTo(image,
        {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          scale: 0.8
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(content,
        {
          x: index % 2 === 0 ? 100 : -100,
          opacity: 0,
          y: 50
        },
        {
          x: 0,
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="services-section py-5">
      <Container>
        {/* Título de la sección */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="display-4 fw-bold text-light mb-3">
              Nuestros Servicios
            </h2>
            <p className="lead text-light">
              Descubre nuestra gama de soluciones inteligentes para tu hogar
            </p>
          </Col>
        </Row>

        {/* Cards de servicios */}
        {servicesData.map((service, index) => (
          <Row 
            key={service.id}
            ref={addToRefs}
            className={`service-card align-items-center mb-5 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
          >
            {/* Columna de la imagen */}
            <Col lg={6} className="mb-4 mb-lg-0">
              <Card className="service-image-card border-0 shadow-lg h-100">
                <Card.Img 
                  variant="top"
                  src={service.image}
                  alt={service.title}
                  className="service-image"
                  style={{ 
                    height: '400px', 
                    objectFit: 'cover',
                    borderRadius: '15px'
                  }}
                />
              </Card>
            </Col>

            {/* Columna del contenido */}
            <Col lg={6}>
              <div className="service-content h-100 d-flex flex-column justify-content-center">
                <h3 className="service-title fw-bold mb-4">
                  {service.title}
                </h3>
                <p className="service-description lead mb-4">
                  {service.description}
                </p>
                
                {/* Lista de características */}
                <ul className="service-features list-unstyled">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="mb-2">
                      <i className="fas fa-check-circle text-primary me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Botón de acción */}
                <div className="service-actions mt-4">
                  <button className="btn btn-primary btn-lg" onClick={handleCTAClick}>
                    Más Información
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </section>
  );
};

export default ServicesSection;