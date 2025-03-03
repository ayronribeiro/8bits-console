import React from 'react';
import { Link } from 'react-router-dom';
import Products from './Products';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Bem-vindo à Nossa Loja</h1>
          <p>Descubra produtos incríveis com os melhores preços</p>
          <Link to="/produtos" className="cta-button">Ver Produtos</Link>
        </div>
      </section>
      <Products />
    </div>
  );
};

export default Home; 