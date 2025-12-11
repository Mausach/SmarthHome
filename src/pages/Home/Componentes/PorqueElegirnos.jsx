import React, { useEffect, useRef } from "react";
import "./PorqueElegirnos.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PorqueElegirnos = () => {
  const items = [
    {
      icon: "fa-solid fa-user-check",
      title: "Profesionales Certificados",
      desc: "Técnicos con experiencia real en instalación y automatización del hogar.",
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "Seguridad Garantizada",
      desc: "Equipos confiables, configurados para brindarte protección 24/7.",
    },
    {
      icon: "fa-solid fa-microchip",
      title: "Equipos de Última Generación",
      desc: "Tecnología moderna y actualizada para que tu hogar funcione como un SmartHome real.",
    },
    {
      icon: "fa-solid fa-wifi",
      title: "Tecnología Inteligente",
      desc: "Soluciones integradas que podés controlar desde tu celular o asistente virtual.",
    },
    {
      icon: "fa-solid fa-headset",
      title: "Soporte y Acompañamiento",
      desc: "Asistencia post-instalación para que nunca tengas dudas con tu sistema.",
    },
  ];

  const textRef = useRef(null);
  const itemsRef = useRef([]);

  const addItemRef = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Animación de los párrafos de texto (texto “nosotros”)
    if (textRef.current) {
      const paragraphs = textRef.current.querySelectorAll("p");

      gsap.fromTo(
        paragraphs,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Animación de cada item de la lista de beneficios
    itemsRef.current.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  return (
    <section className="porque2-section py-5">
      <div className="container">
        <h2 className="text-center mb-3">¿Por Qué Elegir SmartHome?</h2>

        <div className="text-nosotros" ref={textRef}>
          <p>
            En <span className="marca">SmartHome</span>, nos apasiona crear
            entornos más seguros, eficientes y confortables para tu día a día.
          </p>

          <p>
            Con más de 3 años de experiencia en el sector, hemos desarrollado
            soluciones personalizadas que se adaptan a las necesidades
            específicas de cada cliente. Nuestro equipo de expertos combina
            tecnología de vanguardia con un <span className="marca">servicio al cliente excepcional</span>.
          </p>

          <p>
            Creemos que la tecnología debe simplificar la vida y brindar
            seguridad. Por eso, nos encargamos de todo el proceso: desde el
            asesoramiento inicial hasta la instalación y el soporte continuo.
          </p>
        </div>

        <div className="porque2-list">
          {items.map((item, index) => (
            <div className="porque2-item" key={index} ref={addItemRef}>
              <div className="icon-wrapper">
                <i className={item.icon}></i>
              </div>

              <div className="porque2-text">
                <span className="porque2-title">{item.title}</span>
                <p className="porque2-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PorqueElegirnos;
