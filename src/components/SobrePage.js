import React from 'react';
import './SobrePage.css';

const SobrePage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>Sobre Nós</h1>
        
        <section className="about-section">
          <h2>Nossa História</h2>
          <p>
            Fundada com a visão de oferecer produtos de qualidade excepcional, nossa loja tem se dedicado
            a proporcionar a melhor experiência de compra para nossos clientes. Ao longo dos anos,
            construímos uma reputação sólida baseada em confiança, qualidade e excelente atendimento.
          </p>
        </section>

        <section className="about-section">
          <h2>Nossa Missão</h2>
          <p>
            Nossa missão é fornecer produtos de alta qualidade, mantendo preços competitivos e um
            atendimento personalizado. Buscamos constantemente inovar e melhorar nossos serviços para
            superar as expectativas dos nossos clientes.
          </p>
        </section>

        <section className="about-section">
          <h2>Nossos Valores</h2>
          <div className="values-grid">
            <div className="value-item">
              <i className="fas fa-heart"></i>
              <h3>Qualidade</h3>
              <p>Comprometimento com a excelência em todos os nossos produtos.</p>
            </div>
            <div className="value-item">
              <i className="fas fa-handshake"></i>
              <h3>Confiança</h3>
              <p>Construindo relacionamentos duradouros com nossos clientes.</p>
            </div>
            <div className="value-item">
              <i className="fas fa-star"></i>
              <h3>Inovação</h3>
              <p>Sempre buscando as melhores soluções para nossos clientes.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Nossa Equipe</h2>
          <p>
            Contamos com uma equipe dedicada e apaixonada, sempre pronta para oferecer o melhor
            atendimento e suporte aos nossos clientes. Nossos profissionais são constantemente
            treinados para garantir a excelência em todos os aspectos do nosso serviço.
          </p>
        </section>
      </div>
    </div>
  );
};

export default SobrePage; 