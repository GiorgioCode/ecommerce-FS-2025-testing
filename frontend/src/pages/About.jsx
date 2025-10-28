// Página About - Información sobre la tienda y el equipo
// Página estática con información corporativa y de contacto
import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      {/* Header de la página */}
      <div className="page-header">
        <h1>Acerca de TechStore</h1>
        <p>Conoce nuestra historia y compromiso con la excelencia</p>
      </div>

      {/* Sección principal de la empresa */}
      <section className="about-content">
        <div className="about-section">
          <div className="about-text">
            <h2>Nuestra Historia</h2>
            <p>
              TechStore nació en 2020 con la visión de acercar la tecnología Apple 
              a todos los usuarios, ofreciendo productos originales, servicio excepcional 
              y precios competitivos.
            </p>
            <p>
              Durante más de 3 años, hemos servido a miles de clientes satisfechos, 
              construyendo una reputación sólida basada en la confianza, calidad 
              y atención personalizada.
            </p>
            <p>
              Nuestro compromiso es simple: proporcionar la mejor experiencia de 
              compra de productos Apple, desde iPhones hasta MacBooks, con el 
              respaldo de un equipo apasionado por la tecnología.
            </p>
          </div>
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500" 
              alt="Interior de tienda Apple moderna"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Sección de valores */}
      <section className="values-section">
        <h2>Nuestros Valores</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon">🎯</div>
            <h3>Excelencia</h3>
            <p>
              Nos esforzamos por ofrecer productos y servicios de la más alta calidad, 
              superando las expectativas de nuestros clientes.
            </p>
          </div>
          <div className="value-item">
            <div className="value-icon">🤝</div>
            <h3>Confianza</h3>
            <p>
              Construimos relaciones duraderas basadas en la transparencia, 
              honestidad y cumplimiento de nuestros compromisos.
            </p>
          </div>
          <div className="value-item">
            <div className="value-icon">💡</div>
            <h3>Innovación</h3>
            <p>
              Constantemente mejoramos nuestra plataforma y servicios para 
              brindar una experiencia de compra única y moderna.
            </p>
          </div>
          <div className="value-item">
            <div className="value-icon">🌱</div>
            <h3>Sostenibilidad</h3>
            <p>
              Promovemos prácticas responsables y apoyamos el compromiso 
              de Apple con el medio ambiente.
            </p>
          </div>
        </div>
      </section>

      {/* Sección del equipo */}
      <section className="team-section">
        <h2>Nuestro Equipo</h2>
        <p className="team-intro">
          Contamos con un equipo de profesionales apasionados por la tecnología Apple
        </p>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">👨‍💼</div>
            <h4>Carlos Rodríguez</h4>
            <p className="member-role">CEO & Fundador</p>
            <p className="member-bio">
              15 años de experiencia en retail de tecnología y especialista certificado Apple.
            </p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍💻</div>
            <h4>Ana González</h4>
            <p className="member-role">Directora de Tecnología</p>
            <p className="member-bio">
              Experta en desarrollo web y sistemas, encargada de nuestra plataforma digital.
            </p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👨‍🔧</div>
            <h4>Miguel Torres</h4>
            <p className="member-role">Jefe de Soporte Técnico</p>
            <p className="member-bio">
              Técnico certificado Apple con más de 10 años ayudando a usuarios con sus dispositivos.
            </p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍💼</div>
            <h4>Laura Martínez</h4>
            <p className="member-role">Gerente de Atención al Cliente</p>
            <p className="member-bio">
              Especialista en experiencia del cliente, asegurando la satisfacción en cada compra.
            </p>
          </div>
        </div>
      </section>

      {/* Sección de contacto */}
      <section className="contact-section">
        <h2>Contáctanos</h2>
        <div className="contact-info">
          <div className="contact-item">
            <h4>📍 Dirección</h4>
            <p>
              Av. Tecnología 123<br />
              Centro Comercial Tech Plaza<br />
              Ciudad de México, CDMX 01000
            </p>
          </div>
          <div className="contact-item">
            <h4>📞 Teléfono</h4>
            <p>
              +52 (55) 1234-5678<br />
              Lunes a Viernes: 9:00 AM - 8:00 PM<br />
              Sábados: 10:00 AM - 6:00 PM
            </p>
          </div>
          <div className="contact-item">
            <h4>📧 Email</h4>
            <p>
              info@techstore.mx<br />
              soporte@techstore.mx<br />
              ventas@techstore.mx
            </p>
          </div>
          <div className="contact-item">
            <h4>🌐 Redes Sociales</h4>
            <p>
              @TechStoreMX en todas las plataformas<br />
              Facebook | Instagram | Twitter<br />
              YouTube: TechStore México
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para encontrar tu próximo dispositivo Apple?</h2>
          <p>Explora nuestra colección completa y encuentra el producto perfecto para ti</p>
          <a href="/products" className="cta-button">
            Ver Productos
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
