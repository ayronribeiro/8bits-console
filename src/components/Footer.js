import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sobre Nós</h3>
          <p>
            Somos uma loja online dedicada a oferecer os melhores produtos com qualidade e preços competitivos.
          </p>
        </div>

        <div className="footer-section">
          <h3>Contato</h3>
          <ul className="contact-info">
            <li>
              <i className="fas fa-phone"></i> (21) 98038-2651
            </li>
            <li>
              <i className="fas fa-envelope"></i> contato@8bitconsoles.com.br
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i> Rua Frei Luiz Alevato, 539 - Jacarepaguá
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Redes Sociais</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Sua Loja. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer; 