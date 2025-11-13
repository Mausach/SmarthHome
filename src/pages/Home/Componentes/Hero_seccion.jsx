import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import ilus from '../../../assets/cerradura-pro.jpg';
import ilus3 from '../../../assets/cam-2.jpg';
import ilus2 from '../../../assets/luz-feliz.jpg';
import Navbarsh from './Navbar';

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const overlayRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const ctaRef = useRef();

  // Configuración de imágenes con contenido
  const imageConfig = [
    {
      src: ilus,
      alt: 'Imagen hero 1',
      title: "Controlá todo desde tu celular y viví con la tranquilidad que merecés",
      subtitle: "Un panel, infinitas posibilidades Control inteligente al alcance de la mano",
      ctaText: "Comenzar Ahora",
      textPosition: 'left' // Texto a la izquierda
    },
    {
      src: ilus2,
      alt: 'Imagen hero 2', 
      title: "Automatizar tu hogar ahora esta a tu alcance ",
      subtitle: "Descubre la experiencia única que tenemos para ti ",
      ctaText: "Descubrir Más",
      textPosition: 'right' // Texto a la derecha
    },
    {
      src: ilus3,
      alt: 'Imagen hero 3',
      title: "Convertí tu hogar en un espacio más seguro e inteligente",
      subtitle: "Tu seguridad es nuestra prioridad.",
      ctaText: "Saber Más",
      textPosition: 'left' // Texto a la izquierda
    }
  ];

  // Animaciones GSAP cuando cambia el slide
  useEffect(() => {
    // Resetear opacidades antes de la animación
    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
      opacity: 0,
      y: 30
    });

    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(ctaRef.current,
      { y: 20, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.3"
    );
  }, [index]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleCTAClick = () => {
    console.log("CTA clicked!");
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo smart', '_blank')
    // Tu acción para el botón CTA
  };

  const currentConfig = imageConfig[index];

  // Determinar la posición del texto según la configuración
  const getTextPositionClass = () => {
    return currentConfig.textPosition === 'right' ? 'text-right' : 'text-left';
  };

  return (
    <section className="hero-section">
      {/* Carrusel de React-Bootstrap con fade */}
      <Navbarsh/>
      <Carousel 
        activeIndex={index} 
        onSelect={handleSelect}
        fade={true}
        controls={false}
        indicators={false}
        interval={5000}
        pause={false}
        className="hero-carousel"
      >
        {imageConfig.map((image, idx) => (
          <Carousel.Item key={idx}>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={image.src}
                alt={image.alt}
              />
              {/* Overlay de gradiente para mejor legibilidad */}
              <div className="carousel-overlay"></div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Overlay con contenido */}
      <div ref={overlayRef} className="hero-overlay">
        <Container className="h-100">
          <Row className="h-100 align-items-center">
            <Col 
              lg={8} 
              xl={6} 
              className={`text-white ${getTextPositionClass()}`}
            >
              <h1 ref={titleRef} className="hero-title display-3 fw-bold mb-4">
                {currentConfig.title}
              </h1>
              <p ref={subtitleRef} className="hero-subtitle lead mb-5">
                {currentConfig.subtitle}
              </p>
              <div ref={ctaRef}>
                <Button 
                  variant="danger" 
                  size="lg" 
                  className="cta-button neon-button"
                  onClick={handleCTAClick}
                >
                  {currentConfig.ctaText}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Indicadores personalizados */}
      <div className="custom-indicators">
        {imageConfig.map((_, idx) => (
          <button
            key={idx}
            className={`custom-indicator ${index === idx ? 'active' : ''}`}
            onClick={() => handleSelect(idx)}
            aria-label={`Ir a slide ${idx + 1}`}
          >
            <span className="indicator-progress"></span>
          </button>
        ))}
      </div>

      {/* Controles de navegación personalizados */}
      <button 
        className="custom-control prev-control"
        onClick={() => handleSelect((index - 1 + imageConfig.length) % imageConfig.length)}
        aria-label="Slide anterior"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button 
        className="custom-control next-control"
        onClick={() => handleSelect((index + 1) % imageConfig.length)}
        aria-label="Slide siguiente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </section>
  );
};

export default HeroSection;