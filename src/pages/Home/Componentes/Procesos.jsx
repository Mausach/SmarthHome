import React, { useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar ScrollTrigger de GSAP
gsap.registerPlugin(ScrollTrigger);

const ProcessSection = () => {
  const sectionRef = useRef();
  const stepsRef = useRef([]);
  const lineRef = useRef();

  // Datos de los pasos del proceso
  const processSteps = [
    {
      id: 1,
      icon: 'bi-chat-dots',
      title: 'Asesoramiento Personalizado',
      description: 'Analizamos tus necesidades y te brindamos la mejor solución personalizada para tu hogar inteligente.',
      color: '#007bff'
    },
    {
      id: 2,
      icon: 'bi-lightbulb',
      title: 'Plan de Automatización',
      description: 'Diseñamos un plan específico según tus requerimientos y presupuesto.',
      color: '#28a745'
    },
    {
      id: 3,
      icon: 'bi-tools',
      title: 'Instalación Profesional',
      description: 'Nuestro equipo técnico realiza la instalación y configuración de todos los dispositivos.',
      color: '#ffc107'
    },
    {
      id: 4,
      icon: 'bi-headset',
      title: 'Soporte Postventa',
      description: 'Te acompañamos con soporte continuo y actualizaciones del sistema o mantenimiento, sumado a nuestra garantia.',
      color: '#dc3545'
    }
  ];

  // Animaciones con GSAP
  useEffect(() => {
    // Animación de la línea de tiempo
    gsap.fromTo(lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación de los pasos
    stepsRef.current.forEach((step, index) => {
      if (!step) return;

      gsap.fromTo(step,
        {
          y: 50,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animación del icono
      const icon = step.querySelector('.process-icon');
      gsap.fromTo(icon,
        { rotation: -180, scale: 0 },
        {
          rotation: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.2 + 0.3,
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToStepsRefs = (el) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="process-section py-5">
      <Container>
        {/* Título de la sección */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="display-4 fw-bold text-light mb-3">
              Nuestro Proceso de Trabajo
            </h2>
            <p className="lead text-light">
              Te acompañamos en cada paso para transformar tu hogar en un espacio inteligente
            </p>
          </Col>
        </Row>

        {/* Timeline horizontal */}
        <div className="process-timeline position-relative">
          {/* Línea de tiempo */}
          <div 
            ref={lineRef}
            className="process-line position-absolute"
            style={{
              top: '100px',
              left: '10%',
              right: '10%',
              height: '4px',
              backgroundColor: '#dee2e6',
              transformOrigin: 'left center'
            }}
          ></div>

          <Row className="align-items-start">
            {processSteps.map((step, index) => (
              <Col 
                key={step.id}
                lg={3} 
                md={6} 
                className="text-center"
              >
                <div 
                  ref={addToStepsRefs}
                  className="process-step position-relative"
                >
                  {/* Círculo del paso */}
                  <div 
                    className="process-circle mx-auto mb-4 position-relative"
                    style={{ 
                      width: '80px', 
                      height: '80px',
                      backgroundColor: step.color,
                      zIndex: 2
                    }}
                  >
                    <i 
                      className={`process-icon ${step.icon}`}
                      style={{ 
                        fontSize: '2rem',
                        color: 'white'
                      }}
                    ></i>
                    
                    {/* Número del paso */}
                    <div 
                      className="process-number position-absolute"
                      style={{
                        top: '-10px',
                        right: '-10px',
                        width: '30px',
                        height: '30px',
                        backgroundColor: step.color,
                        borderRadius: '50%',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid white'
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Contenido del paso */}
                  <div className="process-content">
                    <h4 
                      className="process-title fw-bold mb-3"
                      style={{ color: step.color }}
                    >
                      {step.title}
                    </h4>
                    <p className="process-description text-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Línea de conexión móvil (para responsive) */}
        <div className="process-line-mobile d-none">
          <div className="line-connector"></div>
        </div>
      </Container>
    </section>
  );
};

export default ProcessSection;