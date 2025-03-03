import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  return (
    <div className="payment-success">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Pagamento Realizado com Sucesso!</h1>
        <p>Obrigado por sua compra. Seu pedido foi processado com sucesso.</p>
        <div className="success-actions">
          <Link to="/produtos" className="continue-shopping">
            Continuar Comprando
          </Link>
          <Link to="/" className="go-home">
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 