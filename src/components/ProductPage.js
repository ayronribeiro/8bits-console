import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Notification from './Notification';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`https://certain-dinosaur-423c97af88.strapiapp.com/api/produtos/${id}?populate=*`);
        const data = await response.json();
        if (data && data.data) {
          setProduto(data.data);
        } else {
          setError('Produto não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  const handleAddToCart = () => {
    if (quantity < 1) return;
    
    // Add the product to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(produto);
    }
    
    setShowQuantityModal(false);
    setQuantity(1);
    setNotification({
      show: true,
      message: `${quantity} ${quantity === 1 ? 'unidade' : 'unidades'} de ${produto.attributes.tituleProduto} adicionada${quantity === 1 ? '' : 's'} ao carrinho!`
    });
  };

  if (loading) {
    return <div className="product-page-loading">Carregando produto...</div>;
  }

  if (error) {
    return <div className="product-page-error">{error}</div>;
  }

  if (!produto) {
    return <div className="product-page-empty">Produto não encontrado</div>;
  }

  const getDescriptionText = (descricaoProduto) => {
    if (!descricaoProduto || !descricaoProduto[0]?.children) return '';
    return descricaoProduto[0].children[0].text;
  };

  const getImageUrl = (imagemPrincipal) => {
    try {
      if (!imagemPrincipal?.data?.attributes?.url) {
        return 'https://via.placeholder.com/600x600?text=Sem+Imagem';
      }
      const imageUrl = imagemPrincipal.data.attributes.url;
      console.log('URL original:', imageUrl);
      // Se a URL já contém o domínio completo do Strapi Media
      if (imageUrl.includes('media.strapiapp.com')) {
        return imageUrl;
      }
      // Se a URL começa com http mas não é do media.strapiapp.com
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      // Para URLs relativas
      return `https://certain-dinosaur-423c97af88.media.strapiapp.com${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    } catch (error) {
      console.error('Erro ao processar URL da imagem:', error);
      return 'https://via.placeholder.com/600x600?text=Sem+Imagem';
    }
  };

  return (
    <div className="product-page">
      {notification.show && (
        <Notification
          message={notification.message}
          onClose={() => setNotification({ show: false, message: '' })}
        />
      )}
      <div className="product-page-container">
        <div className="product-page-content">
          <div className="product-page-images">
            <div className="product-page-main-image">
              <img
                src={getImageUrl(produto.attributes.imagemPrincipal)}
                alt={produto.attributes.tituleProduto}
                className="product-page-image"
              />
            </div>
            {produto.attributes.imagemDetalhes?.data && (
              <div className="product-page-gallery">
                {produto.attributes.imagemDetalhes.data.map((imagem) => (
                  <div key={imagem.id} className="product-page-gallery-item">
                    <img
                      src={imagem.attributes.url.includes('media.strapiapp.com') 
                        ? imagem.attributes.url 
                        : `https://certain-dinosaur-423c97af88.media.strapiapp.com${imagem.attributes.url.startsWith('/') ? '' : '/'}${imagem.attributes.url}`}
                      alt={`${produto.attributes.tituleProduto} - Detalhe`}
                      className="product-page-gallery-image"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="product-page-info">
            <h1 className="product-page-title">{produto.attributes.tituleProduto}</h1>
            <div className="product-page-rating">
              {'★'.repeat(produto.attributes.avaliacaoProduto)}
              {'☆'.repeat(5 - produto.attributes.avaliacaoProduto)}
            </div>
            <div className="product-page-price">
              R$ {produto.attributes.precoProduto.toFixed(2)}
            </div>
            <div className="product-page-stock">
              Estoque: {produto.attributes.estoqueProduto} unidades
            </div>
            <p className="product-page-description">
              {getDescriptionText(produto.attributes.descricaoProduto)}
            </p>
            <div className="product-page-payment-methods">
              <h3>Formas de Pagamento:</h3>
              <ul>
                {produto.attributes.metodoPagamento.map((metodo) => (
                  <li key={metodo.id}>{metodo.titulo}</li>
                ))}
              </ul>
            </div>
            <button 
              className="product-page-add-to-cart"
              onClick={() => setShowQuantityModal(true)}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      {showQuantityModal && (
        <div className="quantity-modal-overlay">
          <div className="quantity-modal">
            <h3>Selecione a quantidade</h3>
            <div className="quantity-controls">
              <button 
                className="quantity-button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-button"
                onClick={() => setQuantity(prev => Math.min(produto.attributes.estoqueProduto, prev + 1))}
              >
                +
              </button>
            </div>
            <div className="quantity-modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowQuantityModal(false);
                  setQuantity(1);
                }}
              >
                Cancelar
              </button>
              <button 
                className="confirm-button"
                onClick={handleAddToCart}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;