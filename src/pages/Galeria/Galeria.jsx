import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Galeria.css';
import Navbarsh_g from './Componentes/Navbar_Galery';

import ilu1 from '../../assets/cerradura2.webp';
import ilu2 from '../../assets/lu2.webp';
import ilu3 from '../../assets/cerradura-card.webp';
import ilu4 from '../../assets/pulserita.webp';

gsap.registerPlugin(ScrollTrigger);

export const Galeria = () => {
  const galeriaRef = useRef(null);
  const trianglesRef = useRef([]);
  const videoCardsRef = useRef([]);
  const modalRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Videos de TikTok
  const videos = [
    {
      id: 1,
      title: "Sistema de Cerradura Inteligente",
      description: "Seguridad 24/7 desde tu smartphone",
      url: "https://www.tiktok.com/@santiagoayala1339/video/7570388663075474706",
      thumbnail: ilu1
    },
    {
      id: 2,
      title: "Iluminación Automatizada",
      description: "Control total de luces",
      url: "https://www.tiktok.com/@santiagoayala1339/video/7578922648525081864?_r=1&_t=ZM-91ukjZPyRbQ",
      thumbnail: ilu2
    },
    {
      id: 3,
      title: "Cerraduras Inteligentes",
      description: "Acceso seguro sin llaves físicas",
      url: "https://www.tiktok.com/@santiagoayala1339/video/7558485603571027211?_r=1&_t=ZM-91ukjZPyRbQ",
      thumbnail: ilu3
    },
    {
      id: 4,
      title: "Sistema de Portón Inteligente",
      description: "Control total desde tu smartphone",
      url: "https://www.tiktok.com/@santiagoayala1339/video/7564843884761681170?_r=1&_t=ZM-91ukjZPyRbQ",
      thumbnail: ilu4
    },
   
  ];

  // Convertir URL de TikTok a embed URL
  const getEmbedUrl = (video) => {
    const match = video.url.match(/video\/(\d+)/);
    if (match) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
    return null;
  };

    // Función para el CTA
  const handleCTAClick = React.useCallback(() => {
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo%20smart', '_blank');
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación de triángulos flotantes
      trianglesRef.current.forEach((triangle, index) => {
        if (triangle) {
          gsap.to(triangle, {
            y: `${Math.random() * 50 - 25}`,
            x: `${Math.random() * 30 - 15}`,
            rotation: `${Math.random() * 360}`,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2
          });
        }
      });

      // Animación de entrada de las tarjetas
      videoCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              opacity: 0,
              y: 100,
              scale: 0.8
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }, galeriaRef);

    return () => ctx.revert();
  }, []);

  // Abrir modal con animación
  const openModal = (video) => {
    setSelectedVideo(video);
    
    // Animación de entrada del modal
    setTimeout(() => {
      if (modalRef.current) {
        gsap.fromTo(modalRef.current,
          { 
            opacity: 0,
            scale: 0.9
          },
          { 
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          }
        );

        const modalContent = modalRef.current.querySelector('.modal-content');
        if (modalContent) {
          gsap.fromTo(modalContent,
            { 
              y: 50,
              opacity: 0
            },
            { 
              y: 0,
              opacity: 1,
              duration: 0.5,
              delay: 0.1,
              ease: "power3.out"
            }
          );
        }
      }
    }, 10);

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  };

  // Cerrar modal con animación
  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setSelectedVideo(null);
          document.body.style.overflow = 'auto';
        }
      });
    }
  };

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedVideo) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo]);

  return (
    <section className="galeria-section" ref={galeriaRef}>
        <Navbarsh_g/>
      {/* Triángulos flotantes decorativos */}
      <div className="floating-triangles" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`triangle triangle-${i + 1}`}
            ref={el => trianglesRef.current[i] = el}
          />
        ))}
      </div>

      <div className="galeria-container">
        {/* Header de la galería */}
        <div className="galeria-header">
          <h1 className="galeria-title">
            Nuestros <span className="highlight">Proyectos</span>
          </h1>
          <p className="galeria-subtitle">
            Descubre cómo transformamos hogares en espacios inteligentes y seguros
          </p>
        </div>

        {/* Grid de videos */}
        <div className="video-grid">
          {videos.map((video, index) => (
            <article 
              key={video.id}
              className="video-col"
              ref={el => videoCardsRef.current[index] = el}
            >
              <div 
                className="video-card"
                onClick={() => openModal(video)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openModal(video);
                  }
                }}
              >
                <div className="video-container">
                  {/* Thumbnail */}
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="video-thumbnail"
                    loading="lazy"
                  />
                  
                  {/* Overlay con información */}
                  <div className="video-overlay">
                    <div className="video-info">
                      <h3 className="video-title">{video.title}</h3>
                      <p className="video-description">{video.description}</p>
                      
                      {/* Badge de TikTok */}
                      <div className="platform-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="platform-icon">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                        </svg>
                        <span>TikTok</span>
                      </div>
                    </div>
                    
                    {/* Botón de play */}
                    <button 
                      className="play-button"
                      aria-label="Reproducir video"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Indicador de WiFi */}
                  <div className="wifi-indicator" aria-hidden="true">
                    <div className="wifi-wave"></div>
                    <div className="wifi-wave"></div>
                    <div className="wifi-wave"></div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Call to action */}
        <div className="galeria-cta">
          <h2>¿Listo para transformar tu hogar?</h2>
          <p>Contactanos hoy y comienza tu proyecto de hogar inteligente</p>
          <button className="cta-button" onClick={handleCTAClick }>
            Solicitar Cotización
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal para reproducir videos */}
      {selectedVideo && (
        <div 
          className="video-modal" 
          ref={modalRef}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button 
            className="modal-close"
            onClick={closeModal}
            aria-label="Cerrar modal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="modal-title">{selectedVideo.title}</h2>
              <div className="platform-badge modal-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" className="platform-icon">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
                <span>TikTok</span>
              </div>
            </div>

            <div className="iframe-container">
              <iframe
                src={getEmbedUrl(selectedVideo)}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="modal-footer">
              <p>{selectedVideo.description}</p>
              <a 
                href={selectedVideo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="view-original-link"
              >
                Ver en TikTok
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};