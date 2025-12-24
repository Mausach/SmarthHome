import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from '../../../assets/SmartHome-logo-no-bck.png';
import "./Navbar.css";
import { useNavigate } from 'react-router-dom';

function Navbarsh() {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

     const navigate = useNavigate();

    const ir_Proyectos = () => {
        navigate('/proyectos')
    }

  // Efecto para cambiar el navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Manejar expansión del navbar
  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);

    // Agregar/remover clase al body
    if (newExpanded) {
      document.body.classList.add('navbar-expanded');
      document.documentElement.classList.add('navbar-expanded');
    } else {
      document.body.classList.remove('navbar-expanded');
      document.documentElement.classList.remove('navbar-expanded');
    }
  };

  const handleNavLinkClick = () => {
    if (window.innerWidth <= 992) {
      setExpanded(false);
      document.body.classList.remove('navbar-expanded');
      document.documentElement.classList.remove('navbar-expanded');
    }
  };

  const handleCTAClick = () => {
    if (window.gtag) {
      window.gtag('event', 'click', {
        'event_category': 'Navbar CTA',
        'event_label': 'Contacto desde Navbar'
      });
    }
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo%20smart', '_blank');
    handleNavLinkClick();
  };

  // Función para scroll suave a las secciones
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Cerrar navbar primero en móvil
      if (window.innerWidth <= 992) {
        setExpanded(false);
        document.body.classList.remove('navbar-expanded');
        document.documentElement.classList.remove('navbar-expanded');
      }

      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    }
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={handleToggle}
      className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}
      variant="dark"
    >
      <Container>
        {/* Logo y Brand */}
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <img
            className="logo-img me-2"
            src={Logo}
            alt="Logo SmartHome"
            width="50"
            height="50"
            loading="lazy"
          />
          <h3 className="welcome-text text-shadow text-light">
            Smart<span className="text-orange text-shadow">Home</span>
          </h3>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          aria-label="Toggle navigation"
          aria-expanded={expanded}
        />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              onClick={() => {
                scrollToSection('inicio');
                handleNavLinkClick();
              }}
              className="nav-link-custom me-3"
            >
              Inicio
            </Nav.Link>

            <Nav.Link
              onClick={() => {
                scrollToSection('serv');
                handleNavLinkClick();
              }}
              className="nav-link-custom me-3"
            >
              Servicios
            </Nav.Link>

            <Nav.Link
              onClick={() => {
                scrollToSection('testimonios');
                handleNavLinkClick();
              }}
              className="nav-link-custom me-3"
            >
              Testimonios
            </Nav.Link>

            <Nav.Link
              onClick={() => {
                scrollToSection('faq');
                handleNavLinkClick();
              }}
              className="nav-link-custom me-3"
            >
              Preguntas Frecuentes
            </Nav.Link>

            <Nav.Link
              onClick={() => {
                scrollToSection('footer');
                handleNavLinkClick();
              }}
              className="nav-link-custom me-3"
            >
              Encontranos
            </Nav.Link>

            <Nav.Link
              onClick={handleCTAClick}
              className="nav-cta-button ms-2"
            >
              Contacto
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarsh;