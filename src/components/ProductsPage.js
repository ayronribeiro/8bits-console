import React from 'react';
import Products from './Products';
import './ProductsPage.css';

const ProductsPage = () => {
  return (
    <div className="products-page">
      <div className="products-page-header">
        <h1>Nossos Produtos</h1>
        <p>Explore nossa coleção completa de produtos</p>
      </div>
      <Products showFilters={true} />
    </div>
  );
};

export default ProductsPage; 