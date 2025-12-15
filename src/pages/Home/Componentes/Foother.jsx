import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button, Accordion } from 'react-bootstrap';
import Logo from '../../../assets/SmartHome-logo-no-bck.png';
import swal from 'sweetalert2';
import "./Foother.css";

export const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  const ir_404 = (e) => {
    e.preventDefault();
    swal("Error 404", "Página destino no encontrada", "error");
  }

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCTAClick = () => {
    console.log("CTA clicked!");
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo smart', '_blank')
  };

  // Detectar si es dispositivo móvil/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Navegación principal (siempre visible)
  const mainNavigation = [
    { id: 'inicio', label: 'Inicio', icon: 'bi-house' },
    { id: 'servicios', label: 'Servicios', icon: 'bi-briefcase' },
    { id: 'faq', label: 'Preguntas Frecuentes', icon: 'bi-question-circle' }
  ];

  // Navegación adicional (solo visible en desktop)
  const additionalNavigation = [
    { id: 'nosotros', label: 'Nosotros', icon: 'bi-people' },
    { id: 'proyectos', label: 'Proyectos', icon: 'bi-images' },
    { id: 'proceso', label: 'Cómo Trabajamos', icon: 'bi-gear' }
  ];

  return (
    <footer className='footer-custom py-5 text-white'>
      <Container>
        <Row className="g-4">
          {/* Columna 1: Logo y Descripción */}
          <Col lg={3} md={6} className="mb-4">
            <div className="footer-brand">
              <img 
                className="footer-logo mb-3" 
                src={Logo} 
                alt="Logo SmartHome Solutions" 
              />
              <h5 className="brand-name mb-3">SmartHome Solutions</h5>
              <p className="footer-description">
                Transformamos tu hogar en un espacio inteligente, seguro y eficiente. 
                Más de 5 años creando soluciones personalizadas para familias y empresas.
              </p>
              
              <Button
                variant="outline-light"
                className="rounded-pill mt-2"
                size="sm"
                onClick={handleCTAClick}>
                <i className="bi bi-whatsapp me-2"></i>
                Contáctanos
              </Button>
            </div>
          </Col>

          {/* Columna 2: Navegación */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-title mb-4">Navegación</h5>
            
            {/* Navegación principal - siempre visible */}
            <Nav className="flex-column">
              {mainNavigation.map((item) => (
                <Nav.Link 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className="footer-link"
                >
                  <i className={`${item.icon} me-2`}></i>
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>

            {/* Navegación adicional para desktop */}
            {!isMobile && additionalNavigation.length > 0 && (
              <div className="mt-3">
                <Nav className="flex-column">
                  {additionalNavigation.map((item) => (
                    <Nav.Link 
                      key={item.id}
                      onClick={() => scrollToSection(item.id)} 
                      className="footer-link"
                    >
                      <i className={`${item.icon} me-2`}></i>
                      {item.label}
                    </Nav.Link>
                  ))}
                </Nav>
              </div>
            )}
          </Col>

          {/* Columna 3: Contacto */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-title mb-4">Contacto</h5>
            <div className="contact-info">
              <div className="contact-item mb-3">
                <i className="bi bi-geo-alt text-danger me-3"></i>
                <div>
                  <strong>Ubicación</strong>
                  <p className="mb-0 small">Patagonia 695, Santiago del Estero, Argentina</p>
                </div>
              </div>
              
              <div className="contact-item mb-3">
                <i className="bi bi-telephone text-danger me-3"></i>
                <div>
                  <strong>Teléfono</strong>
                  <p className="mb-0 small">+54 9 385 417-8021</p>
                </div>
              </div>
              
              <div className="contact-item mb-3">
                <i className="bi bi-envelope text-danger me-3"></i>
                <div>
                  <strong>Email</strong>
                  <p className="mb-0 small">info@smarthomesolutions.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <i className="bi bi-clock text-danger me-3"></i>
                <div>
                  <strong>Horarios</strong>
                  <p className="mb-0 small">Lun-Vie: 8:00 - 18:00</p>
                  <p className="mb-0 small">Sáb: 9:00 - 13:00</p>
                </div>
              </div>
            </div>
          </Col>

          {/* Columna 4: Redes Sociales */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-title mb-4">Síguenos</h5>
            <p className="footer-description mb-4">
              Mantente conectado con nosotros a través de nuestras redes sociales.
            </p>
            
            <div className="social-links">
              <div className="social-grid">
                <a 
                  href="https://www.instagram.com/smarthome_sgo/"
                  className="social-link instagram"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-instagram"></i>
                  <span>Instagram</span>
                </a>
                
                <a 
                  href="https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo smart'" 
                  className="social-link whatsapp"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-whatsapp"></i>
                  <span>WhatsApp</span>
                </a>
                
                <a 
                  href="https://www.facebook.com/JULIOSANTIAGOAYALA" 
                  className="social-link facebook"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-facebook"></i>
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Línea separadora */}
        <hr className="footer-divider" />
        
        {/* Copyright */}
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0">
              &copy; 2025 <strong>SmartHome Solutions</strong>. Todos los derechos reservados.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="footer-legal-links">
              <a href="#politica-privacidad" onClick={ir_404}>Política de Privacidad</a>
              <span className="mx-2">•</span>
              <a href="#terminos-servicio" onClick={ir_404}>Términos de Servicio</a>
              <span className="mx-2">•</span>
              <a href="#aviso-legal" onClick={ir_404}>Aviso Legal</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}