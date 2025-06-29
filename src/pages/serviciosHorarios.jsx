// src/components/ServiciosHorarios.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/main.scss";

import GroomingIcon from "../assets/images/groomingIcon.png"; 
import UltrasonidoIcon from "../assets/images/ultrasonoLogo.png";
import EcoIcon from "../assets/images/ecocardioIcon.png";
import RayosXIcon from "../assets/images/rayosXIcon.png";
import PetshopIcon from "../assets/images/petshopIcon.png";

const ServiciosHorarios = () => {
  const servicios = [
    { title: "Grooming", icon: GroomingIcon },
    { title: "Ultrasonografía", icon: UltrasonidoIcon },
    { title: "Ecocardiograma", icon: EcoIcon },
    { title: "Rayos X", icon: RayosXIcon },
    { title: "Petshop", icon: PetshopIcon },
  ];

  return (
    <section id="servicios" className="serviHora container-fluid py-5">
      <h2 className="serviHoraTitulo fw-bold mb-4 display-5">
        Nuestros servicios
      </h2>

      <div className="servicios">
        {servicios.map(({ title, icon }) => (
          <div key={title} className="serviHora__services-item">
            <div className="serviHora__services-item__icon">
              <img src={icon} alt={title} />
            </div>
            <p className="serviHora__services-item__label">{title}</p>
          </div>
        ))}
      </div>


      <h2 className="serviHora__schedule__title fw-bold mt-5 mb-4 display-5">
        Horarios de atención
      </h2>

      <div className="horarioBox">
        <div className="serviHora__schedule__box">
          <dl className="serviHora__schedule__list">
            <dt>Lunes a viernes:</dt>
            <dd>8:00 A.M. – 4:00 P.M.</dd>
            <dt>Sábado:</dt>
            <dd>7:00 A.M. – 1:00 P.M.</dd>
            <dt>Domingo:</dt>
            <dd>Cerrado</dd>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default ServiciosHorarios;
