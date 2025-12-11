// src/components/Counter/Counter.jsx
import React, { useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Counter.css';

gsap.registerPlugin(ScrollTrigger);

// Datos de las tarjetas
const statsData = [
  {
    id: 1,
    number: 100,
    suffix: '+',
    label: 'Proyectos Completados',
    icon: 'bi-briefcase'
  },
  {
    id: 2,
    number: 95,
    suffix: '%',
    label: 'Clientes Satisfechos',
    icon: 'bi-emoji-smile'
  },
  {
    id: 3,
    number: 3,
    prefix: '+',
    label: 'Años de Experiencia',
    icon: 'bi-award'
  },
  {
    id: 4,
    number: 24,
    suffix: '/7',
    label: 'Soporte Técnico',
    icon: 'bi-headset'
  }
];

const Counter = () => {
  const statsRef = useRef([]);

  useEffect(() => {
    statsRef.current.forEach((stat, index) => {
      if (!stat) return;

      const number = stat.querySelector('.counter-number-value');
      const icon = stat.querySelector('.counter-icon');

      if (!number) return;

      // Animación del número
      gsap.fromTo(
        number,
        { innerText: 0 },
        {
          innerText: statsData[index].number,
          duration: 2,
          delay: index * 0.2 + 0.5,
          snap: { innerText: 1 },
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stat,
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animación del icono
      if (icon) {
        gsap.fromTo(
          icon,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            delay: index * 0.2 + 0.3,
            ease: 'elastic.out(1, 0.8)',
            scrollTrigger: {
              trigger: stat,
              start: 'top 90%',
              end: 'bottom 10%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToStatsRefs = (el, index) => {
    statsRef.current[index] = el;
  };

  return (
    <section className="counter-section py-5">
      <Container>
        <Row className="justify-content-center g-4">
          {statsData.map((stat, index) => (
            <Col key={stat.id} xs={6} md={3}>
              <div
                ref={el => addToStatsRefs(el, index)}
                className="counter-item text-center"
              >
                <div className="counter-icon-wrapper mb-3">
                  <i className={`counter-icon ${stat.icon}`} />
                </div>

                <h3 className="counter-number fw-bold mb-1 text-light">
                  {stat.prefix && (
                    <span className="counter-prefix">{stat.prefix}</span>
                  )}
                  <span className="counter-number-value">
                    {stat.number}
                  </span>
                  {stat.suffix && (
                    <span className="counter-suffix">{stat.suffix}</span>
                  )}
                </h3>

                <p className="counter-label mb-0 text-light">
                  {stat.label}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Counter;
