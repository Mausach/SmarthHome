import React, { useRef, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ilus from '../../../assets/coloca_foco.jpg';
import ilus2 from '../../../assets/dos-compas.jpg';
import ilus3 from '../../../assets/trabajando.jpg';

// Registrar ScrollTrigger de GSAP
gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef();
  const textContentRef = useRef();
  const mosaicRef = useRef();
  const statsRef = useRef([]);

  // Datos del equipo para el mosaico
  const teamPhotos = [
    {
      id: 1,
      image: ilus, // Reemplaza con tus imágenes
      alt: 'Fundador de la empresa',
      orientation: 'vertical'
    },
    {
      id: 2,
      image: ilus2,
      alt: 'Equipo técnico trabajando',
      orientation: 'horizontal'
    },
    {
      id: 3,
      image: ilus3,
      alt: 'Especialista en instalación',
      orientation: 'vertical'
    }
  ];

  // Estadísticas
  const statsData = [
    {
      id: 1,
      number: '100+',
      label: 'Proyectos Completados',
      icon: 'bi-briefcase'
    },
    {
      id: 2,
      number: '95%',
      label: 'Clientes Satisfechos',
      icon: 'bi-emoji-smile'
    },
    {
      id: 3,
      number: '+'+'3',
      label: ' +3 Años de Experiencia',
      icon: 'bi-award'
    },
    {
      id: 4,
      number: '24/7',
      label: 'Soporte Técnico 24 hs',
      icon: 'bi-headset'
    }
  ];

  // Animaciones con GSAP
  useEffect(() => {
    // Animación del contenido de texto
    gsap.fromTo(textContentRef.current,
      {
        x: -100,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textContentRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación del mosaico
    gsap.fromTo(mosaicRef.current,
      {
        x: 100,
        opacity: 0,
        scale: 0.9
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        delay: 0.3,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: mosaicRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación de las estadísticas
    statsRef.current.forEach((stat, index) => {
      if (!stat) return;

      const number = stat.querySelector('.stat-number');
      const icon = stat.querySelector('.stat-icon');

      // Animación del número (contador)
      gsap.fromTo(number,
        { innerText: 0 },
        {
          innerText: statsData[index].number.replace('+', '').replace('%', ''),
          duration: 2,
          delay: index * 0.2 + 0.5,
          snap: { innerText: 1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animación del icono
      gsap.fromTo(icon,
        {
          scale: 0,
          rotation: -180
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          delay: index * 0.2 + 0.3,
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToStatsRefs = (el) => {
    if (el && !statsRef.current.includes(el)) {
      statsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="about-section py-5">
      <Container>
        <Row className="align-items-center">
          {/* Columna de texto - Izquierda */}
          <Col lg={6} className="mb-5 mb-lg-0">
            <div ref={textContentRef} className="about-content">
              <h2 className="display-4 fw-bold text-light  mb-4">
                Transformamos Hogares en Espacios Seguros e Inteligentes
              </h2>
              
              <p className="lead text-light mb-4">
                En <strong className='text-danger'>SmartHome </strong>, nos apasiona crear entornos más seguros, 
                eficientes y confortables para tu día a día.
              </p>

              <div className="about-description">
                <p className="mb-3">
                  Con más de 3 años de experiencia en el sector, hemos desarrollado 
                  soluciones personalizadas que se adaptan a las necesidades específicas 
                  de cada cliente. Nuestro equipo de expertos combina tecnología de 
                  vanguardia con un servicio al cliente excepcional.
                </p>
                
                <p className="mb-4">
                  Creemos que la tecnología debe simplificar la vida y brindar seguridad. 
                  Por eso, nos encargamos de todo el proceso: desde el asesoramiento 
                  inicial hasta la instalación y el soporte continuo.
                </p>
              </div>

              {/* Frase CTA suave */}
              <div className="soft-cta mb-5">
                <div className="cta-text p-4 rounded">
                  <h5 className="fw-bold text-danger mb-2">
                    ¿Listo para dar el siguiente paso?
                  </h5>
                  <p className="mb-0 text-muted">
                    Únete a los cientos de familias que ya disfrutan de un hogar inteligente 
                    y seguro con nuestra tecnología.
                  </p>
                </div>
              </div>

              {/* Estadísticas */}
              <Row className="stats-section">
                {statsData.map((stat, index) => (
                  <Col key={stat.id} sm={6} className="mb-4">
                    <div 
                      ref={addToStatsRefs}
                      className="stat-item text-center"
                    >
                      <div className="stat-icon-wrapper mb-2">
                        <i className={`stat-icon ${stat.icon}`}></i>
                      </div>
                      <h3 className="stat-number fw-bold text-light mb-1">
                        {stat.number}
                      </h3>
                      <p className="stat-label text-light mb-0">
                        {stat.label}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          {/* Columna del mosaico - Derecha */}
          <Col lg={6}>
            <div ref={mosaicRef} className="mosaic-container">
              <Row className="g-3">
                {/* Card vertical superior izquierda */}
                <Col md={6}>
                  <Card className="mosaic-card vertical-card border-0 shadow">
                    <Card.Img 
                      variant="top"
                      src={teamPhotos[0].image}
                      alt={teamPhotos[0].alt}
                      className="mosaic-image"
                    />
                  </Card>
                </Col>

                {/* Card horizontal que ocupa todo el ancho abajo */}
                <Col md={12}>
                  <Card className="mosaic-card horizontal-card border-0 shadow">
                    <Card.Img 
                      variant="top"
                      src={teamPhotos[1].image}
                      alt={teamPhotos[1].alt}
                      className="mosaic-image"
                    />
                  </Card>
                </Col>

                {/* Card vertical inferior derecha */}
                <Col md={6} className="ms-auto">
                  <Card className="mosaic-card vertical-card border-0 shadow">
                    <Card.Img 
                      variant="top"
                      src={teamPhotos[2].image}
                      alt={teamPhotos[2].alt}
                      className="mosaic-image"
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;