import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import ilus from '../../../assets/cerradura-pro.webp';
import ilus3 from '../../../assets/cam_hero.png';
import ilus2 from '../../../assets/luz-feliz.webp';
import ilus4 from '../../../assets/porton.png';
import Navbarsh from './Navbar';
import "./Hero_Section.css";

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const overlayRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const ctaRef = useRef();
  const navbarRef = useRef();

  // Configuración de imágenes con contenido y posición específica
  const imageConfig = [
    {
      id: 1,
      src: ilus,
      alt: 'Control desde celular - Panel inteligente al alcance de la mano',
      title: "Controlá todo desde tu celular y viví con la tranquilidad que merecés",
      subtitle: "Un panel, infinitas posibilidades Control inteligente al alcance de la mano",
      ctaText: "Contáctanos...",
      textPosition: 'left',
      responsiveObjectPosition: 'right',
      subtitleAlignment: 'normal' // default
    },
    {
      id: 2,
      src: ilus4,
      alt: 'Portones automáticos - Especialistas en automatización de garajes y accesos',
      title: "Especialistas en portones automáticos",
      subtitle: "Automatización, reparación y mantenimiento de motores para garajes y accesos. Tecnología confiable, instalación profesional",
      ctaText: "Hablar con un técnico",
      textPosition: 'right',
      responsiveObjectPosition: 'left', // CAMBIADO: ahora se alinea a la izquierda en responsive
      subtitleAlignment: 'adjusted' // Ajuste especial para alineación
    },
    {
      id: 3,
      src: ilus3,
      alt: 'Hogar seguro y moderno - Instalación profesional en Santiago del Estero',
      title: "Transformo tu casa en un hogar más seguro, moderno y cómodo",
      subtitle: "Instalación profesional, garantía real y soporte personalizado en Santiago del Estero.",
      ctaText: "Más informacion...",
      textPosition: 'left',
      responsiveObjectPosition: 'right',
      subtitleAlignment: 'normal'
    },
    {
      id: 4,
      src: ilus2,
      alt: 'Automatización del hogar - Experiencia única de domótica',
      title: "Automatizar tu hogar ahora esta a tu alcance",
      subtitle: "Descubre la experiencia única que tenemos para ti",
      ctaText: "Descubrí Como hacerlo",
      textPosition: 'right',
      responsiveObjectPosition: 'center',
      subtitleAlignment: 'adjusted' // Ajuste especial para alineación
    },
  ];

  // Efecto para manejar el resize de ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animaciones GSAP cuando cambia el slide
  useEffect(() => {
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
    if (window.gtag) {
      window.gtag('event', 'click', {
        'event_category': 'Hero CTA',
        'event_label': `Slide ${index + 1} - ${imageConfig[index].ctaText}`
      });
    }
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo%20smart', '_blank');
  };

  const currentConfig = imageConfig[index];

  // Determinar la posición del texto según la configuración
  const getTextPositionClass = () => {
    return currentConfig.textPosition === 'right' ? 'text-right' : 'text-left';
  };

  // Determinar clase responsiva para el texto
  const getResponsiveTextClass = () => {
    return windowWidth <= 768 ? 'text-center' : getTextPositionClass();
  };

  // Obtener clase CSS específica para la posición de la imagen actual
  const getImagePositionClass = () => {
    const baseClass = currentConfig.responsiveObjectPosition === 'center'
      ? 'image-center'
      : currentConfig.responsiveObjectPosition === 'right'
        ? 'image-right'
        : 'image-left';
    
    // Agregar clase específica por slide para control fino
    return `${baseClass} slide-${currentConfig.id}`;
  };

  // Clase especial para alinear subtítulos en slides 2 y 4
  const getSubtitleAlignmentClass = () => {
    return currentConfig.subtitleAlignment === 'adjusted' ? 'subtitle-adjusted' : '';
  };

  // NUEVA FUNCIÓN: Determinar alineación vertical según tamaño de pantalla
  const getVerticalAlignmentClass = () => {
    return windowWidth <= 768 ? 'align-items-end' : 'align-items-center';
  };

  return (
    <section className="hero-section" role="banner" aria-label="Carrusel principal">

      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        fade={true}
        controls={false}
        indicators={false}
        interval={5000}
        pause={false}
        className="hero-carousel"
        role="region"
        aria-label="Carrusel de imágenes"
      >
        {imageConfig.map((image, idx) => (
          <Carousel.Item key={image.id}>
            <div className="carousel-image-container">
              <img
                className={`carousel-image ${getImagePositionClass()}`}
                src={image.src}
                alt={image.alt}
                loading={idx === 0 ? "eager" : "lazy"}
                width="1920"
                height="1080"
                {...(idx === 0 && {
                  'data-priority': 'high'
                })}
              />
              <div className="carousel-overlay"></div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <div ref={overlayRef} className="hero-overlay">
        <Container className="h-100">
          <Row className={`h-100 ${getVerticalAlignmentClass()}`}>
            <Col
              lg={8}
              xl={6}
              className={`text-white ${getResponsiveTextClass()} responsive-content-col`}
            >
              <h1 ref={titleRef} className="hero-title display-3 fw-bold mb-4">
                {currentConfig.title}
              </h1>
              <p ref={subtitleRef} className={`hero-subtitle lead mb-5 ${getSubtitleAlignmentClass()}`}>
                {currentConfig.subtitle}
              </p>
              <div ref={ctaRef} className="responsive-cta-container">
                <Button
                  variant="danger"
                  size="lg"
                  className="cta-button neon-button"
                  onClick={handleCTAClick}
                  aria-label={currentConfig.ctaText}
                >
                  {currentConfig.ctaText}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="custom-indicators" role="tablist" aria-label="Slides del carrusel">
        {imageConfig.map((image, idx) => (
          <button
            key={image.id}
            className={`custom-indicator ${index === idx ? 'active' : ''}`}
            onClick={() => handleSelect(idx)}
            aria-label={`Ir a slide ${idx + 1}: ${image.title.substring(0, 30)}...`}
            aria-selected={index === idx}
            role="tab"
            tabIndex={0}
          >
            <span className="indicator-progress"></span>
          </button>
        ))}
      </div>

      <button
        className="custom-control prev-control"
        onClick={() => handleSelect((index - 1 + imageConfig.length) % imageConfig.length)}
        aria-label="Slide anterior"
        aria-controls="carousel-content"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        className="custom-control next-control"
        onClick={() => handleSelect((index + 1) % imageConfig.length)}
        aria-label="Slide siguiente"
        aria-controls="carousel-content"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
};

export default HeroSection;