import React, { useRef, useEffect, useState } from 'react';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar ScrollTrigger de GSAP
gsap.registerPlugin(ScrollTrigger);

const FAQSection = () => {
  const sectionRef = useRef();
  const titleRef = useRef();
  const accordionRef = useRef();
  const [activeKey, setActiveKey] = useState('0');

  // Datos de las preguntas frecuentes
  const faqData = [
    {
      id: 1,
      question: "¿Cuánto tiempo toma instalar un sistema de hogar inteligente?",
      answer: "El tiempo de instalación varía según el proyecto. Para una casa promedio, la instalación completa toma entre 2-5 días. Sistemas básicos pueden instalarse en 1 día, mientras que proyectos más complejos pueden requerir hasta 1 semana.",
      icon: "bi-clock"
    },
    {
      id: 2,
      question: "¿Necesito tener conocimientos técnicos para usar el sistema?",
      answer: "No es necesario. Diseñamos nuestros sistemas para que sean intuitivos y fáciles de usar. Además, proporcionamos capacitación personalizada y soporte técnico continuo. La app móvil es muy user-friendly.",
      icon: "bi-person"
    },
    {
      id: 3,
      question: "¿Qué pasa si hay un corte de internet?",
      answer: "Nuestros sistemas tienen funcionalidades locales que continúan trabajando sin internet. Las cámaras graban localmente, las cerraduras funcionan con tarjetas/tokens físicos, y los sensores de seguridad mantienen su operación básica.",
      icon: "bi-wifi"
    },
    {
      id: 4,
      question: "¿Ofrecen garantía en sus instalaciones?",
      answer: "Sí, ofrecemos garantía de 1 años en todas nuestras instalaciones y equipos. Además, proporcionamos soporte técnico gratuito durante el primer año y mantenimiento preventivo cada 6 meses.",
      icon: "bi-shield-check"
    },
    {
      id: 5,
      question: "¿Puedo integrar dispositivos que ya tengo en mi hogar?",
      answer: "En la mayoría de los casos, sí. Realizamos una evaluación previa de compatibilidad. Sopertamos integración con dispositivos de marcas como Google Nest, Amazon Alexa, Philips Hue, y muchos más.",
      icon: "bi-puzzle"
    },
    {
      id: 6,
      question: "¿Qué medidas de seguridad tienen para proteger mis datos?",
      answer: "Implementamos encriptación end-to-end, autenticación de dos factores, y servidores seguros. Cumplimos con las normativas de protección de datos y nunca compartimos información con terceros.",
      icon: "bi-lock"
    },
    {
      id: 7,
      question: "¿Puedo expandir el sistema en el futuro?",
      answer: "Absolutamente. Nuestros sistemas son modulares y escalables. Puedes agregar más dispositivos, nuevas funcionalidades, o integrar tecnologías emergentes cuando lo desees.",
      icon: "bi-arrow-right-circle"
    },
    {
      id: 8,
      question: "¿Qué incluye el servicio de soporte postventa?",
      answer: "Incluye: asistencia telefónica 24/7, visitas técnicas programadas, actualizaciones de software, resolución remota de problemas, y reemplazo de equipos en garantía. También ofrecemos planes de mantenimiento premium.",
      icon: "bi-headset"
    }
  ];

  // Animaciones con GSAP
  useEffect(() => {
    // Animación del título
    gsap.fromTo(titleRef.current,
      {
        y: -50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación de los acordeones
    gsap.fromTo(accordionRef.current,
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: accordionRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación de items individuales cuando se abren
    const accordionItems = accordionRef.current?.querySelectorAll('.accordion-item');
    if (accordionItems) {
      accordionItems.forEach((item, index) => {
        gsap.fromTo(item,
          {
            x: index % 2 === 0 ? -30 : 30,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleAccordionToggle = (key) => {
    setActiveKey(key === activeKey ? null : key);
    
    // Animación suave al abrir/cerrar
    const accordionItem = document.querySelector(`#accordion-${key}`);
    if (accordionItem) {
      gsap.to(accordionItem, {
        scale: key === activeKey ? 1 : 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  //funcion cta
    const handleCTAClick = () => {
    console.log("CTA clicked!");
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo smart', '_blank')
    // Tu acción para el botón CTA
  };

  return (
    <section ref={sectionRef} className="faq-section py-5">
      <Container>
        {/* Título de la sección */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 ref={titleRef} className="display-4 fw-bold text-light mb-3">
              Preguntas Frecuentes
            </h2>
            <p className="lead text-light">
              Encuentra respuestas a las dudas más comunes sobre nuestros servicios
            </p>
          </Col>
        </Row>

        {/* Acordeón de FAQ */}
        <Row>
          <Col lg={10} className="mx-auto">
            <div ref={accordionRef}>
              <Accordion activeKey={activeKey} onSelect={handleAccordionToggle}>
                {faqData.map((faq, index) => (
                  <Accordion.Item 
                    key={faq.id}
                    eventKey={index.toString()}
                    className="faq-item mb-3 border-0"
                    id={`accordion-${index}`}
                  >
                    <Accordion.Header className="faq-header">
                      <div className="d-flex align-items-center w-100">
                        <i className={`${faq.icon} faq-icon me-3`}></i>
                        <span className="faq-question fw-semibold">
                          {faq.question}
                        </span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="faq-answer">
                      <div className="d-flex ">
                        <i className="bi bi-arrow-return-right  text-danger me-3 mt-1"></i>
                        <div>
                          {faq.answer}
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </Col>
        </Row>

        {/* Sección de contacto adicional */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto text-center">
            <div className="contact-cta p-4 rounded">
              <h4 className="fw-bold text-dark mb-3">
                ¿No encontraste lo que buscabas?
              </h4>
              <p className="text-muted mb-4">
                Nuestro equipo de expertos está listo para responder todas tus preguntas personalmente.
              </p>
              <button className="btn btn-primary btn-lg" onClick={handleCTAClick}>
                <i className="bi bi-chat-dots me-2"></i>
                Contactar con un Especialista
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FAQSection;