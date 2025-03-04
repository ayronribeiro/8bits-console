import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingItemId, setAnimatingItemId] = useState(null);
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    setIsAnimating(true);
    setAnimatingItemId(itemId);
    setTimeout(() => {
      removeFromCart(itemId);
      setIsAnimating(false);
      setAnimatingItemId(null);
    }, 300);
  };

  const handleCheckout = () => {
    navigate('/pagamento');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
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
                <div 
                  key={item.id} 
                  className={`cart-item ${animatingItemId === item.id && isAnimating ? 'removing' : ''}`}
                >
                  <img
                    src={item.image || 'https://via.placeholder.com/100x100?text=Sem+Imagem'}
                    alt={item.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <div className="cart-item-price">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="cart-item-quantity">
                      <button 
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
              <button 
                className="checkout-button"
                onClick={handleCheckout}
              >
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