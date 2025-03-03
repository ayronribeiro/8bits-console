import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    setIsAnimating(true);
    setTimeout(() => {
      removeFromCart(productId);
      setIsAnimating(false);
    }, 300);
  };

  const handleCheckout = () => {
    navigate('/pagamento');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Seu carrinho está vazio</p>
            <Link to="/produtos" className="continue-shopping" onClick={onClose}>
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className={`cart-item ${isAnimating ? 'removing' : ''}`}>
                  <img
                    src={`https://strapi-products.onrender.com${item.image}`}
                    alt={item.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <p className="cart-item-price">R$ {item.price.toFixed(2)}</p>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="quantity-button"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="quantity-button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="checkout-button">
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart; 