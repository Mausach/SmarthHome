import HeroSection from './Componentes/Hero_seccion'
import ServicesSection from './Componentes/Servicios_Productos'
import ProcessSection from './Componentes/Procesos'
import ProjectsSection from './Componentes/Proyectos'
import FAQSection from './Componentes/Preguntas_Faq'
import { Footer } from './Componentes/Foother'
import Packs from './Componentes/Packs'
import Beneficios from './Componentes/Beneficios'
import PorqueElegirnos from './Componentes/PorqueElegirnos'
import Counter from './Componentes/Counter'
import Navbarsh from './Componentes/Navbar'

export const Home = () => {
  return (
    <div>

      <div id="inicio">
        <Navbarsh/>
        <HeroSection />
      </div>

      <div id="serv">
        <ServicesSection />
      </div>

      <div id="packs">
        <Packs />
      </div>

      <div id="beneficios">
        <Beneficios />
      </div>

      <div id="porqueElegirnos">
        <PorqueElegirnos />
      </div>

      <div id="Counter">
        <Counter />
      </div>

      <div id="proceso">
        <ProcessSection />
      </div>

      <div id="testimonios">
        <ProjectsSection />
      </div>

      <div id="faq">
        <FAQSection />
      </div>

      <div id="footer">
        <Footer />
      </div>
    
    </div>
  )
}
