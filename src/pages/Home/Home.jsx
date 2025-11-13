import React from 'react'
import Navbarsh from './Componentes/Navbar'
import HeroSection from './Componentes/Hero_seccion'
import ServicesSection from './Componentes/Servicios_Productos'
import ProcessSection from './Componentes/Procesos'
import ProjectsSection from './Componentes/Proyectos'
import AboutSection from './Componentes/Nosotros'
import FAQSection from './Componentes/Preguntas_Faq'
import { Footer } from './Componentes/Foother'

export const Home = () => {
  return (
    <div>
    
      <div id="inicio">
        <HeroSection />
      </div>

      <div id="serv">
        <ServicesSection />
      </div>
      
      <div id="procesos">
        <ProcessSection/>
      </div>

      <div id="proyectos">
        <ProjectsSection/>
      </div>

      <div id="nosotros">
        <AboutSection/>
      </div>

      <div id="faq">
        <FAQSection/>
      </div>

      <div id="footer">
        <Footer/>
      </div>
      Smart Home
    </div>
  )
}
