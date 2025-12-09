import React, { useEffect, useRef } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Packs.css"

import portonImg from '../../../assets/garaje.jpg';
import seguridadImg from '../../../assets/cam-solita.webp';
import comodidadImg from '../../../assets/tablet.jpg';
import smartImg from '../../../assets/pareja-luz.jpg';

gsap.registerPlugin(ScrollTrigger);

const Packs = () => {
    const cardsRef = useRef([]);

    const packs = [
        {
            id: 1,
            title: "Kit Completo de Portón Inteligente",
            image: portonImg,
            description:
                "Automatizá tu portón y controlalo desde el celular. Ideal para mejorar seguridad y comodidad.",
            features: [
                "Motor + cremallera + placa",
                "Soporte metálico",
                "Control WiFi desde el celular",
                "Control de iluminación del garaje",
            ],
        },
        {
            id: 2,
            title: "Combo Seguridad",
            image: seguridadImg,
            description:
                "Protegé tu hogar con sensores y cámaras inteligentes que se activan automáticamente.",
            features: [
                "Cámara inteligente",
                "Sensor de movimiento",
                "Iluminación automática",
            ],
        },
        {
            id: 3,
            title: "Combo Comodidad",
            image: comodidadImg,
            description:
                "Soluciones inteligentes para mejorar tu día a día sin esfuerzo.",
            features: [
                "Cerradura inteligente",
                "Control aire acondicionado",
                "Control inteligente de ventilador",
            ],
        },
        {
            id: 4,
            title: "Pack Smart Home Inicial",
            image: smartImg,
            description:
                "El punto de partida ideal para comenzar tu hogar inteligente.",
            features: ["Asistente Alexa o Google", "Aspiradora robot", "Cámara interior"],
        },
    ];

    const handleWhatsapp = (packTitle) => {
        const mensaje = `Hola! Me gustaría consultar por el pack "${packTitle}". ¿Me podrías dar más información?`;
        const url = `https://wa.me/5493855724629?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
    };

    useEffect(() => {
        cardsRef.current.forEach((card, index) => {
            if (!card) return;

            gsap.fromTo(
                card,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                    },
                }
            );
        });
    }, []);

    const addRef = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    return (
        <section className="packs-section py-5">
            <Container>
                <h2 className="display-4 mb-3 text-center">Nuestros Packs</h2>
                <p className="text-center section-subtitle mb-5">
                    Soluciones pensadas para cada necesidad del hogar
                </p>

                <Row>
                    {packs.map((pack) => (
                        <Col key={pack.id} xs={12} md={6} lg={3} className="mb-4 d-flex">
                            <Card ref={addRef} className="pack-card shadow-lg h-100 d-flex flex-column">
                                <div className="card-img-wrapper">
                                    <Card.Img
                                        variant="top"
                                        src={pack.image}
                                        className="pack-card-img"
                                    />
                                </div>

                                <Card.Body className="text-light">
                                    <Card.Title className="pack-card-title">
                                        {pack.title}
                                    </Card.Title>

                                    <Card.Text className="pack-card-description">
                                        {pack.description}
                                    </Card.Text>

                                    <div className="pack-card-features">
                                        {pack.features.map((f, i) => (
                                            <p key={i}>✔ {f}</p>
                                        ))}
                                    </div>

                                    <button
                                        className="btn pack-card-btn mt-auto"
                                        onClick={() => handleWhatsapp(pack.title)}
                                    >
                                        Consultar por WhatsApp
                                    </button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default Packs;
