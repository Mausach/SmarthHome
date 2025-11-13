import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from '../../../assets/Logo.jpg';

function Navbarsh() {
  const [scrolled, setScrolled] = useState(false);

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

  //funcion cta
    const handleCTAClick = () => {
    console.log("CTA clicked!");
    window.open('https://wa.me/5493855724629?text=Hola,%20me%20interesa%20saber%20más%20sobre%20el%20lo smart', '_blank')
    // Tu acción para el botón CTA
  };

  // Función para scroll suave a las secciones
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Navbar 
      collapseOnSelect 
      expand="lg" 
      fixed="top"
      className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}
      variant="dark"
    >
      <Container>
        {/* Logo y Brand */}
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <img 
            className="logo-img me-2" 
            src={Logo} 
            alt="Logo" 
            style={{ width: '50px', height: 'auto' }}
          />
          <h3 className="welcome-text text-shadow text-light">Smart
                <span className="text-danger text-shadow">Home</span>
              </h3>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              onClick={() => scrollToSection('inicio')} 
              className="nav-link-custom me-3"
            >
              Inicio
            </Nav.Link>

            <Nav.Link 
              onClick={() => scrollToSection('serv')} 
              className="nav-link-custom me-3"
            >
              Servicios
            </Nav.Link>

            <Nav.Link 
              onClick={() => scrollToSection('faq')} 
              className="nav-link-custom me-3"
            >
              Preguntas Frecuentes
            </Nav.Link>

            <NavDropdown 
              title="¿Quienes somos?" 
              id="navbarScrollingDropdown" 
              className="nav-dropdown-custom me-3"
            >
              <NavDropdown.Item 
                onClick={() => scrollToSection('nosotros')}
                className="dropdown-item-custom"
              >
                Sobre Nosotros
              </NavDropdown.Item>
                <NavDropdown.Item 
                onClick={() => scrollToSection('procesos')}
                className="dropdown-item-custom"
              >
                Nuestro proceso de trabajo
              </NavDropdown.Item>
              <NavDropdown.Item 
                onClick={() => scrollToSection('proyectos')}
                className="dropdown-item-custom"
              >
                Proyectos realizados
              </NavDropdown.Item>
            </NavDropdown>

            
            
            <Nav.Link 
              onClick={() => scrollToSection('footer')} 
              className="nav-link-custom me-3"
            >
              Encontranos
            </Nav.Link>
            
            

            {/* Botón CTA opcional */}
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