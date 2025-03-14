import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Notification from './Notification';
import { STRAPI_URL } from '../config';
import './Products.css';

const Products = ({ showFilters = false }) => {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sliderValue, setSliderValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('https://certain-dinosaur-423c97af88.strapiapp.com/api/produtos?populate=*');
        const data = await response.json();
        console.log('Dados do produto:', data.data[0]);
        console.log('URL da imagem:', data.data[0]?.attributes?.imagemPrincipal?.data?.attributes?.url);
        if (data && data.data) {
          setProdutos(data.data);
          setFilteredProdutos(data.data);
        } else {
          setError('Formato de dados inválido');
          setProdutos([]);
          setFilteredProdutos([]);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Erro ao carregar produtos');
        setProdutos([]);
        setFilteredProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    if (!showFilters) {
      setFilteredProdutos(produtos);
      return;
    }

    let filtered = [...produtos];

    if (searchTerm) {
      filtered = filtered.filter(produto => 
        produto.attributes.tituleProduto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange.min !== '') {
      filtered = filtered.filter(produto => 
        produto.attributes.precoProduto >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(produto => 
        produto.attributes.precoProduto <= parseFloat(priceRange.max)
      );
    }

    setFilteredProdutos(filtered);
  }, [searchTerm, priceRange, produtos, showFilters]);

  const handleAddToCart = (e, produto) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(produto);
    setNotification({
      show: true,
      message: `${produto.attributes.tituleProduto} adicionado ao carrinho!`
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (e, type) => {
    const value = e.target.value;
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setSliderValue(value);
    setPriceRange(prev => ({
      ...prev,
      max: value
    }));
  };

  const handleApplyFilter = () => {
    setIsModalOpen(false);
  };

  const getDescriptionText = (descricaoProduto) => {
    if (!descricaoProduto || !descricaoProduto[0]?.children) return '';
    return descricaoProduto[0].children[0].text;
  };

  const getImageUrl = (produto) => {
    try {
      if (!produto?.attributes?.imagemPrincipal?.data?.attributes?.url) {
        return 'https://via.placeholder.com/300x300?text=Sem+Imagem';
      }
      const imageUrl = produto.attributes.imagemPrincipal.data.attributes.url;
      console.log('URL original:', imageUrl);
      if (imageUrl.includes('media.strapiapp.com')) {
        return imageUrl;
      }
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      // Para URLs relativas
      return `https://certain-dinosaur-423c97af88.media.strapiapp.com${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    } catch (error) {
      console.error('Erro ao processar URL da imagem:', error);
      return 'https://via.placeholder.com/300x300?text=Sem+Imagem';
    }
  };

  if (loading) {
    return <div className="products-loading">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="products-error">{error}</div>;
  }

  if (!produtos || produtos.length === 0) {
    return <div className="products-empty">Nenhum produto encontrado</div>;
  }

  const FilterContent = () => (
    <>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="price-filter">
        <div className="price-range">
          <label>Faixa de Preço</label>
          <div className="value-display">R$ {Number(sliderValue).toFixed(2)}</div>
          <input
            type="range"
            min="0"
            max="10000"
            value={sliderValue}
            onChange={handleSliderChange}
          />
          <div className="price-inputs">
            <div className="price-input-group">
              <label htmlFor="min-price">Mínimo:</label>
              <input
                type="number"
                id="min-price"
                value={priceRange.min}
                onChange={(e) => handlePriceChange(e, 'min')}
                placeholder="R$ 0,00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="price-input-group">
              <label htmlFor="max-price">Máximo:</label>
              <input
                type="number"
                id="max-price"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(e, 'max')}
                placeholder="R$ 0,00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>
      <button className="apply-filter" onClick={handleApplyFilter}>
        Aplicar Filtros
      </button>
    </>
  );

  return (
    <section className="products-section">
      {notification.show && (
        <Notification
          message={notification.message}
          onClose={() => setNotification({ show: false, message: '' })}
        />
      )}
      <div className="products-container">
        {showFilters && (
          <>
            <button className="mobile-filter-button" onClick={() => setIsModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="21" y1="4" x2="14" y2="4"></line>
                <line x1="10" y1="4" x2="3" y2="4"></line>
                <line x1="21" y1="12" x2="12" y2="12"></line>
                <line x1="8" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="20" x2="16" y2="20"></line>
                <line x1="12" y1="20" x2="3" y2="20"></line>
                <line x1="14" y1="2" x2="14" y2="6"></line>
                <line x1="8" y1="10" x2="8" y2="14"></line>
                <line x1="16" y1="18" x2="16" y2="22"></line>
              </svg>
              Filtrar Produtos
            </button>

            <div className="products-filters">
              <FilterContent />
            </div>
          </>
        )}

        <div className="products-grid">
          {filteredProdutos.map((produto) => (
            <Link 
              to={`/produto/${produto.id}`} 
              key={produto.id} 
              className="product-card"
            >
              <div className="product-image-container">
                <img
                  src={getImageUrl(produto)}
                  alt={produto.attributes?.tituleProduto || 'Produto'}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Sem+Imagem';
                  }}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{produto.attributes?.tituleProduto || 'Sem título'}</h3>
                <div className="product-rating">
                  {'★'.repeat(produto.attributes?.avaliacaoProduto || 0)}
                  {'☆'.repeat(5 - (produto.attributes?.avaliacaoProduto || 0))}
                </div>
                <p className="product-description">
                  {getDescriptionText(produto.attributes?.descricaoProduto)}
                </p>
                <div className="product-price-container">
                  <span className="product-price">
                    R$ {produto.attributes?.precoProduto?.toFixed(2) || '0.00'}
                  </span>
                  <button 
                    className="add-to-cart-button"
                    onClick={(e) => handleAddToCart(e, produto)}
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
                <div className="product-stock">
                  Estoque: {produto.attributes?.estoqueProduto || '0'} unidades
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showFilters && (
        <div className={`filter-modal ${isModalOpen ? 'active' : ''}`}>
          <div className="filter-modal-content">
            <div className="filter-header">
              <h3>Filtrar Produtos</h3>
              <button className="close-filter" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </section>
  );
};

export default Products; 
