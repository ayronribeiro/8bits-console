// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { getHeaderData } from '../api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import './Header.css';

const Header = () => {
  const [headerData, setHeaderData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const fetchHeaderData = async () => {
      const data = await getHeaderData();
      setHeaderData(data[0]?.attributes); 
    };
    fetchHeaderData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (!headerData) return <p>Carregando...</p>;

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <h1>8Bits Console</h1>
          </Link>
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/produtos" onClick={() => setIsMenuOpen(false)}>Produtos</Link></li>
            <li><Link to="/sobre" onClick={() => setIsMenuOpen(false)}>Sobre</Link></li>
            <li><Link to="/contato" onClick={() => setIsMenuOpen(false)}>Contato</Link></li>
          </ul>
        </nav>
      </header>
      <button 
        className="floating-cart-button"
        onClick={() => setIsCartOpen(true)}
        aria-label="Abrir carrinho"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {cartItemCount > 0 && (
          <span className="cart-count">{cartItemCount}</span>
        )}
      </button>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
